import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import DashboardLayout from '../layouts/DashboardLayout';

const NotesPage: React.FC = () => {
  return (
    <DashboardLayout>
      <Box className="mb-6">
        <Typography variant="h4" component="h1" fontWeight="bold" className="text-gray-800 dark:text-white">
          My Notes
        </Typography>
        <Typography variant="body1" color="textSecondary" className="mt-2 dark:text-gray-300">
          Your notes will appear here
        </Typography>
      </Box>
      
      {/* Note content will be implemented later */}
      <Paper className="flex justify-center items-center p-12 bg-white dark:bg-gray-800 rounded-lg">
        <Typography variant="body1" className="text-gray-700 dark:text-gray-200">
          Notes feature coming soon
        </Typography>
      </Paper>
    </DashboardLayout>
  );
};

export default NotesPage;
