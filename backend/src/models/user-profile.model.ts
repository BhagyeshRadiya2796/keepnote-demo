import { model, Schema } from 'mongoose';
import { IUser } from '../types/user.types';
import bcrypt from 'bcrypt';

const userProfileSchema = new Schema<IUser>({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
  },
}, { timestamps: true });

// Hash password before saving
userProfileSchema.pre('save', async function(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Method to check if password is correct
userProfileSchema.methods.isPasswordMatch = async function(password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const UserProfile = model<IUser>('UserProfile', userProfileSchema, 'user-profiles');
