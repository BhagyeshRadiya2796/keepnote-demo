import { model, Schema, Types } from 'mongoose';
import { INote } from '../types/note.types.js';

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
  },
  user: {
    type: Types.ObjectId,
    ref: 'UserProfile',
    required: [true, 'User is required'],
  },
}, { timestamps: true });

export const Note = model<INote>('Note', noteSchema, 'notes');
