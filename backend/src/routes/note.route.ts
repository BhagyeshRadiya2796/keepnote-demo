import express, { Router } from 'express';
import { noteController } from '../controllers/note.controller';
import { validate } from '../middlewares/validate';
import { createNoteSchema, updateNoteSchema, deleteNoteSchema } from '../validations/note.validation';
import { authenticate } from '../middlewares/auth';

const router: Router = express.Router();

// All note routes are protected
router.get('/', authenticate as any, noteController.getNotes);
router.post('/', authenticate as any, validate(createNoteSchema), noteController.createNote);
router.put('/:noteId', authenticate as any, validate(updateNoteSchema), noteController.updateNote);
router.delete('/:noteId', authenticate as any, validate(deleteNoteSchema), noteController.deleteNote);

export default router;
