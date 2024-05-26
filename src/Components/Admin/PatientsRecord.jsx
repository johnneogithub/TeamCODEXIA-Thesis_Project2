import React, { useState } from 'react';

import './PatientsRecordStyle.css';
import './Dashboard.css'
import Clinic from"../Assets/stmargaretlogo.png"
import logomini from"../Assets/logo-mini.svg"

import { Link } from 'react-router-dom';
// import NavbarAdmin from '../Global/NavbarAdmin';
// import Sidebar from '../Global/Sidebar';

function PatientsRecord() {
  const [selectedRecord, setSelectedRecord] = useState(null);
  const patientsRecords = JSON.parse(localStorage.getItem('patientsRecords') || '[]');

  // Function to handle click on a patient record
  const handleRecordClick = (record) => {
    setSelectedRecord(record);
  };

  // Function to close the pop-up
  const handleCloseModal = () => {
    setSelectedRecord(null);
  };

  return (
    <>
    {/* <NavbarAdmin/> */}
    {/* <Sidebar/> */}
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
  <button class="navbar-toggler navbar-toggler align-self-center" type="button" data-toggle="minimize" data-bs-toggle="collapse" data-bs-target="#sidebar" >
          {/* <span class="mdi mdi-menu"></span> */}
          <i class="bi bi-list mdi-menu"></i>
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
      <Link to="/Dashboard"> <a className="nav-link" href="Dashboard">
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
              <a className="nav-link" href="pages/samples/blank-page.html">
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
          <i class="bi bi-folder menu-icon"></i>
          </span>{" "}
          Patients Records
        </h3>

      </div>
   
     
      <div className="row">
        <div className="col-12 grid-margin">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Appointment Records</h4>
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
            {patientsRecords.map((record, index) => (
              <tr key={index} onClick={() => handleRecordClick(record)}>
                <td>{index + 1}</td>
                <td>{record.name || 'N/A'}</td>
                <td>{record.email || 'N/A'}</td>
                <td>{record.age || 'N/A'}</td>
                <td>{record.appointmentType || 'N/A'}</td>
                <td>{record.date || 'N/A'}</td>
                <td>{record.time || 'N/A'}</td>
                <td>View Details</td>
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

export default PatientsRecord;
