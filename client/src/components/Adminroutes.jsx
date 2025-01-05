import React from 'react';
import { Navigate } from 'react-router-dom';

const Adminroutes = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(JSON.parse(localStorage.getItem('user')).role);

  // If the user is not logged in or doesn't exist, redirect them to the login page
 
  // Allow access only if the user is an admin or trainer
  if (user.role === 'admin' || user.role === 'trainer') {
    return children;
  }

  // Redirect to unauthorized page if the user role doesn't match
  return <Navigate to="/unauthorized" />;
};

export default Adminroutes;
