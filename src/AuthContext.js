import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Tracks the logged-in user
  const [isAdmin, setIsAdmin] = useState(false); // Tracks if the logged-in user is an admin

  // Simulate user login as a regular user
  const loginAsUser = (user) => {
    setCurrentUser(user);
    setIsAdmin(false); // Ensure admin is set to false for regular users
    console.log("User logged in:", user);  // Log the user object
  };

  // Simulate admin login
  const loginAsAdmin = () => {
    setCurrentUser({ role: 'admin', name: 'Admin User' }); // Example admin user
    setIsAdmin(true); // Set admin flag to true
    console.log("Admin logged in:", true);  // Log admin login
  };

  // Simulate user/admin logout
  const logout = () => {
    setCurrentUser(null); // Clear current user
    setIsAdmin(false); // Reset admin flag
    console.log("User logged out");  // Log logout
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loginAsUser, loginAsAdmin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);
