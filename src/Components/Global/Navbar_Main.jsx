import '../../pages/HomeStyle.css';
import { Link } from 'react-router-dom';
import iconyou from '../Assets/icon_you.png';
import humber from '../Assets/hamburger.png';
import React, { useState } from 'react';
import { auth } from '../../Config/firebase'; // Import auth from firebase

function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    auth.signOut().then(() => { // Use auth.signOut() instead of firebase.auth().signOut()
      // Sign-out successful.
      localStorage.removeItem('authToken');
      // Redirect or perform any other necessary actions after logout
      // For example, redirect to the login page
      window.location.href = '/Login';
    }).catch((error) => {
      // An error happened.
      console.error('Logout error:', error);
    });
  };

  return (
    <nav className='navbar_master'>
      <input type="checkbox" id="check" />
      <label htmlFor="check" className="checkbtn"> {/* Use htmlFor instead of for for label */}
        <i><img src={humber} alt="" /></i>
      </label>

      <Link className="page_name" to="/Home">
        <label>PlanIt<span>FamIt</span></label>
      </Link>

      <ul>
        <li>
          <a className="active">
            Plan & Care
          </a>
        </li>
        <Link to="/Type" className="st-mar-style-font">
          <li>
            <a>St. Margaret Lying In Clinic</a>
          </li>
        </Link>
        <li>
          <a>About Us</a>
        </li>
        <li>
          <a className="dropdown-toggle" onClick={toggleDropdown}>
            <img src={iconyou} alt="" />
            {/* Conditionally render the dropdown content based on dropdownOpen state */}
            {dropdownOpen && (
              <div className="dropdown">
                <div className="dropdown-content">
                  {/* Dropdown content goes here */}
                  <Link to="/UserProfile">Profile</Link>
                  <a onClick={handleLogout}>Logout</a>
                </div>
              </div>
            )}
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav;
