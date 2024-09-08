import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { getFirestore, collection, getDocs, updateDoc, doc, deleteDoc, setDoc, getDoc  } from 'firebase/firestore';
import Nav from '../Global/NavbarAdmin';
import Sidebar from '../Global/Sidebar';
import { Link } from 'react-router-dom';

import Clinic from '../Assets/stmargaretlogo.png'
import logomini from '../Assets/logo-mini.svg'
import Circle from '../Assets/circle.png'

import '../Admin/Dashboard.css';
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import "bootstrap-icons/font/bootstrap-icons.css";
// import "@icon/themify-icons/themify-icons.css"
// import "unpkg.com/@icon/themify-icons/themify-icons.css"


function DashboardAdmin() {
  const location = useLocation();
  const history = useHistory();

  const [pendingAppointments, setPendingAppointments] = useState([]);
  const [approvedAppointments, setApprovedAppointments] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      const firestore = getFirestore();
      try {
        const querySnapshot = await getDocs(collection(firestore, 'pendingAppointments'));
        const fetchedAppointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPendingAppointments(fetchedAppointments);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    fetchAppointments();
  }, []);

  useEffect(() => {
    const approvedAppointmentsFromStorage = JSON.parse(localStorage.getItem('approvedAppointments') || '[]');
    setApprovedAppointments(approvedAppointmentsFromStorage);
  }, []);

  const fetchDocument = async (firestore, collectionName, id) => {
    const docRef = doc(firestore, collectionName, id);
    const docSnap = await getDoc(docRef);
    return docSnap;
  };
  
  const handleApprove = async (id) => {
    try {
      console.log(`Approving appointment with ID: ${id}`);
      const firestore = getFirestore();
      const pendingDocRef = doc(firestore, 'pendingAppointments', id);
      const pendingDocSnap = await getDoc(pendingDocRef);
      
      if (!pendingDocSnap.exists()) {
        console.error(`Document with ID ${id} does not exist in 'pendingAppointments' collection`);
        return;
      }
  
      const appointmentToApprove = pendingDocSnap.data();
      
      // Fetch the user's document in Firestore
      const userDocRef = doc(firestore, 'users', appointmentToApprove.userId);
      const userDocSnap = await getDoc(userDocRef);
  
      if (!userDocSnap.exists()) {
        console.error(`User document with ID ${appointmentToApprove.userId} does not exist`);
        return;
      }
  
      // Update the user's appointmentData to reflect the approved status
      await updateDoc(userDocRef, {
        'appointmentData.status': 'approved'
      });
  
      // Remove from pending appointments
      await deleteDoc(pendingDocRef);
  
      // Update local state
      setPendingAppointments(prev => prev.filter(appointment => appointment.id !== id));
      const updatedApprovedAppointments = [...approvedAppointments, { id, ...appointmentToApprove }];
      setApprovedAppointments(updatedApprovedAppointments);
      localStorage.setItem('approvedAppointments', JSON.stringify(updatedApprovedAppointments));
    } catch (error) {
      console.error("Error approving appointment: ", error);
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
    const firestore = getFirestore();

    // Update approved appointments locally
    const updatedApprovedAppointments = approvedAppointments.filter(app => app.id !== appointment.id);
    setApprovedAppointments(updatedApprovedAppointments);
    localStorage.setItem('approvedAppointments', JSON.stringify(updatedApprovedAppointments));

    // Store the appointment data in localStorage under 'patientsRecords'
    const patientsRecords = JSON.parse(localStorage.getItem('patientsRecords') || '[]');
    localStorage.setItem('patientsRecords', JSON.stringify([...patientsRecords, appointment]));

    // Optionally, you can also add the appointment data to the Firestore collection for patientsRecords
    const patientsRecordsCollectionRef = collection(firestore, 'patientsRecords');
    await setDoc(doc(patientsRecordsCollectionRef, appointment.id), appointment);

    // Navigate to Patients Record with the updated data
    // history.push('/PatientsRecord');
  } catch (error) {
    console.error("Error handling done action: ", error);
  }
};

  

  return (
    <>
   <div className="container-scroller">

  <nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
      <a className="navbar-brand brand-logo" href="index.html">
        <img src={Clinic} alt="logo" />
      </a>
      <a className="navbar-brand brand-logo-mini" href="index.html">
        <img src={logomini} alt="logo" />
      </a>
    </div>
    <div className="navbar-menu-wrapper  d-flex align-items-stretch">
    <button className="navbar-toggler navbar-toggler align-self-center" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar">
              <i className="bi bi-list mdi-menu"></i>
            </button>
      <div className="search-field d-none d-md-block">
        <form className="d-flex align-items-center h-100" action="#">
          <div className="input-group">
            <div className="input-group-prepend bg-transparent">
              <i className="input-group-text border-0 mdi mdi-magnify" />
            </div>
            <input
              type="text"
              className="form-control bg-transparent border-0"
              placeholder="Search projects"
            />
          </div>
        </form>
      </div>
    
      <button
        className="navbar-toggler navbar-toggler-right d-lg-none align-self-center" type="button" data-bs-toggle="collapse" data-bs-target="#sidebar"
        data-toggle="offcanvas"
      >
        <i class="bi bi-list"></i>
        {/* <span className="mdi mdi-menu" /> */}
        {/* <img height="32" width="32" src="@icon/themify-icons/icons/arrow-up.svg" /> */}
      </button>
    </div>
  </nav>
  {/* partial */}
  <div className="container-fluid page-body-wrapper">
    {/* partial:partials/_sidebar.html */}
    <nav className="sidebar sidebar-offcanvas" id="sidebar">
      <ul className="nav">
        <li className="nav-item nav-profile">
          <a href="#" className="nav-link">
            <div className="nav-profile-image">
              <img src={Clinic} alt="profile" />
              <span className="login-status online" />
              {/*change to offline or busy as needed*/}
            </div>
            <div className="nav-profile-text d-flex flex-column">
              <span className="font-weight-bold mb-2">St. Margaret Lying<br/> In Clinic</span>
              <span className="text-secondary text-small">Project Manager</span>
            </div>
            <i className="mdi mdi-bookmark-check text-success nav-profile-badge" />
          </a>
        </li>
        <li className="nav-item">
        <Link to="/Dashboard"> <a className="nav-link" href="index.html">
           <span className="menu-title">Dashboard</span>
            {/* <i className="mdi mdi-home menu-icon" /> */}
            <i class="bi bi-house-fill menu-icon"></i>
          </a>
          </Link>
        </li>

        <li className="nav-item">
      <Link to="/PatientsRecord"><a className="nav-link" href="PatientsRecord">
       <span className="menu-title">Patients Record</span>
          <i class="bi bi-folder menu-icon"></i>
        </a>
        </Link>
      </li>
        <li className="nav-item">
        <Link to="/PregnancyWheel">  <a className="nav-link" href="PregnancyWheel">
            <span className="menu-title">PregnancyWheel</span>
            {/* <i className="mdi mdi-format-list-bulleted menu-icon" /> */}
            {/* <i class="bi bi-arrow-down-circle-fill menu-icon"></i> */}
            <i class="bi bi-calendar-heart  menu-icon"></i>
          </a>
          </Link>
        </li>
   
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#auth"
            aria-expanded="false"
            aria-controls="auth"
          >
            <span className="menu-title">User Pages</span>
            {/* <i className="menu-arrow" /> */}
            <i class="bi bi-arrow-down-circle-fill menu-icon"></i>
            {/* <i className="mdi mdi-lock menu-icon" /> */}
          </a>
          <div className="collapse" id="auth">
            <ul className="nav flex-column sub-menu">
              <li className="nav-item">
                <a className="nav-link" >
                  {" "}
                  Blank Page{" "}
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="pages/samples/login.html">
                  {" "}
                  Login{" "}
                </a>
              </li>
            </ul>
          </div>
        </li>
      </ul>
    </nav>
    {/* partial */}

    <div className="main-panel">
      <div className="content-wrapper">
        <div className="page-header">
          <h3 className="page-title-nav">
            <span className="page-title-icon bg-gradient-primary text-white me-2">
            <i class="bi bi-house-fill menu-icon"></i>
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
              <img src={Circle} class="card-img-absolute" alt="circle-image" />
                <h4 className="font-weight-normal mb-3">
                  Patients{" "}
                  {/* <i className="mdi mdi-bookmark-outline mdi-24px float-end" /> */}
                  <i class="bi bi-postcard-heart-fill mdi-24px float-end"></i>
                </h4>
                <h2 className="mb-5">50</h2>
              </div>
            </div>
          </div>

          <div className="col-md-4 stretch-card grid-margin">
            <div className="card bg-gradient-success card-img-holder text-white">
              <div className="card-body">
              <img src={Circle} class="card-img-absolute" alt="circle-image" />
                <h4 className="font-weight-normal mb-3">
                  Appointment{" "}
                  {/* <i className="mdi mdi-diamond mdi-24px float-end" /> */}
                  <i class="bi bi-clipboard2-check mdi-24px float-end"></i>
                </h4>
                <h2 className="mb-5">5</h2>
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
                {approvedAppointments.map((appointment, index) => (
                  <tr key={appointment.id}>
                    <td>{index + 1}</td>
                    <td>{appointment.name || 'N/A'}</td>
                    <td>{appointment.email || 'N/A'}</td>
                    <td>{appointment.age || 'N/A'}</td>
                    <td>{appointment.appointmentType || 'N/A'}</td>
                    <td>{appointment.date || 'N/A'}</td>
                    <td>{appointment.time || 'N/A'}</td>
                    <td>
                      <button className='badge badge-gradient-success' onClick={() => handleDone(appointment)}>Done</button>
                    </td>
                  </tr>
                ))}
              </tbody>
                  </table>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 grid-margin">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">For Approved of Appointment</h4>
                <div className="table-responsive">
                  <table className="table">
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
                {pendingAppointments.map((appointment, index) => (
                  <tr key={appointment.id}>
                    <td>{index + 1}</td>
                    <td>{appointment.name || 'N/A'}</td>
                    <td>{appointment.email || 'N/A'}</td>
                    <td>{appointment.age || 'N/A'}</td>
                    <td>{appointment.appointmentType || 'N/A'}</td>
                    <td>{appointment.date || 'N/A'}</td>
                    <td>{appointment.time || 'N/A'}</td>
                    <td>
                    <button className='badge badge-gradient-warning' onClick={() => handleApprove(appointment.id)}>Approve</button>
                      <button className='badge badge-gradient-danger' onClick={() => handleReject(appointment.id)}>Reject</button>
                    </td>
                  </tr>
                ))}
              </tbody>
                  </table>
                  
                </div>
              </div>
            </div>
          </div>
        </div>

</div>

    </div>
  </div>
</div>
</>
  );
}

export default DashboardAdmin;
