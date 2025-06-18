"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupNoteEvents = void 0;
const note_service_1 = require("../services/note.service");
// Map to track which users are viewing/editing which notes
// Key: noteId, Value: Array of user IDs
const noteActiveUsers = new Map();
/**
 * Setup note-related Socket.IO events
 * @param {SocketIOServer} io - Socket.IO server instance
 */
const setupNoteEvents = (io) => {
    // Namespace for note events
    const noteNamespace = io.of('/notes');
    noteNamespace.on('connection', (socket) => {
        const user = socket.data.user;
        if (!user) {
            socket.disconnect();
            return;
        }
        console.log(`User connected to notes namespace: ${user.id}`);
        // Handle joining a note room
        socket.on('note:join', (noteId) => __awaiter(void 0, void 0, void 0, function* () {
            var _a;
            try {
                // Verify user has access to this note
                const note = yield note_service_1.noteService.getNoteById(noteId, user.id);
                if (!note) {
                    socket.emit('error', { message: 'Note not found or access denied' });
                    return;
                }
                // Join the room for this note
                socket.join(`note:${noteId}`);
                // Track active users for this note
                if (!noteActiveUsers.has(noteId)) {
                    noteActiveUsers.set(noteId, new Set());
                }
                (_a = noteActiveUsers.get(noteId)) === null || _a === void 0 ? void 0 : _a.add(user.id);
                // Broadcast updated active users list
                const activeUsers = Array.from(noteActiveUsers.get(noteId) || []);
                noteNamespace.to(`note:${noteId}`).emit('note:users', activeUsers);
                console.log(`User ${user.id} joined note ${noteId}`);
            }
            catch (error) {
                console.error(`Error joining note ${noteId}:`, error);
                socket.emit('error', { message: 'Failed to join note' });
            }
        }));
        // Handle leaving a note room
        socket.on('note:leave', (noteId) => {
            var _a, _b;
            socket.leave(`note:${noteId}`);
            // Remove user from active users for this note
            (_a = noteActiveUsers.get(noteId)) === null || _a === void 0 ? void 0 : _a.delete(user.id);
            if (((_b = noteActiveUsers.get(noteId)) === null || _b === void 0 ? void 0 : _b.size) === 0) {
                noteActiveUsers.delete(noteId);
            }
            // Broadcast updated active users list
            const activeUsers = Array.from(noteActiveUsers.get(noteId) || []);
            noteNamespace.to(`note:${noteId}`).emit('note:users', activeUsers);
            console.log(`User ${user.id} left note ${noteId}`);
        });
        // Handle real-time note updates
        socket.on('note:update', (_a) => __awaiter(void 0, [_a], void 0, function* ({ noteId, data }) {
            try {
                // Verify user has access to this note
                const existingNote = yield note_service_1.noteService.getNoteById(noteId, user.id);
                if (!existingNote) {
                    socket.emit('error', { message: 'Note not found or access denied' });
                    return;
                }
                // Update the note in the database
                const updatedNote = yield note_service_1.noteService.updateNote(noteId, data, user.id);
                // Broadcast the update to all clients in the room except the sender
                socket.to(`note:${noteId}`).emit('note:updated', updatedNote);
                console.log(`Note ${noteId} updated by user ${user.id}`);
            }
            catch (error) {
                console.error(`Error updating note ${noteId}:`, error);
                socket.emit('error', { message: 'Failed to update note' });
            }
        }));
        // Handle typing indicators
        socket.on('note:typing', (noteId) => {
            socket.to(`note:${noteId}`).emit('note:typing', user.id);
        });
        socket.on('note:typing-stopped', (noteId) => {
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
                    }
                    else {
                        // Broadcast updated active users list
                        const activeUsers = Array.from(users);
                        noteNamespace.to(`note:${noteId}`).emit('note:users', activeUsers);
                    }
                }
            }
        });
    });
};
exports.setupNoteEvents = setupNoteEvents;
//# sourceMappingURL=noteEvents.js.map