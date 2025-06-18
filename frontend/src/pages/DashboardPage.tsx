import React, { useState, useEffect } from 'react';
import { Box, Typography, Grid, Paper, Button, Card, CardContent, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NoteIcon from '@mui/icons-material/Note';
import { useAppSelector } from '../app/store';
import { selectThemeMode } from '../features/theme/state/themeSlice';
import DashboardLayout from '../layouts/DashboardLayout';
import NoteCard from '../features/notes/components/NoteCard';
import CreateNoteDialog from '../features/notes/components/CreateNoteDialog';
import { useGetNotes } from '../features/notes/api/useNotes';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { useSocket } from '../context/SocketContext';

const DashboardPage: React.FC = () => {
  const themeMode = useAppSelector(selectThemeMode);
  
  // State for create note dialog
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  
  // Socket.IO connection status
  const { isConnected } = useSocket();
  
  // Fetch notes using React Query
  const { data: notes, isLoading, isError, error, refetch } = useGetNotes();
  
  // Effect to handle real-time note updates
  useEffect(() => {
    // Listen for note created events
    const handleNoteCreated = () => {
      refetch();
    };
    
    // Listen for note deleted events
    const handleNoteDeleted = () => {
      refetch();
    };
    
    // Register event listeners
    socket.on('note:created', handleNoteCreated);
    socket.on('note:deleted', handleNoteDeleted);
    
    // Cleanup
    return () => {
      socket.off('note:created', handleNoteCreated);
      socket.off('note:deleted', handleNoteDeleted);
    };
  }, [refetch]);
  
  const handleCreateNote = () => {
    setCreateDialogOpen(true);
  };
  
  const handleCloseCreateDialog = () => {
    setCreateDialogOpen(false);
  };
  
  return (
    <DashboardLayout>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box className="p-6">
            <Box className="flex justify-between items-center mb-4">
              <Typography variant="h6" className="text-gray-800 dark:text-white font-medium">
                All Notes
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={<AddIcon />}
                onClick={handleCreateNote}
                size="small"
              >
                New Note
              </Button>
            </Box>
            
            {isLoading ? (
              <Box className="flex justify-center items-center p-8">
                <CircularProgress />
              </Box>
            ) : isError ? (
              <Box className="flex flex-col justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <Typography variant="body1" className="text-red-600 dark:text-red-400 mb-2">
                  Error loading notes
                </Typography>
                <Typography variant="body2" className="text-gray-600 dark:text-gray-300">
                  {error instanceof Error ? error.message : 'Please try again later'}
                </Typography>
              </Box>
            ) : notes && notes.length > 0 ? (
              <Grid container spacing={2}>
                {notes.map((note) => (
                  <Grid item xs={12} sm={6} key={note._id}>
                    <NoteCard note={note} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box className="flex flex-col justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <NoteIcon sx={{ fontSize: 48 }} className="text-gray-400 dark:text-gray-500 mb-3" />
                <Typography variant="body1" className="text-gray-700 dark:text-gray-200 mb-4">
                  You don't have any notes yet
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={handleCreateNote}
                >
                  Create Your First Note
                </Button>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Create Note Dialog */}
      <CreateNoteDialog 
        open={createDialogOpen} 
        onClose={handleCloseCreateDialog} 
      />
    </DashboardLayout>
  );
};

export default DashboardPage;
