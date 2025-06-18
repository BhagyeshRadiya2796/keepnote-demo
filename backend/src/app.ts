import express, { Express } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import passport from 'passport';
import userRoutes from './routes/user.route';
import authRoutes from './routes/auth.route';
import noteRoutes from './routes/note.route';
import { errorConverter, errorHandler } from './middlewares/error';
import config from './config/config';
import './config/passport';

// Initialize Express app
const app: Express = express();

// Connect to MongoDB
mongoose.connect(config.mongodbUri)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

// Middleware
app.use(cors({
  origin: config.clientUrl,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to KeepNotes API' });
});

// Error handling middleware
app.use(errorConverter);
app.use(errorHandler);

export default app;
