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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteService = void 0;
const note_model_1 = require("../models/note.model");
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const index_1 = require("../index");
/**
 * Create a new note
 * @param {Object} noteData - Note data to create
 * @param {string} userId - ID of the user creating the note
 * @returns {Promise<INote>}
 */
const createNote = (noteData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield note_model_1.Note.create(Object.assign(Object.assign({}, noteData), { user: userId }));
    // Emit Socket.IO event for real-time updates
    index_1.io.of('/notes').emit('note:created', note);
    return note;
});
/**
 * Update an existing note
 * @param {string} noteId - ID of the note to update
 * @param {Object} updateData - Data to update the note with
 * @param {string} userId - ID of the user updating the note
 * @returns {Promise<INote | null>}
 */
const updateNote = (noteId, updateData, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield note_model_1.Note.findById(noteId);
    if (!note) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
    }
    // Check if the note belongs to the user
    if (note.user.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to update this note');
    }
    Object.assign(note, updateData);
    yield note.save();
    // Emit Socket.IO event for real-time updates
    index_1.io.of('/notes').to(`note:${noteId}`).emit('note:updated', note);
    return note;
});
/**
 * Delete a note
 * @param {string} noteId - ID of the note to delete
 * @param {string} userId - ID of the user deleting the note
 * @returns {Promise<INote | null>}
 */
const deleteNote = (noteId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield note_model_1.Note.findById(noteId);
    if (!note) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
    }
    // Check if the note belongs to the user
    if (note.user.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to delete this note');
    }
    yield note.deleteOne();
    // Emit Socket.IO event for real-time updates
    index_1.io.of('/notes').to(`note:${noteId}`).emit('note:deleted', { _id: noteId });
    return note;
});
/**
 * Get all notes for a user
 * @param {string} userId - ID of the user
 * @returns {Promise<INote[]>}
 */
const getNotesByUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return note_model_1.Note.find({ user: userId }).sort({ updatedAt: -1 });
});
/**
 * Get a note by ID
 * @param {string} noteId - ID of the note
 * @param {string} userId - ID of the user
 * @returns {Promise<INote | null>}
 */
const getNoteById = (noteId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const note = yield note_model_1.Note.findById(noteId);
    if (!note) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Note not found');
    }
    // Check if the note belongs to the user
    if (note.user.toString() !== userId) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'You do not have permission to view this note');
    }
    return note;
});
exports.noteService = {
    createNote,
    updateNote,
    deleteNote,
    getNotesByUser,
    getNoteById,
};
//# sourceMappingURL=note.service.js.map