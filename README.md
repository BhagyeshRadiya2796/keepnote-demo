# KeepNotes - Real-Time Collaborative Notes Application

KeepNotes is a modern, real-time collaborative note-taking application built with React on the frontend and Express/Node.js on the backend. Users can create, edit, and share notes with real-time collaboration features, allowing multiple users to work on the same note simultaneously.

## Features

- **User Authentication** - Secure signup and login with JWT
- **Real-time Collaboration** - Multiple users can edit the same note simultaneously
- **Live Typing Indicators** - See when other users are editing a note
- **Automatic Saving** - Notes are auto-saved while editing
- **Responsive Design** - Works seamlessly across desktop and mobile devices
- **Dark Mode** - Toggle between light and dark themes

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Redux Toolkit** for client-side state management
- **React Query** for server state management and data fetching
- **Material UI** & **TailwindCSS** for styling
- **Socket.IO Client** for real-time communication
- **React Router DOM** for routing
- **React Hook Form** with Joi validation
- **Vite** as the build tool

### Backend
- **Node.js** with **Express** framework
- **TypeScript** for type safety
- **MongoDB** with **Mongoose** for data storage
- **Socket.IO** for real-time event handling
- **JWT** for authentication
- **Joi** for validation
- **Passport** for authentication strategies
- **CORS** configured for secure cross-origin requests

## Project Structure

### Backend Structure
```
backend/
├── src/
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middlewares/     # Custom middlewares (auth, error, validate)
│   ├── models/          # Mongoose models and schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── socket/          # Socket.IO event handlers
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Utility functions
│   ├── validations/     # Joi validation schemas
│   ├── app.ts           # Express app setup
│   └── index.ts         # Entry point
├── .env                 # Environment variables
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── Dockerfile           # Docker configuration
```

### Frontend Structure
```
frontend/
├── src/
│   ├── api/             # API call functions
│   ├── app/             # Redux store setup
│   ├── components/      # Shared UI components
│   ├── context/         # React contexts
│   ├── features/        # Feature-based modules
│   │   ├── auth/        # Authentication feature
│   │   ├── notes/       # Notes feature
│   │   └── theme/       # Theme feature
│   ├── hooks/           # Custom React hooks
│   ├── layouts/         # Page layouts
│   ├── pages/           # Top-level page components
│   ├── routes/          # Routing configuration
│   ├── socket/          # Socket.IO client setup
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   └── App.tsx          # Root component
├── index.html           # HTML entry point
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies and scripts
└── tailwind.config.js   # Tailwind CSS configuration
```

## Setup and Installation

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/keepnotes
   JWT_SECRET=your_jwt_secret
   JWT_ACCESS_EXPIRATION_MINUTES=30
   JWT_REFRESH_EXPIRATION_DAYS=30
   CLIENT_URL=http://localhost:3000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file with the following variables:
   ```
   VITE_API_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/refresh-token` - Get new access token using refresh token

### Notes
- `GET /api/notes` - Get all notes for the authenticated user
- `GET /api/notes/:id` - Get a specific note by ID
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update an existing note
- `DELETE /api/notes/:id` - Delete a note

## Real-time Features

The application uses Socket.IO to implement real-time collaboration:

- **Content Synchronization** - Changes to notes are instantly visible to all connected users
- **Typing Indicators** - Shows when other users are typing in a shared note
- **Active User Tracking** - Displays which users are currently viewing a note

## Deployment

The project includes Docker configuration for containerization, making it easy to deploy using services like Docker Compose:

```bash
docker-compose up -d
```

## License

This project is licensed under the MIT License.
