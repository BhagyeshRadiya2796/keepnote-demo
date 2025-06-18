import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import SignupForm from '../features/auth/components/SignupForm';
import { useCurrentUser } from '../features/auth/api/useAuth';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { data: user, isSuccess } = useCurrentUser();
  
  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (isSuccess && user) {
      navigate('/');
    }
  }, [isSuccess, user, navigate]);

  return (
    <Box className="min-h-screen bg-gray-50 flex flex-col justify-center py-12">
      <Container maxWidth="sm">
        <Box className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            KeepNotes
          </h1>
        </Box>
        <SignupForm />
      </Container>
    </Box>
  );
};

export default SignupPage;
