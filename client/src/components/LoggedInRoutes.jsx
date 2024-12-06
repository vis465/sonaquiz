import React from 'react';
import { Navigate } from 'react-router-dom';

const LoggedInRoutes = ({ children }) => {
  const isLoggedIn = localStorage.getItem('token');  // You can change this logic based on how you're managing authentication.

  // If the user is not logged in, redirect them to the login page
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return children; // If logged in, render the children components
};

export default LoggedInRoutes;
