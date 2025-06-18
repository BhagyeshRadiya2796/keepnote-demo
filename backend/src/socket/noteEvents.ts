import { Server as SocketIOServer, Socket } from 'socket.io';
import { noteService } from '../services/note.service';
import { userService } from '../services/user.service';
import { INote } from '../types/note.types';

// Type for user data attached to socket
interface SocketUser {
  id: string;
  email: string;
  username?: string; // Added username field
}

// Map to track which users are viewing/editing which notes
// Key: noteId, Value: Array of user IDs
const noteActiveUsers = new Map<string, Set<string>>();

/**
 * Setup note-related Socket.IO events
 * @param {SocketIOServer} io - Socket.IO server instance
 */
export const setupNoteEvents = (io: SocketIOServer): void => {
  // Register typing events on the main namespace
  io.on('connection', (socket) => {
    console.log('Setting up note events for socket:', socket.id);
    
    // Handle typing indicators directly on the main namespace
    socket.on('note:typing', async (noteId: string) => {
      try {
        // Get user data from the socket if available
        const user = socket.data?.user || { id: socket.id, email: 'Anonymous' };
        
        // Debug user data from socket
        console.log('DEBUG - Socket user data:', JSON.stringify(user));
        
        // Get the user ID from the token (sub field)
        const userId = user.sub;
        let username = 'Anonymous';
        let email = 'anonymous@example.com';
        
        // If we have a user ID, fetch the complete user data from the database
        if (userId) {
          const dbUser = await userService.getUserById(userId);
          if (dbUser) {
            console.log('DEBUG - User from database:', JSON.stringify({
              id: dbUser._id,
              email: dbUser.email,
              username: dbUser.username
            }));
            username = dbUser.username || dbUser.email.split('@')[0];
            email = dbUser.email;
          }
        } else if (user.email) {
          // Fallback to email from token if no user ID
          email = user.email;
          username = user.email.split('@')[0];
        }
        
        console.log(`User ${username} is typing in note ${noteId}`);
        
        // Broadcast to all clients in the room except the sender
        // Include user information so the frontend can display who is typing
        socket.to(`note:${noteId}`).emit('note:typing', {
          userId: socket.id,
          email: email,
          username: username
        });
      } catch (error) {
        console.error('Error in note:typing event:', error);
        // Send a default message in case of error
        socket.to(`note:${noteId}`).emit('note:typing', {
          userId: socket.id,
          email: 'anonymous@example.com',
          username: 'Anonymous'
        });
      }
    });
    
    socket.on('note:typing-stopped', async (noteId: string) => {
      try {
        // Get user data from the socket if available
        const user = socket.data?.user || { id: socket.id, email: 'Anonymous' };
        
        // Debug user data from socket
        console.log('DEBUG - Socket user data (typing stopped):', JSON.stringify(user));
        
        // Get the user ID from the token (sub field)
        const userId = user.sub;
        let username = 'Anonymous';
        
        // If we have a user ID, fetch the complete user data from the database
        if (userId) {
          const dbUser = await userService.getUserById(userId);
          if (dbUser) {
            username = dbUser.username || dbUser.email.split('@')[0];
          }
        } else if (user.email) {
          // Fallback to email from token if no user ID
          username = user.email.split('@')[0];
        }
        
        console.log(`User ${username} stopped typing in note ${noteId}`);
        
        // Broadcast to all clients in the room except the sender
        socket.to(`note:${noteId}`).emit('note:typing-stopped', socket.id);
      } catch (error) {
        console.error('Error in note:typing-stopped event:', error);
        // Still emit the event to ensure typing indicator is removed
        socket.to(`note:${noteId}`).emit('note:typing-stopped', socket.id);
      }
    });
    
    // Handle joining a note room
    socket.on('note:join', (noteId: string) => {
      console.log(`Socket ${socket.id} joining note room: note:${noteId}`);
      socket.join(`note:${noteId}`);
    });
    
    // Handle real-time content updates
    socket.on('note:content-change', async (data: { noteId: string; content: string; title: string }) => {
      try {
        const { noteId, content, title } = data;
        const user = socket.data?.user || { id: socket.id, email: 'Anonymous' };
        
        console.log(`User is updating content for note ${noteId}`);
        
        // Broadcast the content change to all other users in the room
        socket.to(`note:${noteId}`).emit('note:content-change', {
          noteId,
          content,
          title,
          userId: socket.id
        });
      } catch (error) {
        console.error('Error in note:content-change event:', error);
      }
    });
    
    // Handle leaving a note room
    socket.on('note:leave', (noteId: string) => {
      console.log(`Socket ${socket.id} leaving note room: note:${noteId}`);
      socket.leave(`note:${noteId}`);
    });
  });
  
  // For backwards compatibility, also set up the /notes namespace
  const noteNamespace = io.of('/notes');
  console.log('Setting up note events namespace: /notes');
  
  noteNamespace.on('connection', (socket: Socket) => {
    const user = socket.data.user as SocketUser;
    
    if (!user) {
      socket.disconnect();
      return;
    }

    console.log(`User connected to notes namespace: ${user.id}`);
    
    // Handle joining a note room
    socket.on('note:join', async (noteId: string) => {
      try {
        // Verify user has access to this note
        const note = await noteService.getNoteById(noteId, user.id);
        
        if (!note) {
          socket.emit('error', { message: 'Note not found or access denied' });
          return;
        }
        
        // Join the room for this note
        socket.join(`note:${noteId}`);
        
        // Track active users for this note
        if (!noteActiveUsers.has(noteId)) {
          noteActiveUsers.set(noteId, new Set<string>());
        }
        noteActiveUsers.get(noteId)?.add(user.id);
        
        // Broadcast updated active users list
        const activeUsers = Array.from(noteActiveUsers.get(noteId) || []);
        noteNamespace.to(`note:${noteId}`).emit('note:users', activeUsers);
        
        console.log(`User ${user.id} joined note ${noteId}`);
      } catch (error) {
        console.error(`Error joining note ${noteId}:`, error);
        socket.emit('error', { message: 'Failed to join note' });
      }
    });
    
    // Handle leaving a note room
    socket.on('note:leave', (noteId: string) => {
      socket.leave(`note:${noteId}`);
      
      // Remove user from active users for this note
      noteActiveUsers.get(noteId)?.delete(user.id);
      if (noteActiveUsers.get(noteId)?.size === 0) {
        noteActiveUsers.delete(noteId);
      }
      
      // Broadcast updated active users list
      const activeUsers = Array.from(noteActiveUsers.get(noteId) || []);
      noteNamespace.to(`note:${noteId}`).emit('note:users', activeUsers);
      
      console.log(`User ${user.id} left note ${noteId}`);
    });
    
    // Handle real-time note updates
    socket.on('note:update', async ({ noteId, data }: { noteId: string; data: Partial<INote> }) => {
      try {
        // Verify user has access to this note
        const existingNote = await noteService.getNoteById(noteId, user.id);
        
        if (!existingNote) {
          socket.emit('error', { message: 'Note not found or access denied' });
          return;
        }
        
        // Update the note in the database
        const updatedNote = await noteService.updateNote(noteId, data, user.id);
        
        // Broadcast the update to all clients in the room except the sender
        socket.to(`note:${noteId}`).emit('note:updated', updatedNote);
        
        console.log(`Note ${noteId} updated by user ${user.id}`);
      } catch (error) {
        console.error(`Error updating note ${noteId}:`, error);
        socket.emit('error', { message: 'Failed to update note' });
      }
    });
    
    // Handle typing indicators
    socket.on('note:typing', (noteId: string) => {
      console.log(`User ${user.id} is typing in note ${noteId}`);
      // Broadcast to all clients in the room except the sender
      socket.to(`note:${noteId}`).emit('note:typing', user.id);
    });
    
    socket.on('note:typing-stopped', (noteId: string) => {
      console.log(`User ${user.id} stopped typing in note ${noteId}`);
      // Broadcast to all clients in the room except the sender
      socket.to(`note:${noteId}`).emit('note:typing-stopped', user.id);
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`User disconnected from notes namespace: ${user.id}`);
      
      // Remove user from all note rooms they were in
      for (const [noteId, users] of noteActiveUsers.entries()) {
        if (users.has(user.id)) {
          users.delete(user.id);
          
          if (users.size === 0) {
            noteActiveUsers.delete(noteId);
          } else {
            // Broadcast updated active users list
            const activeUsers = Array.from(users);
            noteNamespace.to(`note:${noteId}`).emit('note:users', activeUsers);
          }
        }
      }
    });
  });
};
