import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import Sidebar from '../Global/Sidebar';
import './PatientsRecordStyle.css';
import { useLocation } from 'react-router-dom';
import { FaTrash, FaSearch, FaSort, FaFile, FaDownload } from 'react-icons/fa';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

function PatientsRecord() {
  const [patientsRecords, setPatientsRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const location = useLocation();
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchRecords();

    if (location.state && location.state.newRecord) {
      setPatientsRecords(prevRecords => [location.state.newRecord, ...prevRecords]);
    }
  }, [location]);

  const fetchRecords = async () => {
    const firestore = getFirestore();
    try {
      const q = query(collection(firestore, 'patientsRecords'), orderBy('date', 'desc'), limit(100));
      const recordsSnapshot = await getDocs(q);
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedRecords = React.useMemo(() => {
    let sortableRecords = [...patientsRecords];
    if (sortConfig.key !== null) {
      sortableRecords.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableRecords;
  }, [patientsRecords, sortConfig]);

  const filteredRecords = sortedRecords.filter(record =>
    Object.values(record).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filteredRecords.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
  };

  const closeMessagePopup = () => {
    setSelectedMessage(null);
  };

  const handleDownload = async (record) => {
    // Create the content for the patient info text file
    const content = `
Patient Record
--------------
Name: ${record.name || 'N/A'}
Email: ${record.email || 'N/A'}
Age: ${record.age || 'N/A'}
Appointment Type: ${record.appointmentType || 'N/A'}
Date: ${record.date || 'N/A'}
Time: ${record.time || 'N/A'}
Message: ${record.message || 'N/A'}
Imported File: ${record.importedFile ? record.importedFile.name : 'N/A'}
    `.trim();

    // Create a Blob for the patient info
    const patientInfoBlob = new Blob([content], { type: 'text/plain' });

    // Create a download link for the patient info
    const patientInfoUrl = URL.createObjectURL(patientInfoBlob);
    const patientInfoLink = document.createElement('a');
    patientInfoLink.href = patientInfoUrl;
    patientInfoLink.download = `patient_info_${record.name || 'unknown'}.txt`;
    patientInfoLink.click();

    // Clean up the URL object
    URL.revokeObjectURL(patientInfoUrl);
  };

  return (
    <div className="patients-record-container">
      <Sidebar />
      <main className="patients-record-main">
        <div className="patients-record-header">
          <h1>Patients Records</h1>
          <div className="search-bar">
            <FaSearch />
            <input
              type="text"
              placeholder="Search records..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
        </div>
        <div className="patients-record-content">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th style={{width: '3%'}}>#</th>
                  <th style={{width: '15%'}} onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && <FaSort />}</th>
                  <th style={{width: '15%'}} onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' && <FaSort />}</th>
                  <th style={{width: '5%'}} onClick={() => handleSort('age')}>Age {sortConfig.key === 'age' && <FaSort />}</th>
                  <th style={{width: '15%'}} onClick={() => handleSort('appointmentType')}>Appointment Type {sortConfig.key === 'appointmentType' && <FaSort />}</th>
                  <th style={{width: '15%'}} onClick={() => handleSort('date')}>Date & Time {sortConfig.key === 'date' && <FaSort />}</th>
                  <th style={{width: '7%'}} onClick={() => handleSort('message')}>Message {sortConfig.key === 'message' && <FaSort />}</th>
                  <th style={{width: '10%'}}>Imported File</th>
                  <th style={{width: '15%'}}>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.map((record, index) => (
                  <tr key={record.id}>
                    <td>{index + 1}</td>
                    <td>{record.name || 'N/A'}</td>
                    <td>{record.email || 'N/A'}</td>
                    <td>{record.age || 'N/A'}</td>
                    <td>{record.appointmentType || 'N/A'}</td>
                    <td>
                      <span className="date-time">
                        <span className="date">{record.date || 'N/A'}</span>
                        {record.date && record.time && <span className="time-separator">|</span>}
                        <span className="time">{record.time || 'N/A'}</span>
                      </span>
                    </td>
                    <td>
                      {record.message ? (
                        <i 
                          className="bi bi-envelope-fill" 
                          style={{ cursor: 'pointer', fontSize: '1.2em', color: 'rgb(197, 87, 219)' }}
                          onClick={() => handleMessageClick(record.message)}
                        ></i>
                      ) : 'N/A'}
                    </td>
                    <td>
                      {record.importedFile ? (
                        <a href={record.importedFile.url} target="_blank" rel="noopener noreferrer" title={record.importedFile.name}>
                          <FaFile style={{ fontSize: '1.2em', color: '#007bff' }} />
                        </a>
                      ) : 'N/A'}
                    </td>
                    <td>
                      <div className="btn-group" role="group">
                        <button 
                          className="btn btn-outline-primary btn-sm me-1" 
                          onClick={() => handleDownload(record)} 
                          title="Download Patient Info"
                        >
                          <FaDownload />
                        </button>
                        <button 
                          className="btn btn-outline-danger btn-sm" 
                          onClick={() => handleDeleteRecord(record.id)} 
                          title="Delete Record"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination
            recordsPerPage={recordsPerPage}
            totalRecords={filteredRecords.length}
            paginate={paginate}
            currentPage={currentPage}
          />
        </div>
      </main>

      {selectedMessage && (
        <div className="message-popup" style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '5px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <h5>Message</h5>
          <p>{selectedMessage}</p>
          <button className="btn btn-primary" onClick={closeMessagePopup}>Close</button>
        </div>
      )}
    </div>
  );
}

const Pagination = ({ recordsPerPage, totalRecords, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalRecords / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
            <a onClick={() => paginate(number)} href='#!' className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PatientsRecord;