
import ".././Admin/Dashboard.css"
import 'bootstrap/dist/js/bootstrap.js';
import 'bootstrap/dist/css/bootstrap.css';
import logomini from '../Assets/logo-mini.svg'


import { Link } from 'react-router-dom';
import Clinic from '../Assets/stmargaretlogo.png'

const Sidebar = () => {
  return (
  <>  
<nav className="navbar default-layout-navbar col-lg-12 col-12 p-0 fixed-top d-flex flex-row">
    <div className="text-center navbar-brand-wrapper d-flex align-items-center justify-content-start">
      <a className="navbar-brand brand-logo" href="index.html">
        <img src={Clinic} alt="logo" />
      </a>
      <a className="navbar-brand brand-logo-mini" href="index.html">
        <img src={logomini} alt="logo" />
      </a>
    </div>
    <div className="navbar-menu-wrapper d-flex align-items-stretch">
      <button
        className="navbar-toggler navbar-toggler align-self-center"
        type="button"
        data-toggle="minimize"
      >
        {/* <img className="mdi mdi-menu" src={humber} alt="" /> */}
        <span className="mdi mdi-menu" />
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
        className="navbar-toggler navbar-toggler-right d-lg-none align-self-center"
        type="button"
        data-toggle="offcanvas"
      >
        <span className="mdi mdi-menu" />
      </button>
    </div>
  </nav>
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
          <a className="nav-link" href="index.html">
            <span className="menu-title">Dashboard</span>
            <i className="mdi mdi-home menu-icon" />
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#icons"
            aria-expanded="false"
            aria-controls="icons"
          >
            <span className="menu-title">Patients Record</span>
            <i className="mdi mdi-contacts menu-icon" />
          </a>
        </li>
        <li className="nav-item">
          <a
            className="nav-link"
            data-bs-toggle="collapse"
            href="#forms"
            aria-expanded="false"
            aria-controls="forms"
          >
            <span className="menu-title">PregnancyWheel</span>
            <i className="mdi mdi-format-list-bulleted menu-icon" />
          </a>
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
            <i className="menu-arrow" />
            <i className="mdi mdi-lock menu-icon" />
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

  </>
  );
}

export default Sidebar;
