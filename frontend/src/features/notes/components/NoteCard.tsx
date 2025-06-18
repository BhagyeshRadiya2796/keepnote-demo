import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Box, 
  Menu, 
  MenuItem, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Tooltip
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { INote, IUpdateNoteDto } from '../types';
import { useUpdateNote, useDeleteNote } from '../api/useNotes';
import { useNoteSocket } from '../../../socket/useNoteSocket';
import { Chip, Avatar, Badge } from '@mui/material';

interface NoteCardProps {
  note: INote;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  // State for menu
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  
  // State for edit dialog
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editedNote, setEditedNote] = useState<IUpdateNoteDto>({
    title: note.title,
    content: note.content
  });
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Socket.IO integration
  const { typingUsers, activeUsers, emitTyping, emitTypingStopped, emitContentChange, liveContent, setIsEditing } = useNoteSocket(note._id);
  
  // Local state for typing users - we'll manage this directly for better control
  const [localTypingUsers, setLocalTypingUsers] = useState<{userId: string; email: string; username: string}[]>([]);
  
  // Local state to track if the current user is editing
  const [isLocallyEditing, setIsLocallyEditing] = useState(false);
  
  // Effect to sync typing users from socket to local state
  useEffect(() => {
    // Always update local typing users when typingUsers changes
    // But only show them if the dialog is open
    if (editDialogOpen) {
      console.log('Updating local typing users:', typingUsers);
      setLocalTypingUsers(typingUsers);
    } else {
      // Clear typing users when dialog is closed
      setLocalTypingUsers([]);
    }
    
    // Cleanup function to clear typing users when component unmounts
    return () => {
      if (!editDialogOpen) {
        setLocalTypingUsers([]);
      }
    };
  }, [typingUsers, editDialogOpen]);
  
  // Mutations
  const updateNoteMutation = useUpdateNote();
  const deleteNoteMutation = useDeleteNote();
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  // Handle menu open
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  
  // Handle menu close
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  // Handle edit click
  const handleEditClick = () => {
    handleMenuClose();
    
    // First set editing states to true
    setIsLocallyEditing(true);
    setIsEditing(true);
    
    // Then open the dialog
    setEditDialogOpen(true);
  };
  
  // Handle delete click
  const handleDeleteClick = () => {
    handleMenuClose();
    setDeleteDialogOpen(true);
  };
  
  // Handle edit dialog close
  const handleEditDialogClose = () => {
    // First, immediately clear the typing indicators in the UI
    setLocalTypingUsers([]);
    
    // Clear local editing states
    setIsLocallyEditing(false);
    setIsEditing(false);
    
    // Notify other users that we've stopped typing (without debounce)
    // Do this before closing the dialog to ensure the event is sent
    emitTypingStopped();
    
    // Reset form
    setEditedNote({
      title: note.title,
      content: note.content
    });
    
    // Finally close the dialog
    setEditDialogOpen(false);
    
    // Add a safety timeout to ensure typing indicators are cleared
    // This is a backup in case the socket event doesn't work
    setTimeout(() => {
      setLocalTypingUsers([]);
    }, 100);
  };
  
  // Handle delete dialog close
  const handleDeleteDialogClose = () => {
    setDeleteDialogOpen(false);
  };
  
  // Handle form change
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Set local editing state to true when user starts typing
    setIsLocallyEditing(true);
    
    // Update the edited note state
    setEditedNote(prev => {
      const updated = {
        ...prev,
        [name]: value
      };
      
      // Emit content change to other users in real-time
      // This ensures other users see the changes as they happen
      emitContentChange(updated.title || '', updated.content || '');
      
      return updated;
    });
    
    // Emit typing event to notify other users
    // This will show the typing indicator for other users
    emitTyping(true);
    
    // Log for debugging
    console.log(`Emitting typing event for ${name} change: ${value.substring(0, 10)}...`);
    
    // Set a timeout to reset the isLocallyEditing state after a short delay
    // This allows other users' changes to be applied after the current user stops typing
    const resetEditingTimeout = setTimeout(() => {
      setIsLocallyEditing(false);
    }, 1000); // 1 second delay
    
    // Clear the timeout if the user types again
    return () => clearTimeout(resetEditingTimeout);
  };
  
  // Handle save
  const handleSave = async () => {
    try {
      await updateNoteMutation.mutateAsync({
        id: note._id,
        data: editedNote
      });
      setEditDialogOpen(false);
      // Notify that typing has stopped
      emitTyping(false);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };
  
  // Handle delete
  const handleDelete = async () => {
    try {
      await deleteNoteMutation.mutateAsync(note._id);
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };
  
  // Effect to stop typing notification when dialog closes
  useEffect(() => {
    if (!editDialogOpen) {
      // Immediately notify other users that we've stopped typing (without debounce)
      emitTypingStopped();
      // Directly clear typing users to ensure the UI is updated immediately
      setLocalTypingUsers([]);
    }
  }, [editDialogOpen, emitTypingStopped]);
  
  // Effect to apply live content changes from other users
  useEffect(() => {
    if (liveContent && editDialogOpen) {
      console.log('Received live content changes:', liveContent);
      
      // Only apply changes if we're not currently typing
      // This prevents overwriting the user's current edits
      if (!isLocallyEditing) {
        console.log('Applying live content changes to editor');
        
        // Update the edited note with the live content
        setEditedNote(prev => ({
          ...prev,
          title: liveContent.title,
          content: liveContent.content
        }));
      } else {
        console.log('Not applying live content changes because user is currently typing');
        
        // Store the latest content to apply when the user stops typing
        const latestContent = { ...liveContent };
        
        // Set a timeout to apply the changes after a short delay if the user hasn't typed again
        const applyChangesTimeout = setTimeout(() => {
          console.log('Applying delayed live content changes after user stopped typing');
          setEditedNote(prev => ({
            ...prev,
            title: latestContent.title,
            content: latestContent.content
          }));
        }, 2000); // 2 second delay
        
        // Clean up the timeout if the effect runs again
        return () => clearTimeout(applyChangesTimeout);
      }
    }
  }, [liveContent, editDialogOpen, isLocallyEditing]);
  
  // Check if anyone is currently typing
  const isAnyoneTyping = localTypingUsers.length > 0;
  
  return (
    <>
      <Card className={`h-full bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all duration-200 border ${isAnyoneTyping ? 'border-yellow-400 dark:border-yellow-600' : 'border-gray-200 dark:border-gray-700'} rounded-lg overflow-hidden hover:border-blue-300 dark:hover:border-blue-500`}>
        <CardContent className="h-full flex flex-col p-4">
          <Box className="flex justify-between items-start mb-2">
            <Typography variant="h6" className="font-medium text-gray-800 dark:text-white">
              {note.title}
            </Typography>
            <IconButton 
              size="small" 
              onClick={handleMenuClick}
              className="text-gray-500 dark:text-gray-400"
            >
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>
          
          {localTypingUsers.map((user: {userId: string; email: string; username: string}) => (
            <Chip
              key={user.userId}
              size="small"
              color="warning"
              label={`${user.username} is editing...`}
              className="mb-1"
            />
          ))}
          
          {activeUsers.length > 0 && (
            <Box className="flex gap-1 mb-2">
              {activeUsers.map((user) => (
                <Tooltip key={user.id} title={user.email} arrow>
                  <Avatar
                    sx={{ width: 24, height: 24 }}
                    className="border-2 border-blue-300"
                  >
                    {user.email.charAt(0).toUpperCase()}
                  </Avatar>
                </Tooltip>
              ))}
            </Box>
          )}
          
          <Typography 
            variant="body2" 
            className="text-gray-600 dark:text-gray-300 mb-3 flex-grow line-clamp-3"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {note.content}
          </Typography>
          
          <Typography variant="caption" className="text-gray-500 dark:text-gray-400 mt-auto">
            Updated {formatDate(note.updatedAt)}
          </Typography>
        </CardContent>
      </Card>
      
      {/* Card Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEditClick}>
          <EditIcon fontSize="small" className="mr-2" />
          Edit
        </MenuItem>
        <MenuItem onClick={handleDeleteClick} className="text-red-600">
          <DeleteIcon fontSize="small" className="mr-2" />
          Delete
        </MenuItem>
      </Menu>
      
      {/* Edit Dialog */}
      <Dialog 
        open={editDialogOpen} 
        onClose={handleEditDialogClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
          Edit Note
        </DialogTitle>
        <DialogContent className="pt-4 mt-2 dark:bg-gray-800">
          <TextField
            autoFocus
            margin="dense"
            id="title"
            name="title"
            label="Title"
            type="text"
            fullWidth
            variant="outlined"
            value={editedNote.title}
            onChange={handleFormChange}
            className="mb-4"
          />
          <TextField
            margin="dense"
            id="content"
            name="content"
            label="Content"
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={editedNote.content}
            onChange={handleFormChange}
          />
        </DialogContent>
        <DialogActions className="bg-gray-50 dark:bg-gray-800 p-3">
          <Button onClick={handleEditDialogClose} className="text-gray-600 dark:text-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            variant="contained" 
            color="primary"
            disabled={updateNoteMutation.isPending}
          >
            {updateNoteMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteDialogClose}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
          Delete Note
        </DialogTitle>
        <DialogContent className="pt-4 mt-2 dark:bg-gray-800">
          <Typography className="dark:text-white">
            Are you sure you want to delete "{note.title}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions className="bg-gray-50 dark:bg-gray-800 p-3">
          <Button onClick={handleDeleteDialogClose} className="text-gray-600 dark:text-gray-300">
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            variant="contained" 
            color="error"
            disabled={deleteNoteMutation.isPending}
          >
            {deleteNoteMutation.isPending ? 'Deleting...' : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default NoteCard;
