import { Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  username: string; // Added username field
  createdAt: Date;
  updatedAt: Date;
  isPasswordMatch(password: string): Promise<boolean>;
}
