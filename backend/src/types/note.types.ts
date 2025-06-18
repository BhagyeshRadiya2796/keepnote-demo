import { Document, Types } from 'mongoose';
import { IUser } from './user.types';

export interface INote extends Document {
  title: string;
  content: string;
  user: Types.ObjectId | IUser;
  createdAt: Date;
  updatedAt: Date;
}
