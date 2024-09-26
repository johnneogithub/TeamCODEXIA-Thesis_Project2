import '../../pages/HomeStyle.css';
import { Link } from 'react-router-dom';
import humber from '../Assets/hamburger.png';
import iconyou from '../Assets/icon_you.png'; // Import the default icon
import React, { useState, useEffect } from 'react';
import { auth, crud } from '../../Config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons

function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = () => {
    auth.signOut().then(() => {
      localStorage.removeItem('authToken');
      window.location.href = '/Login';
    }).catch((error) => {
      console.error('Logout error:', error);
    });
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        const userRef = doc(crud, `users/${user.uid}`);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserProfilePic(data.profilePicture || ''); // Set profile picture URL or empty if not set
        }
      } else {
        setUserProfilePic('');
      }
    });
  
    return () => unsubscribe();
  }, []);

  return (
    <div className='navbar_master'>
      <input type="checkbox" id="check" checked={menuOpen} onChange={toggleMenu} />
      <label htmlFor="check" className="checkbtn">
        <div className="hamburger-icon">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </label>

      <Link className="page_name" to="/Home">
        <label>PlanIt<span>FamIt</span></label>
      </Link>

      <ul className={menuOpen ? 'open' : ''}>
        <li>
          <Link to="/OvulationTracker" className="OvulationTracker">
            <a className="active">Ovulation Tracker</a>
          </Link>
        </li>
        <li>
          <Link to="/CheckHealth" className="st-mar-style-font">
            <a>St. Margaret Lying In Clinic</a>
          </Link>
        </li>
        <li>
          <a>About Us</a>
        </li>
        <li>
          <a className="dropdown-toggle1" onClick={toggleDropdown}>
            <img src={userProfilePic || iconyou} alt="Profile" className="profile-pic-small" />
            {dropdownOpen && (
              <div className="dropdown1">
                <div className="dropdown-content1">
                  <Link to="/UserProfile"><FaUser /> Profile</Link>
                  <a onClick={handleLogout}><FaSignOutAlt /> Logout</a>
                </div>
              </div>
            )}
          </a>
        </li>
      </ul>
    </div>
  );
}

export default Nav;
