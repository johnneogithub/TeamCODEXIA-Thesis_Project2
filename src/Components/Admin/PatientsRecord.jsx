import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import Sidebar from '../Global/Sidebar';
import './PatientsRecordStyle.css';

function PatientsRecord() {
  const [patientsRecords, setPatientsRecords] = useState([]);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    const firestore = getFirestore();
    try {
      const recordsSnapshot = await getDocs(collection(firestore, 'patientsRecords'));
      const recordsData = recordsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setPatientsRecords(recordsData);
    } catch (error) {
      console.error("Error fetching patient records: ", error);
    }
  };

  const handleDeleteRecord = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        const firestore = getFirestore();
        await deleteDoc(doc(firestore, 'patientsRecords', id));
        setPatientsRecords(prev => prev.filter(record => record.id !== id));
      } catch (error) {
        console.error("Error deleting record: ", error);
        alert("Failed to delete the record. Please try again.");
      }
    }
  };

  const handleViewDetails = (record) => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `patient_${record.name.replace(/\s+/g, '_')}_${timestamp}`;

    // Create and download the text file with appointment details
    const content = `
Patient Appointment Record

Name: ${record.name || 'N/A'}
Email: ${record.email || 'N/A'}
Age: ${record.age || 'N/A'}
Type of Appointment: ${record.appointmentType || 'N/A'}
Date: ${record.date || 'N/A'}
Time: ${record.time || 'N/A'}
`;

    const textBlob = new Blob([content], { type: 'text/plain' });
    const textUrl = URL.createObjectURL(textBlob);
    const textLink = document.createElement('a');
    textLink.href = textUrl;
    textLink.download = `${folderName}/patient_details.txt`;
    document.body.appendChild(textLink);
    textLink.click();
    document.body.removeChild(textLink);
    URL.revokeObjectURL(textUrl);

    // If there's an imported file, download it as well
    if (record.importedFile && record.importedFile.data) {
      const binaryString = atob(record.importedFile.data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: record.importedFile.type });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${folderName}/${record.importedFile.name}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }

    // Show instructions to the user
    alert(`Files have been downloaded with the prefix "${folderName}/". Please create a folder named "${folderName}" and move these files into it for better organization.`);
  };

  return (
    <div className="patients-record-container">
      <Sidebar />
      <main className="patients-record-main">
        <div className="patients-record-header">
          <h1>Patients Records</h1>
          <button className="btn btn-primary">Download ll Records</button>
        </div>
        <div className="patients-record-content">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Age</th>
                  <th>Type of Appointment</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {patientsRecords.map((record, index) => (
                  <tr key={record.id}>
                    <td>{index + 1}</td>
                    <td>{record.name || 'N/A'}</td>
                    <td>{record.email || 'N/A'}</td>
                    <td>{record.age || 'N/A'}</td>
                    <td>{record.appointmentType || 'N/A'}</td>
                    <td>{record.date || 'N/A'}</td>
                    <td>{record.time || 'N/A'}</td>
                    <td>
                      <button className="btn btn-primary btn-sm me-2" onClick={() => handleViewDetails(record)}>
                        <i className="bi bi-download"></i> Download
                      </button>
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRecord(record.id)}>
                        <i className="bi bi-trash"></i>
                      </button>
                      {record.importedFile && (
                        <span className="ms-2 text-success">
                          <i className="bi bi-file-earmark-check"></i>
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientsRecord;
