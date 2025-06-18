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
exports.noteController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const note_service_1 = require("../services/note.service");
const getNotes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: 'Not authenticated' });
        }
        const notes = yield note_service_1.noteService.getNotesByUser(authReq.user.id);
        return res.status(http_status_1.default.OK).json(notes);
    }
    catch (error) {
        return next(error);
    }
});
const createNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: 'Not authenticated' });
        }
        const note = yield note_service_1.noteService.createNote(req.body, authReq.user.id);
        return res.status(http_status_1.default.CREATED).json(note);
    }
    catch (error) {
        return next(error);
    }
});
const updateNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: 'Not authenticated' });
        }
        const note = yield note_service_1.noteService.updateNote(req.params.noteId, req.body, authReq.user.id);
        return res.status(http_status_1.default.OK).json(note);
    }
    catch (error) {
        return next(error);
    }
});
const deleteNote = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authReq = req;
        if (!authReq.user) {
            return res.status(http_status_1.default.UNAUTHORIZED).json({ message: 'Not authenticated' });
        }
        yield note_service_1.noteService.deleteNote(req.params.noteId, authReq.user.id);
        return res.status(http_status_1.default.NO_CONTENT).send();
    }
    catch (error) {
        return next(error);
    }
});
exports.noteController = {
    getNotes,
    createNote,
    updateNote,
    deleteNote,
};
//# sourceMappingURL=note.controller.js.map