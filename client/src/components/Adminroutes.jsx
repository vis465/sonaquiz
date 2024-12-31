import React from 'react';
import { Navigate } from 'react-router-dom';

const Adminroutes = ({ children }) => {
  const isLoggedIn = localStorage.getItem('user');  // You can change this logic based on how you're managing authentication.

  // If the user is not logged in, redirect them to the login page
  if (isLoggedIn.role==="admin "|| isLoggedIn.role ==='trainer') {
    return children;
  }

  
};

export default Adminroutes;
