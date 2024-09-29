// UserProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from './AuthContext';

const UserProtectedRoute = ({ component: Component, ...rest }) => {
  const { currentUser } = useAuth(); // Check if a regular user is logged in

  return (
    <Route
      {...rest}
      render={(props) =>
        currentUser ? <Component {...props} /> : <Redirect to="/Login" />
      }
    />
  );
};

export default UserProtectedRoute;
