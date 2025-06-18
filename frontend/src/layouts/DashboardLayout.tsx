import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../components/ui/Navbar/Navbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  return (
    <Box className="min-h-screen bg-white dark:bg-gray-900">
      <Navbar />
      <Container maxWidth="lg" className="py-8">
        {children}
      </Container>
    </Box>
  );
};

export default DashboardLayout;
