import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useCurrentUser } from '../features/auth/api/useAuth';
import Cookies from 'js-cookie';

interface IProtectedRouteProps {
  redirectTo?: string;
}

const ProtectedRoute: React.FC<IProtectedRouteProps> = ({ 
  redirectTo = '/login'
}) => {
  const { data: user, isLoading } = useCurrentUser();

  // Show loading indicator while checking authentication
  if (isLoading) {
    return (
      <Box className="flex items-center justify-center min-h-screen">
        <CircularProgress />
      </Box>
    );
  }

  // Check for token in cookies
  const token = Cookies.get('token');
  
  // If token exists, allow access even if user data is not yet loaded
  // This prevents unnecessary redirects while the user data is being fetched
  if (token) {
    return <Outlet />;
  }
  
  // If no token and no user data, redirect to login
  if (!user && !token) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render child routes if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
