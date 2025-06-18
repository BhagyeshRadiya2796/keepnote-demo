import { Note } from '../models/note.model';
import { INote } from '../types/note.types';
import { Types } from 'mongoose';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { io } from '../index';

/**
 * Create a new note
 * @param {Object} noteData - Note data to create
 * @param {string} userId - ID of the user creating the note
 * @returns {Promise<INote>}
 */
const createNote = async (noteData: Partial<INote>, userId: string): Promise<INote> => {
  const note = await Note.create({
    ...noteData,
    user: userId,
  });
  
  // Emit Socket.IO event for real-time updates
  io.of('/notes').emit('note:created', note);
  
  return note;
};

/**
 * Update an existing note
 * @param {string} noteId - ID of the note to update
 * @param {Object} updateData - Data to update the note with
 * @param {string} userId - ID of the user updating the note
 * @returns {Promise<INote | null>}
 */
const updateNote = async (noteId: string, updateData: Partial<INote>, userId: string): Promise<INote | null> => {
  const note = await Note.findById(noteId);
  
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  
  Object.assign(note, updateData);
  await note.save();
  
  // Emit Socket.IO event for real-time updates
  io.of('/notes').to(`note:${noteId}`).emit('note:updated', note);
  
  return note;
};

/**
 * Delete a note
 * @param {string} noteId - ID of the note to delete
 * @param {string} userId - ID of the user deleting the note
 * @returns {Promise<INote | null>}
 */
const deleteNote = async (noteId: string, userId: string): Promise<INote | null> => {
  const note = await Note.findById(noteId);
  
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  
  await note.deleteOne();
  
  // Emit Socket.IO event for real-time updates
  io.of('/notes').to(`note:${noteId}`).emit('note:deleted', { _id: noteId });
  
  return note;
};

/**
 * Get all notes for a user
 * @param {string} userId - ID of the user
 * @returns {Promise<INote[]>}
 */
const getNotesByUser = async (userId: string): Promise<INote[]> => {
  return Note.find().sort({ updatedAt: -1 });
};

/**
 * Get a note by ID
 * @param {string} noteId - ID of the note
 * @param {string} userId - ID of the user
 * @returns {Promise<INote | null>}
 */
const getNoteById = async (noteId: string, userId: string): Promise<INote | null> => {
  const note = await Note.findById(noteId);
  
  if (!note) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Note not found');
  }
  
  return note;
};

export const noteService = {
  createNote,
  updateNote,
  deleteNote,
  getNotesByUser,
  getNoteById,
};
