import { useEffect, useState, useCallback, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { socket } from './index';
import { notesKeys } from '../features/notes/api/queryKeys';
import { INote } from '../features/notes/types';
import { debounce } from '../utils/debounce';

interface ActiveUser {
  id: string;
  email: string;
}

/**
 * Custom hook for Socket.IO functionality related to notes
 * @param {string} noteId - ID of the note to connect to (optional)
 */
// Interface for content change event data
interface ContentChangeData {
  noteId: string;
  content: string;
  title: string;
  userId: string;
}

export const useNoteSocket = (noteId?: string) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([]);
  // Store typing users with their username and email for display
  const [typingUsers, setTypingUsers] = useState<{userId: string; email: string; username: string}[]>([]);
  // Store real-time content changes - simplified to just title and content
  const [liveContent, setLiveContent] = useState<{title: string; content: string; userId?: string} | null>(null);
  const queryClient = useQueryClient();
  // Ref to track if we should apply incoming content changes
  const isEditingRef = useRef(false);

  // Connect to socket when component mounts
  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      // Don't disconnect here as other components might be using the socket
      // We'll handle disconnection in the SocketProvider component
    };
  }, []);

  // Handle note-specific events
  useEffect(() => {
    if (!noteId) return;

    // Connection events
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    // Note-specific events
    const onNoteUpdated = (updatedNote: INote) => {
      // Update the note in the cache
      queryClient.setQueryData(notesKeys.detail(updatedNote._id), updatedNote);
      // Update the notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    };

    const onNoteDeleted = (data: { _id: string }) => {
      // Remove the note from the cache
      queryClient.removeQueries({ queryKey: notesKeys.detail(data._id) });
      // Update the notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    };

    const onNoteCreated = (newNote: INote) => {
      // Update the notes list
      queryClient.invalidateQueries({ queryKey: notesKeys.lists() });
    };

    const onUserJoined = (users: ActiveUser[]) => {
      setActiveUsers(users);
    };

    const onUserTyping = (userData: { userId: string; email: string; username: string }) => {
      setTypingUsers(prev => [
        ...prev.filter(user => user.userId !== userData.userId),
        userData
      ]);
    };

    const onUserStoppedTyping = (userId: string) => {
      console.log('Received typing stopped event for user:', userId);
      
      // Immediately filter out the user who stopped typing
      setTypingUsers(prev => {
        const filtered = prev.filter(user => user.userId !== userId);
        console.log(`Filtered typing users after ${userId} stopped typing:`, filtered);
        return filtered;
      });
      
      // Force an update after a small delay to ensure UI is refreshed
      setTimeout(() => {
        setTypingUsers(prev => {
          // Only update if the user is still in the list (shouldn't happen, but just in case)
          const stillHasUser = prev.some(user => user.userId === userId);
          if (stillHasUser) {
            console.log(`Safety cleanup: User ${userId} still in typing users list, removing...`);
            return prev.filter(user => user.userId !== userId);
          }
          return prev;
        });
      }, 100);
    };
    
    // Handle real-time content changes from other users
    const onContentChange = (data: ContentChangeData) => {
      console.log('Received content change:', data);
      
      // Only update liveContent if the note ID matches
      if (data.noteId === noteId) {
        // Update liveContent with the new data including userId
        setLiveContent({
          title: data.title,
          content: data.content,
          userId: data.userId // Include the userId to identify who made the change
        });
        
        console.log(`Content change from user ${data.userId} applied to liveContent`);
      }
    };

    // Register event listeners
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('note:updated', onNoteUpdated);
    socket.on('note:deleted', onNoteDeleted);
    socket.on('note:created', onNoteCreated);
    socket.on('note:users', onUserJoined);
    socket.on('note:typing', onUserTyping);
    socket.on('note:typing-stopped', onUserStoppedTyping);
    socket.on('note:content-change', onContentChange);

    // Join note room
    socket.emit('note:join', noteId);

    // Cleanup
    return () => {
      // Leave note room
      socket.emit('note:leave', noteId);
      
      // Remove event listeners
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('note:updated', onNoteUpdated);
      socket.off('note:deleted', onNoteDeleted);
      socket.off('note:created', onNoteCreated);
      socket.off('note:users', onUserJoined);
      socket.off('note:typing', onUserTyping);
      socket.off('note:typing-stopped', onUserStoppedTyping);
      socket.off('note:content-change', onContentChange);
    };
  }, [noteId, queryClient]);

  // Debounced function to emit typing events
  const debouncedEmitTyping = useCallback(
    debounce((isTyping: boolean) => {
      if (!noteId) {
        console.warn('Cannot emit typing event: noteId is undefined');
        return;
      }

      // Make sure socket is connected
      if (!socket.connected) {
        console.log('Socket not connected, connecting now...');
        socket.connect();
      }

      if (isTyping) {
        console.log(`Emitting typing event for note: ${noteId}`);
        socket.emit('note:typing', noteId, (acknowledgement: any) => {
          console.log('Server acknowledged typing event:', acknowledgement);
        });
        
        // Update local typing state immediately for better UI feedback
        // This is just a visual optimization
        isEditingRef.current = true;
      } else {
        console.log(`Emitting typing stopped event for note: ${noteId}`);
        socket.emit('note:typing-stopped', noteId, (acknowledgement: any) => {
          console.log('Server acknowledged typing stopped event:', acknowledgement);
        });
        
        // Update local typing state immediately for better UI feedback
        isEditingRef.current = false;
      }
    }, 300), // Reduced debounce time for more responsive typing indicators
    [noteId]
  );

  // Function to emit typing event
  const emitTyping = useCallback((isTyping: boolean) => {
    debouncedEmitTyping(isTyping);
  }, [debouncedEmitTyping]);
  
  // Function to immediately emit typing stopped (without debounce)
  const emitTypingStopped = useCallback(() => {
    if (!noteId) {
      console.warn('Cannot emit typing-stopped: noteId is undefined');
      return;
    }
    
    // First, clear the typing users state immediately for instant UI feedback
    setTypingUsers([]);
    
    // Make sure socket is connected before emitting event
    if (!socket.connected) {
      console.log('Socket not connected, connecting now...');
      socket.connect();
    }
    
    // Log before emitting for debugging
    console.log(`Emitting typing stopped event for note: ${noteId}`);
    
    // Emit the event to the server
    socket.emit('note:typing-stopped', noteId, (acknowledgement: any) => {
      console.log('Server acknowledged typing-stopped event:', acknowledgement);
    });
    
    // Double-check with a safety timeout to ensure typing users are cleared
    // This is a backup in case the socket event doesn't work
    setTimeout(() => {
      setTypingUsers(prev => {
        if (prev.length > 0) {
          console.log('Safety timeout: clearing typing users');
          return [];
        }
        return prev;
      });
    }, 200);
  }, [noteId, setTypingUsers]);
  
  // Function to emit content changes
  const emitContentChange = useCallback((title: string, content: string) => {
    if (!noteId) return;
    
    // Make sure socket is connected
    if (!socket.connected) {
      console.log('Socket not connected, connecting now...');
      socket.connect();
    }
    
    console.log(`Emitting content change for note: ${noteId}`);
    socket.emit('note:content-change', {
      noteId,
      title,
      content
    });
    
    // Also emit typing event to show typing indicator
    // This ensures typing indicator shows when content changes
    socket.emit('note:typing', noteId);
  }, [noteId]);
  
  // Function to set editing state
  const setIsEditing = useCallback((editing: boolean) => {
    isEditingRef.current = editing;
  }, []);

  return {
    isConnected,
    activeUsers,
    typingUsers,
    liveContent,
    emitTyping,
    emitTypingStopped, // Add the new function to the returned object
    emitContentChange,
    setIsEditing,
    setTypingUsers // Expose the setTypingUsers function
  };
};
