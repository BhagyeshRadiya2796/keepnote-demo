import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

interface AuthRedirectProps {
  children: React.ReactNode;
}

/**
 * Component that redirects authenticated users away from login/signup pages
 * If a token exists in cookies, redirect to the dashboard
 */
const AuthRedirect: React.FC<AuthRedirectProps> = ({ children }) => {
  const token = Cookies.get('token');
  
  // If token exists, redirect to dashboard
  if (token) {
    return <Navigate to="/" replace />;
  }
  
  // Otherwise, render the children (login/signup page)
  return <>{children}</>;
};

export default AuthRedirect;
