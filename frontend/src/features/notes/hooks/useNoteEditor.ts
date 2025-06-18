import { useState, useEffect, useCallback } from 'react';
import { useUpdateNote } from '../api/useNotes';
import { INote, IUpdateNoteDto } from '../types';
import { useNoteSocket } from '../../../socket/useNoteSocket';
import { debounce } from '../../../utils/debounce';

/**
 * Custom hook for note editing with auto-save and real-time updates
 * @param note The note being edited
 * @param onClose Callback to close the editor
 */
export const useNoteEditor = (note: INote, onClose: () => void) => {
  // State for the edited note
  const [editedNote, setEditedNote] = useState<IUpdateNoteDto>({
    title: note.title,
    content: note.content
  });

  // Form validation
  const [errors, setErrors] = useState({
    title: false,
    content: false
  });

  // Update mutation
  const updateNoteMutation = useUpdateNote();
  
  // Socket integration
  const { emitTyping } = useNoteSocket(note._id);

  // Auto-save functionality
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  
  // Debounced auto-save function (every 10 seconds)
  const debouncedAutoSave = useCallback(
    debounce(async () => {
      if (!editedNote.title?.trim() || !editedNote.content?.trim()) {
        return;
      }
      
      // Only save if there are changes
      if (editedNote.title !== note.title || editedNote.content !== note.content) {
        setIsAutoSaving(true);
        try {
          await updateNoteMutation.mutateAsync({
            id: note._id,
            data: editedNote
          });
          setLastSavedAt(new Date());
        } catch (error) {
          console.error('Error auto-saving note:', error);
        } finally {
          setIsAutoSaving(false);
        }
      }
    }, 10000),
    [editedNote, note._id, note.title, note.content, updateNoteMutation]
  );

  // Handle form change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setEditedNote(prev => ({
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
    
    // Emit typing event to notify other users
    emitTyping(true);
    
    // Trigger auto-save
    debouncedAutoSave();
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = {
      title: !editedNote.title?.trim(),
      content: !editedNote.content?.trim()
    };
    
    setErrors(newErrors);
    return !newErrors.title && !newErrors.content;
  };

  // Handle save
  const handleSave = async () => {
    if (!validateForm()) return;
    
    try {
      await updateNoteMutation.mutateAsync({
        id: note._id,
        data: editedNote
      });
      
      // Notify that typing has stopped
      emitTyping(false);
      
      onClose();
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  // Handle close
  const handleClose = () => {
    // Notify that typing has stopped
    emitTyping(false);
    onClose();
  };

  // Effect to trigger auto-save when component unmounts
  useEffect(() => {
    return () => {
      // Notify that typing has stopped when component unmounts
      emitTyping(false);
    };
  }, [emitTyping]);

  return {
    editedNote,
    errors,
    isAutoSaving,
    lastSavedAt,
    handleChange,
    handleSave,
    handleClose,
    validateForm
  };
};
