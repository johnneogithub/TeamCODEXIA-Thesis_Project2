const express = require('express');
const admin = require("firebase-admin");
const path = require('path');
const fetch = require('node-fetch');
const cors = require('cors');
const https = require('https');
const JSZip = require('jszip');
const archiver = require('archiver');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Use path.join to create a relative path to your service account key
const serviceAccount = require(path.join(__dirname, 'config', 'serviceAccountKey.json'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "planitfamit.appspot.com" // Your actual Firebase Storage bucket
});

const app = express();
app.use(express.json());
app.use(cors());

const zipJobs = new Map();

app.post('/api/getSignedUrl', async (req, res) => {
  try {
    console.log("Received request for signed URL");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    const { fileName, fileId } = req.body;
    console.log("File name:", fileName, "File ID:", fileId);

    if (!admin.storage) {
      throw new Error('Firebase Storage is not initialized');
    }

    const bucket = admin.storage().bucket();
    if (!bucket) {
      throw new Error('Failed to get storage bucket');
    }

    const filePath = `appointments/${fileId}/${fileName}`;
    console.log("Constructed file path:", filePath);
    const file = bucket.file(filePath);
    
    console.log("Generating signed URL");
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    
    console.log("Signed URL generated:", signedUrl);
    res.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate signed URL', details: error.message, stack: error.stack });
  }
});

app.get('/api/get-signed-url', async (req, res) => {
  const fileUrl = req.query.url;
  console.log('Generating signed URL for:', fileUrl);
  
  try {
    const bucket = admin.storage().bucket();
    const urlParts = new URL(fileUrl);
    const pathParts = urlParts.pathname.split('/');
    const fileName = decodeURIComponent(pathParts[pathParts.length - 1].split('?')[0]);
    const filePath = `appointments/${fileName}`;
    console.log('File path:', filePath);

    const file = bucket.file(filePath);
    
    const [fileExists] = await file.exists();
    if (!fileExists) {
      return res.status(404).json({ error: 'File not found' });
    }
    

    console.log('Generating signed URL...');
    const [signedUrl] = await file.getSignedUrl({
      action: 'read',
      expires: Date.now() + 15 * 60 * 1000, // 15 minutes
    });
    
    console.log('Signed URL generated:', signedUrl);
    res.json({ signedUrl });
  } catch (error) {
    console.error('Error generating signed URL:', error);
    res.status(500).json({ error: 'Failed to generate signed URL', details: error.message });
  }
});

app.get('/api/download-file', async (req, res) => {
  const fileUrl = req.query.url;
  if (!fileUrl) {
    return res.status(400).send('URL parameter is required');
  }

  try {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const buffer = await response.buffer();
    res.set('Content-Type', response.headers.get('content-type'));
    res.set('Content-Disposition', 'attachment');
    res.send(buffer);
  } catch (error) {
    console.error('Error downloading file:', error);
    res.status(500).send('Error downloading file');
  }
});

app.post('/api/download-records', async (req, res) => {
  const record = req.body;

  res.writeHead(200, {
    'Content-Type': 'application/zip',
    'Content-Disposition': `attachment; filename=${record.name}_records.zip`
  });

  const archive = archiver('zip', {
    zlib: { level: 5 }
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(res);

  // Add patient info to the zip
  const patientInfo = `Name: ${record.name}\nEmail: ${record.email}\nAge: ${record.age}\nAppointment Type: ${record.appointmentType}\nDate: ${record.date}\nTime: ${record.time}`;
  archive.append(patientInfo, { name: 'patient_info.txt' });

  // Function to fetch and add file to zip
  const addFileToZip = async (fileUrl, fileName) => {
    try {
      const file = admin.storage().bucket().file(fileUrl);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      archive.append(response.body, { name: fileName });
    } catch (error) {
      console.error(`Error adding file ${fileName} to zip:`, error);
      throw error;
    }
  };
  

  // Add regular files to the zip
  if (record.files && record.files.length > 0) {
    for (const file of record.files) {
      await addFileToZip(file.url, file.name);
    }
  }

  // Add imported file to the zip if it exists
  if (record.importedFile && record.importedFile.url) {
    await addFileToZip(record.importedFile.url, record.importedFile.name || 'imported_file');
  }

  archive.finalize();
});

app.post('/api/initiate-download', async (req, res) => {
  const record = req.body;
  const jobId = uuidv4();
  
  zipJobs.set(jobId, { status: 'processing', progress: 0, filePath: null, error: null });
  
  res.json({ jobId });

  const zipFilePath = path.join(__dirname, 'temp', `${jobId}.zip`);
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', { zlib: { level: 5 } });

  output.on('close', () => {
    console.log('Archive has been finalized and the output file descriptor has closed.');
    zipJobs.set(jobId, { status: 'completed', progress: 100, filePath: zipFilePath, error: null });
  });

  archive.on('error', (err) => {
    console.error('Error creating archive:', err);
    zipJobs.set(jobId, { status: 'error', progress: 0, filePath: null, error: err.message });
  });

  archive.pipe(output);

  // Add patient info to the zip
  const patientInfo = `Name: ${record.name}\nEmail: ${record.email}\nAge: ${record.age}\nAppointment Type: ${record.appointmentType}\nDate: ${record.date}\nTime: ${record.time}`;
  archive.append(patientInfo, { name: 'patient_info.txt' });

  // Function to fetch and add file to zip
  const addFileToZip = async (fileUrl, fileName) => {
    try {
      const file = admin.storage().bucket().file(fileUrl);
      const [signedUrl] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 15 * 60 * 1000, // 15 minutes
      });
      const response = await fetch(signedUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      archive.append(response.body, { name: fileName });
    } catch (error) {
      console.error(`Error adding file ${fileName} to zip:`, error);
      throw error;
    }
  };

  const processFiles = async (files, startIndex = 0) => {
    const batchSize = 2; // Reduce batch size to 2
    const endIndex = Math.min(startIndex + batchSize, files.length);
    
    try {
      for (let i = startIndex; i < endIndex; i++) {
        const file = files[i];
        await addFileToZip(file.url, file.name);
        const progress = Math.round(((i + 1) / files.length) * 100);
        zipJobs.set(jobId, { status: 'processing', progress, filePath: null, error: null });
      }

      if (endIndex < files.length) {
        setTimeout(() => processFiles(files, endIndex), 2000); // 2 seconds delay between batches
      } else {
        if (record.importedFile && record.importedFile.url) {
          await addFileToZip(record.importedFile.url, record.importedFile.name || 'imported_file');
        }
        archive.finalize();
      }
    } catch (error) {
      console.error('Error processing files:', error);
      zipJobs.set(jobId, { status: 'error', progress: 0, filePath: null, error: error.message });
    }
  };

  const allFiles = [...(record.files || [])];
  processFiles(allFiles);
});

app.get('/api/download-status/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const job = zipJobs.get(jobId);
  
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  
  res.json(job);
});

app.get('/api/download-zip/:jobId', (req, res) => {
  const jobId = req.params.jobId;
  const job = zipJobs.get(jobId);
  
  if (!job || job.status !== 'completed') {
    return res.status(400).json({ error: 'Zip file not ready' });
  }
  
  res.download(job.filePath, `${jobId}.zip`, (err) => {
    if (err) {
      console.error('Error sending file:', err);
    } else {
      // Clean up the temporary file
      fs.unlink(job.filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temporary file:', unlinkErr);
      });
      zipJobs.delete(jobId);
    }
  });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

server.timeout = 60000; // Set timeout to 60 seconds