import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import { noteService } from '../services/note.service';
import { AuthRequest } from '../middlewares/auth';

const getNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }
    
    const notes = await noteService.getNotesByUser(authReq.user.id);
    return res.status(httpStatus.OK).json(notes);
  } catch (error) {
    return next(error);
  }
};

const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }
    
    const note = await noteService.createNote(req.body, authReq.user.id);
    return res.status(httpStatus.CREATED).json(note);
  } catch (error) {
    return next(error);
  }
};

const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }
    
    const note = await noteService.updateNote(req.params.noteId, req.body, authReq.user.id);
    return res.status(httpStatus.OK).json(note);
  } catch (error) {
    return next(error);
  }
};

const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      return res.status(httpStatus.UNAUTHORIZED).json({ message: 'Not authenticated' });
    }
    
    await noteService.deleteNote(req.params.noteId, authReq.user.id);
    return res.status(httpStatus.NO_CONTENT).send();
  } catch (error) {
    return next(error);
  }
};

export const noteController = {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
};
