// AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    // Check local storage for current user
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    // Check local storage for admin status
    return localStorage.getItem('isAdmin') === 'true';
  });

  // Simulate user login as a regular user
  const loginAsUser = (user) => {
    setCurrentUser(user);
    setIsAdmin(false);
    localStorage.setItem('currentUser', JSON.stringify(user)); // Save to local storage
    localStorage.setItem('isAdmin', 'false'); // Save admin status
    console.log("User logged in:", user);
  };

  // Simulate admin login
  const loginAsAdmin = () => {
    const adminUser = { role: 'admin', name: 'Admin User' }; // Example admin user
    setCurrentUser(adminUser);
    setIsAdmin(true);
    localStorage.setItem('currentUser', JSON.stringify(adminUser)); // Save to local storage
    localStorage.setItem('isAdmin', 'true'); // Save admin status
    console.log("Admin logged in:", true);
  };

  // Simulate user/admin logout
  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('currentUser'); // Remove from local storage
    localStorage.removeItem('isAdmin'); // Remove admin status
    console.log("User logged out");
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loginAsUser, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
