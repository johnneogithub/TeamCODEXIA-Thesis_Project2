import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import logomini from '../Assets/logo-mini.svg';
import Clinic from '../Assets/stmargaretlogo.png';
import { FaHome, FaUserFriends, FaCalendarAlt, FaNewspaper, FaUser, FaChevronRight } from 'react-icons/fa';

const Sidebar = () => {
	const location = useLocation();

	const menuItems = [
		{ path: '/dashboard', name: 'Dashboard', icon: <FaHome /> },
		{ path: '/PatientsRecord', name: 'PatientsRecord', icon: <FaUserFriends /> },
		{ path: '/PregnancyWheel', name: 'PregnancyWheel', icon: <FaNewspaper /> },
		{ path: '/profile', name: 'User Profile', icon: <FaUser /> },
	];

	return (
		<nav className="sidebar sidebar-offcanvas" id="sidebar">
			<ul className="nav">
				<li className="nav-item profile">
					<div className="profile-pic">
						<img src={Clinic} alt="profile" />
						<div className="profile-name">
							<h5>St. Margaret Clinic</h5>
						</div>
					</div>
				</li>
				{menuItems.map((item) => (
					<li className={`nav-item ${location.pathname === item.path ? 'active' : ''}`} key={item.path}>
						<Link className="nav-link" to={item.path}>
							<span className="menu-icon">{item.icon}</span>
							<span className="menu-title">{item.name}</span>
							{location.pathname === item.path && <FaChevronRight className="menu-arrow" />}
						</Link>
					</li>
				))}
			</ul>
		</nav>
	);
};

export default Sidebar;
