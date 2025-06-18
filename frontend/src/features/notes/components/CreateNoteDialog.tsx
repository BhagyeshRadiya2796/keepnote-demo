import React, { useState, useEffect } from 'react';
import { 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';
import { useCreateNote } from '../api/useNotes';
import { ICreateNoteDto } from '../types';
import { socket } from '../../../socket';

interface CreateNoteDialogProps {
  open: boolean;
  onClose: () => void;
}

const CreateNoteDialog: React.FC<CreateNoteDialogProps> = ({ open, onClose }) => {
  // Initial empty note
  const initialNote: ICreateNoteDto = {
    title: '',
    content: ''
  };
  
  // State for form
  const [note, setNote] = useState<ICreateNoteDto>(initialNote);
  
  // Form validation
  const [errors, setErrors] = useState({
    title: false,
    content: false
  });
  
  // Mutation
  const createNoteMutation = useCreateNote();
  
  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNote(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [name]: false
      }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      title: !note.title.trim(),
      content: !note.content.trim()
    };
    
    setErrors(newErrors);
    return !newErrors.title && !newErrors.content;
  };
  
  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      const newNote = await createNoteMutation.mutateAsync(note);
      
      // Emit socket event for real-time update
      // The backend will broadcast this to all connected clients
      // This is a backup in case the server-side event doesn't trigger
      socket.emit('note:create', newNote);
      
      handleClose();
    } catch (error) {
      console.error('Error creating note:', error);
    }
  };
  
  // Handle close
  const handleClose = () => {
    setNote(initialNote);
    setErrors({ title: false, content: false });
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle className="bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white">
        Create New Note
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
          value={note.title}
          onChange={handleChange}
          error={errors.title}
          helperText={errors.title ? "Title is required" : ""}
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
          value={note.content}
          onChange={handleChange}
          error={errors.content}
          helperText={errors.content ? "Content is required" : ""}
        />
      </DialogContent>
      <DialogActions className="bg-gray-50 dark:bg-gray-800 p-3">
        <Button onClick={handleClose} className="text-gray-600 dark:text-gray-300">
          Cancel
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained" 
          color="primary"
          disabled={createNoteMutation.isPending}
        >
          {createNoteMutation.isPending ? 'Creating...' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateNoteDialog;
