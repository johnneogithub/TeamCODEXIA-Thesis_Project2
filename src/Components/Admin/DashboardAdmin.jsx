import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc, setDoc, getDoc, onSnapshot, getDoc as fetchDoc  } from 'firebase/firestore';
import Sidebar from '../Global/Sidebar';
import { Link } from 'react-router-dom';
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import ReactPaginate from 'react-paginate';
import { getAuth } from 'firebase/auth';

import Clinic from '../Assets/stmargaretlogo.png'
import logomini from '../Assets/logo-mini.svg'
import Circle from '../Assets/circle.png'

import './DashboardAdmin.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
// import "@icon/themify-icons/themify-icons.css"
// import "unpkg.com/@icon/themify-icons/themify-icons.css"

// Update the import statement for UserProfilePopup
import UserProfilePopup from './AdminLogin/UserProfilePopup';

// Add this import at the top of the file
import RemarkPopup from './AdminLogin/RemarkPopup';




function DashboardAdmin() {
  const location = useLocation();
  const history = useHistory();

  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [remarkText, setRemarkText] = useState('');
  const [openRemarkId, setOpenRemarkId] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [currentApprovedPage, setCurrentApprovedPage] = useState(0);
  const [currentPendingPage, setCurrentPendingPage] = useState(0);
  const [registeredUsersCount, setRegisteredUsersCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingAppointmentsCount, setPendingAppointmentsCount] = useState(0);
  const [approvedAppointmentsCount, setApprovedAppointmentsCount] = useState(0);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState(0);
  const itemsPerPage = 5; // You can adjust this number

  // Add a new state to track the selected user
  const [selectedUser, setSelectedUser] = useState(null);

  // Replace openRemarkId with selectedAppointment
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const firestore = getFirestore();
      
      // Fetch existing appointments
      try {
        const pendingSnapshot = await getDocs(collection(firestore, 'pendingAppointments'));
        const pendingData = pendingSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingAppointments(pendingData);
        setPendingAppointmentsCount(pendingSnapshot.size);

        const approvedSnapshot = await getDocs(collection(firestore, 'approvedAppointments'));
        const approvedData = approvedSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApprovedAppointments(approvedData);
        setApprovedAppointmentsCount(approvedSnapshot.size);

        // Calculate total appointments
        const totalCount = pendingSnapshot.size + approvedSnapshot.size;
        setTotalAppointmentsCount(totalCount);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
        setError("Failed to load appointments");
      } finally {
        setLoading(false);
      }

      // Fetch and count existing users
      try {
        const usersSnapshot = await getDocs(collection(firestore, 'users'));
        const existingUsersCount = usersSnapshot.size;
        
        // Get the current count from statistics
        const userCountRef = doc(firestore, 'statistics', 'userCount');
        const unsubscribe = onSnapshot(userCountRef, (doc) => {
          if (doc.exists()) {
            const totalCount = (doc.data().count || 0) + existingUsersCount;
            setRegisteredUsersCount(totalCount);
          } else {
            // If the document doesn't exist, just use the count of existing users
            setRegisteredUsersCount(existingUsersCount);
          }
        });

        // Cleanup function
        return () => unsubscribe();
      } catch (error) {
        console.error("Error fetching user count:", error);
      }

      // Fetch appointments for count
      const appointmentsRef = collection(firestore, 'pendingAppointments');
      const snapshot = await getDocs(appointmentsRef);
      setAppointmentCount(snapshot.size);
    };

    fetchData();
  }, []);

  const fetchDocument = async (firestore, collectionName, id) => {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap;
  };
  
  const handleApprove = async (id) => {
    try {
      const firestore = getFirestore();
      const pendingDocRef = doc(firestore, 'pendingAppointments', id);
      const pendingDocSnap = await getDoc(pendingDocRef);
      
      if (pendingDocSnap.exists()) {
        const appointmentData = pendingDocSnap.data();
        
        // Update the status to 'approved'
        const updatedAppointmentData = {
          ...appointmentData,
          status: 'approved',
          isApproved: true
        };
        
        // Move to approved appointments
        await setDoc(doc(firestore, 'approvedAppointments', id), updatedAppointmentData);
        
        // Remove from pending appointments
        await deleteDoc(pendingDocRef);
        
        // Update the user's document with the approved status
        if (appointmentData.userId) {
          const userRef = doc(firestore, 'users', appointmentData.userId);
          await updateDoc(userRef, {
            'appointmentData': updatedAppointmentData
          });
        }
        
        // Update local state
        setPendingAppointments(prev => prev.filter(app => app.id !== id));
        setApprovedAppointments(prev => [...prev, { id, ...updatedAppointmentData }]);

        // Update counts
        setPendingAppointmentsCount(prev => prev - 1);
        setApprovedAppointmentsCount(prev => prev + 1);
        // Total count remains the same

        // Optionally, you can show a success message
        alert("Appointment approved successfully!");
      }
    } catch (error) {
      console.error("Error approving appointment: ", error);
      alert("An error occurred while approving the appointment. Please try again.");
    }
  };
  

  const handleReject = async (id) => {
    try {
      const firestore = getFirestore();
      
      // Fetch the appointment details
      const pendingDocRef = doc(firestore, 'pendingAppointments', id);
      const pendingDocSnap = await getDoc(pendingDocRef);
  
      if (!pendingDocSnap.exists()) {
        console.error(`Document with ID ${id} does not exist in 'pendingAppointments' collection`);
        return;
      }
  
      const appointmentToReject = pendingDocSnap.data();
      
      // Add the rejection to the user's document (or wherever you're storing the user's data)
      const userDocRef = doc(firestore, 'users', appointmentToReject.userId); // Assuming the user ID is part of the appointment data
      await updateDoc(userDocRef, {
        appointmentData: { ...appointmentToReject, status: 'rejected' },
      });
  
      // Remove the appointment from pending appointments
      await deleteDoc(pendingDocRef);
  
      // Update local state and localStorage
      const updatedPendingAppointments = pendingAppointments.filter(appointment => appointment.id !== id);
      setPendingAppointments(updatedPendingAppointments);
      localStorage.setItem('pendingAppointments', JSON.stringify(updatedPendingAppointments));
  
      // Update counts
      setPendingAppointmentsCount(prev => prev - 1);
      setTotalAppointmentsCount(prev => prev - 1);
  
      // Optionally pass the rejected data to the UserProfile page
      history.push({
        // pathname: '/UserProfile',
        state: { appointmentData: appointmentToReject, action: 'reject' }
      });
    } catch (error) {
      console.error("Error rejecting appointment: ", error);
    }
  };
  


const handleDone = async (appointment) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      console.error("User is not authenticated");
      alert("You must be logged in to perform this action.");
      return;
    }

    const firestore = getFirestore();

    // Check if the document exists before trying to delete it
    const appointmentRef = doc(firestore, 'approvedAppointments', appointment.id);
    const appointmentDoc = await getDoc(appointmentRef);

    if (!appointmentDoc.exists()) {
      console.error(`Appointment with ID ${appointment.id} does not exist`);
      alert("This appointment no longer exists in the database.");
      return;
    }

    // Attempt to delete the document
    await deleteDoc(appointmentRef);

    const appointmentWithFile = {
      ...appointment,
      importedFile: appointment.importedFile ? {
        name: appointment.importedFile.name,
        url: appointment.importedFile.url,
        type: appointment.importedFile.type
      } : null,
      completedAt: new Date().toISOString() 
    };

    // Remove any undefined fields
    Object.keys(appointmentWithFile).forEach(key => 
      appointmentWithFile[key] === undefined && delete appointmentWithFile[key]
    );

    // Attempt to add the document to patientsRecords
    await setDoc(doc(firestore, 'patientsRecords', appointment.id), appointmentWithFile);

    // Update local state
    setApprovedAppointments(prevAppointments => 
      prevAppointments.filter(app => app.id !== appointment.id)
    );

    console.log('Appointment moved to Patient Records successfully');

    // Update counts
    setApprovedAppointmentsCount(prev => prev - 1);
    setTotalAppointmentsCount(prev => prev - 1);

    // Navigate to PatientsRecord page with the new record data
    history.push({
      state: { newRecord: appointmentWithFile }
    });
  } catch (error) {
    console.error("Error handling done action: ", error);
    if (error.code === 'permission-denied') {
      alert("You don't have permission to perform this action. Please contact your administrator.");
    } else {
      alert(`An error occurred: ${error.message}`);
    }
  }
};

const handleImport = (appointment) => {
  const input = document.createElement('input');
  input.type = 'file';
  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const auth = getAuth();
        const user = auth.currentUser;
        
        if (!user) {
          throw new Error('User not authenticated');
        }

        console.log('Current user:', user.uid); // Log the user ID

        const storage = getStorage();
        const storageRef = ref(storage, `appointments/${user.uid}/${appointment.id}/${file.name}`);
        
        console.log('Attempting to upload file:', file.name); // Log the file name
        console.log('Upload path:', `appointments/${user.uid}/${appointment.id}/${file.name}`); // Log the full path

        // Upload file to Firebase Storage
        const snapshot = await uploadBytes(storageRef, file);
        console.log('File uploaded successfully:', snapshot);

        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log('Download URL obtained:', downloadURL);
        
        // Update appointment with file metadata and download URL
        await updateAppointment(appointment, file.name, downloadURL, file.type);
        
        alert('File uploaded successfully!');
      } catch (error) {
        console.error('Error uploading file:', error);
        let errorMessage = 'An error occurred while uploading the file.';
        if (error.code === 'storage/unauthorized') {
          errorMessage = 'You do not have permission to upload files. Please contact the administrator.';
        }
        alert(`Error: ${errorMessage}`);
      }
    }
  };
  input.click();
};

const updateAppointment = async (appointment, fileName, fileURL, fileType) => {
  try {
    // Update the appointment in your state
    setApprovedAppointments(prevAppointments => 
      prevAppointments.map(app => 
        app.id === appointment.id 
          ? { ...app, importedFile: { name: fileName, url: fileURL, type: fileType } }
          : app
      )
    );
    
    // Update or create the appointment document in Firestore
    const firestore = getFirestore();
    const appointmentRef = doc(firestore, 'approvedAppointments', appointment.id);
    await setDoc(appointmentRef, {
      ...appointment,
      importedFile: { name: fileName, url: fileURL, type: fileType }
    }, { merge: true });

    console.log('Appointment updated successfully in database');
  } catch (error) {
    console.error('Error updating appointment:', error);
    alert(`Error updating appointment: ${error.message}`);
  }
};

const handleRemark = (appointment) => {
  setSelectedAppointment(appointment);
};

const handleRemarkSubmit = async (remarkText) => {
  if (remarkText.trim() && selectedAppointment) {
    try {
      const firestore = getFirestore();
      const appointmentRef = doc(firestore, 'pendingAppointments', selectedAppointment.id);
      const remarkTimestamp = new Date().toISOString();
      
      // Get the appointment data before deleting it
      const appointmentSnap = await getDoc(appointmentRef);
      const appointmentData = appointmentSnap.data();
      
      // Delete the appointment from pendingAppointments
      await deleteDoc(appointmentRef);
      
      // Update the user's document with the remark and move the appointment data
      if (appointmentData && appointmentData.userId) {
        const userRef = doc(firestore, 'users', appointmentData.userId);
        await updateDoc(userRef, {
          'appointmentData': {
            ...appointmentData,
            status: 'remarked',
            remark: remarkText,
            remarkTimestamp: remarkTimestamp
          }
        });
      }

      // Update local state to remove the appointment
      setPendingAppointments(prevAppointments =>
        prevAppointments.filter(app => app.id !== selectedAppointment.id)
      );

      // Update counts
      setPendingAppointmentsCount(prev => prev - 1);
      setTotalAppointmentsCount(prev => prev - 1);

      // Close the remark popup
      setSelectedAppointment(null);
      
      // Optionally, show a success message
      alert("Remark added successfully and appointment removed from pending list!");
    } catch (error) {
      console.error("Error adding remark: ", error);
      alert("An error occurred while adding the remark. Please try again.");
    }
  }
};

const handleMessageClick = (message) => {
  setSelectedMessage(message);
};

const closeMessagePopup = () => {
  setSelectedMessage(null);
};

const handleApprovedPageClick = ({ selected }) => {
  setCurrentApprovedPage(selected);
};

const handlePendingPageClick = ({ selected }) => {
  setCurrentPendingPage(selected);
};

const paginatedApprovedAppointments = approvedAppointments.slice(
  currentApprovedPage * itemsPerPage,
  (currentApprovedPage + 1) * itemsPerPage
);

const paginatedPendingAppointments = pendingAppointments.slice(
  currentPendingPage * itemsPerPage,
  (currentPendingPage + 1) * itemsPerPage
);

  // Modify the handleAppointmentClick function
  const handleAppointmentClick = async (event, appointment) => {
    if (event.target.classList.contains('appointment-name')) {
      try {
        const firestore = getFirestore();
        const userRef = doc(firestore, 'users', appointment.userId);
        const userSnap = await fetchDoc(userRef);
        
        if (userSnap.exists()) {
          setSelectedUser({ id: userSnap.id, ...userSnap.data(), appointment });
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }
  };

  // Add a function to close the popup
  const closeUserProfilePopup = () => {
    setSelectedUser(null);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="main-content">
        <div className="content-wrapper">
          <div className="page-header">
            <h3 className="page-title-nav">
              <span className="page-title-icon bg-gradient-primary text-white me-2">
                <i className="bi bi-house-fill menu-icon"></i>
              </span>{" "}
              Dashboard
            </h3>
            <nav aria-label="breadcrumb">
              <ul className="breadcrumb">
                <li className="breadcrumb-item active" aria-current="page">
                  <span />
                  Overview{" "}
                  <i className="mdi mdi-alert-circle-outline icon-sm text-primary align-middle" />
                </li>
              </ul>
            </nav>
          </div>
          <div className="row">
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-danger card-img-holder text-white">
                <div className="card-body">
                <img src={Circle} class="card-img-absolute" alt="circle-image" />
                  <h4 className="font-weight-normal mb-3">
                    Medical Staff{" "}
                    <i class="bi bi-person mdi-24px float-end"></i>
                  </h4>
                  <h2 className="mb-5">10</h2>
                </div>
              </div>
            </div>
            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-info card-img-holder text-white">
                <div className="card-body">
                  <img src={Circle} className="card-img-absolute" alt="circle-image" />
                  <h4 className="font-weight-normal mb-3">
                    Registered Users on the System{" "}
                    <i className="bi bi-postcard-heart-fill mdi-24px float-end"></i>
                  </h4>
                  <h2 className="mb-5">{registeredUsersCount}</h2>
                </div>
              </div>
            </div>

            <div className="col-md-4 stretch-card grid-margin">
              <div className="card bg-gradient-success card-img-holder text-white">
                <div className="card-body">
                <img src={Circle} className="card-img-absolute" alt="circle-image" />
                  <h4 className="font-weight-normal mb-3">
                    Total Appointments{" "}
                    <i className="bi bi-clipboard2-check mdi-24px float-end"></i>
                  </h4>
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <>
                      <h2 className="mb-5">{totalAppointmentsCount}</h2>
                      <h6 className="card-text">Pending: {pendingAppointmentsCount}</h6>
                      <h6 className="card-text">Approved: {approvedAppointmentsCount}</h6>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
         
          <div className="row">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">Approved Appointment</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{width: '5%'}}>#</th>
                          <th style={{width: '15%'}}>Name</th>
                          <th style={{width: '20%'}}>Email</th>
                          <th style={{width: '5%'}}>Age</th>
                          <th style={{width: '15%'}}>Type of Appointment</th>
                          <th style={{width: '10%'}}>Date</th>
                          <th style={{width: '10%'}}>Time</th>
                          <th style={{width: '10%'}}>Message</th>
                          <th style={{width: '25%'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedApprovedAppointments.map((appointment, index) => (
                          <tr key={appointment.id}>
                            <td>{index + 1}</td>
                            <td 
                              className="appointment-name" 
                              onClick={(e) => handleAppointmentClick(e, appointment)}
                              style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
                            >
                              {appointment.name || 'N/A'}
                            </td>
                            <td>{appointment.email || 'N/A'}</td>
                            <td>{appointment.age || 'N/A'}</td>
                            <td>{appointment.appointmentType || 'N/A'}</td>
                            <td>{appointment.date || 'N/A'}</td>
                            <td>{appointment.time || 'N/A'}</td>
                            <td>
                              {appointment.message ? (
                                <button 
                                  className="btn btn-link p-0"
                                  onClick={() => handleMessageClick(appointment.message)}
                                >
                                  <i className="bi bi-eye" style={{ fontSize: '1.2em', color: '#007bff' }}></i>
                                </button>
                              ) : 'N/A'}
                            </td>
                            <td>
                              <div className="d-flex flex-row align-items-center">
                                <button className='btn btn-success btn-sm me-2' onClick={() => handleDone(appointment)}>Done</button>
                                <button className='btn btn-info btn-sm me-2' onClick={() => handleImport(appointment)}>
                                  <i className="bi bi-file-earmark-arrow-up"></i> Import
                                </button>
                                {appointment.importedFile && (
                                  <small className="text-muted">{appointment.importedFile.name}</small>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(approvedAppointments.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handleApprovedPageClick}
                    containerClassName={'pagination justify-content-center'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    activeClassName={'active'}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-12 grid-margin">
              <div className="card">
                <div className="card-body">
                  <h4 className="card-title">For Approval of Appointment</h4>
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th style={{width: '5%'}}>#</th>
                          <th style={{width: '15%'}}>Name</th>
                          <th style={{width: '20%'}}>Email</th>
                          <th style={{width: '5%'}}>Age</th>
                          <th style={{width: '15%'}}>Type of Appointment</th>
                          <th style={{width: '10%'}}>Date</th>
                          <th style={{width: '10%'}}>Time</th>
                          <th style={{width: '10%'}}>Message</th>
                          <th style={{width: '25%'}}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedPendingAppointments.map((appointment, index) => (
                          <tr key={appointment.id}>
                            <td>{index + 1}</td>
                            <td 
                              className="appointment-name" 
                              onClick={(e) => handleAppointmentClick(e, appointment)}
                              style={{cursor: 'pointer', color: 'blue', textDecoration: 'underline'}}
                            >
                              {appointment.name || 'N/A'}
                            </td>
                            <td>{appointment.email || 'N/A'}</td>
                            <td>{appointment.age || 'N/A'}</td>
                            <td>{appointment.appointmentType || 'N/A'}</td>
                            <td>{appointment.date || 'N/A'}</td>
                            <td>{appointment.time || 'N/A'}</td>
                            <td>
                              {appointment.message ? (
                                <button 
                                  className="btn btn-link p-0"
                                  onClick={() => handleMessageClick(appointment.message)}
                                >
                                  <i className="bi bi-eye" style={{ fontSize: '1.2em', color: '#007bff' }}></i>
                                </button>
                              ) : 'N/A'}
                            </td>
                            <td>
                              <div className="d-flex flex-row align-items-center">
                                <button className='btn btn-outline-success btn-sm me-2' onClick={() => handleApprove(appointment.id)}>Approve</button>
                                <button className='btn btn-outline-danger btn-sm me-2' onClick={() => handleReject(appointment.id)}>Reject</button>
                                <button className='btn btn-outline-info btn-sm me-2' onClick={() => handleRemark(appointment)}>Remark</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <ReactPaginate
                    previousLabel={'<'}
                    nextLabel={'>'}
                    breakLabel={'...'}
                    pageCount={Math.ceil(pendingAppointments.length / itemsPerPage)}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePendingPageClick}
                    containerClassName={'pagination justify-content-center'}
                    pageClassName={'page-item'}
                    pageLinkClassName={'page-link'}
                    previousClassName={'page-item'}
                    previousLinkClassName={'page-link'}
                    nextClassName={'page-item'}
                    nextLinkClassName={'page-link'}
                    breakClassName={'page-item'}
                    breakLinkClassName={'page-link'}
                    activeClassName={'active'}
                  />
                </div>
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

          {/* Add the UserProfilePopup component */}
          {selectedUser && (
            <UserProfilePopup
              user={selectedUser}
              onClose={closeUserProfilePopup}
            />
          )}

          {selectedAppointment && (
            <RemarkPopup
              onClose={() => setSelectedAppointment(null)}
              onSubmit={handleRemarkSubmit}
            />
          )}

        </div>
      </div>
    </div>
  );
}

export default DashboardAdmin;