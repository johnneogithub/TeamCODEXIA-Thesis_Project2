import '../../Pages/HomeStyle.css';
import { Link, useHistory } from 'react-router-dom';
import humber from '../Assets/hamburger.png';
import iconyou from '../Assets/icon_you.png'; // Import the default icon
import React, { useState, useEffect } from 'react';
import { auth, crud } from '../../Config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaUser, FaSignOutAlt } from 'react-icons/fa'; // Import icons
import { useAuth } from '../../AuthContext';

function Nav() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const { logout } = useAuth();
  const history = useHistory(); // Get history object for redirection

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      localStorage.removeItem('authToken'); // Clear any auth tokens
      logout(); // Call the logout function from context (to update state)
      history.push('/Login'); // Redirect to the login page
    } catch (error) {
      console.error('Logout error:', error);
    }
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
        setUserProfilePic(''); // Reset profile picture if user is not logged in
      }
    });

    return () => unsubscribe(); // Cleanup on component unmount
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
          <Link to="/StMargaretLyingInClinic" className="st-mar-style-font">
            <a>St. Margaret Lying In Clinic</a>
          </Link>
        </li>
        <li>
          <Link to="/Aboutus" className="aboutus-style-font">
            <a>About Us</a>
          </Link>
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
