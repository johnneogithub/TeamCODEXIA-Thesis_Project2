import React, { useState, useEffect } from 'react';
import Sidebar from '../Global/Sidebar';
import './PatientsRecordStyle.css';

function PatientsRecord() {
  const [patientsRecords, setPatientsRecords] = useState([]);

  useEffect(() => {
    const storedRecords = JSON.parse(localStorage.getItem('patientsRecords') || '[]');
    setPatientsRecords(storedRecords);
  }, []);

  const handleDeleteRecord = (index) => {
    const updatedRecords = [...patientsRecords];
    updatedRecords.splice(index, 1);
    setPatientsRecords(updatedRecords);
    localStorage.setItem('patientsRecords', JSON.stringify(updatedRecords));
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
                  <tr key={index}>
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
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteRecord(index)}>
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
