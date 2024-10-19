import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, deleteDoc, doc, query, orderBy, limit } from 'firebase/firestore';
import Sidebar from '../Global/Sidebar';
import './PatientsRecordStyle.css';
import { useLocation } from 'react-router-dom';
import { FaTrash, FaSearch, FaSort, FaFile, FaDownload, FaEye } from 'react-icons/fa';
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
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
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
                    <th>#</th>
                    <th onClick={() => handleSort('name')}>Name {sortConfig.key === 'name' && <FaSort />}</th>
                    <th onClick={() => handleSort('email')}>Email {sortConfig.key === 'email' && <FaSort />}</th>
                    <th onClick={() => handleSort('age')}>Age {sortConfig.key === 'age' && <FaSort />}</th>
                    <th onClick={() => handleSort('appointmentType')}>Type {sortConfig.key === 'appointmentType' && <FaSort />}</th>
                    <th onClick={() => handleSort('date')}>Date & Time {sortConfig.key === 'date' && <FaSort />}</th>
                    <th>Message</th>
                    <th>File</th>
                    <th>Action</th>
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
                          <button 
                            className="btn btn-link p-0"
                            onClick={() => handleMessageClick(record.message)}
                          >
                            <FaEye />
                          </button>
                        ) : 'N/A'}
                      </td>
                      <td>
                        {record.importedFile ? (
                          <a href={record.importedFile.url} target="_blank" rel="noopener noreferrer" title={record.importedFile.name}>
                            <FaFile />
                          </a>
                        ) : 'N/A'}
                      </td>
                      <td>
                        <div className="btn-group" role="group">
                          {/* <button 
                            className="btn btn-outline-primary btn-sm" 
                            onClick={() => handleDownload(record)} 
                            title="Download Patient Info"
                          >
                            <FaDownload />
                          </button> */}
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
        </div>
      </div>

      {selectedMessage && (
        <div className="message-popup">
          <div className="message-popup-content">
            <h5>Message</h5>
            <p>{selectedMessage}</p>
            <button className="btn btn-primary" onClick={closeMessagePopup}>Close</button>
          </div>
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
