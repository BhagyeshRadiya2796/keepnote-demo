import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export interface Config {
  port: number;
  mongodbUri: string;
  jwt: {
    secret: string;
    accessExpirationMinutes: string;
  };
  env: string;
  clientUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  mongodbUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/keepnotes',
  jwt: {
    secret: process.env.JWT_SECRET || 'your_jwt_secret_key_here',
    accessExpirationMinutes: process.env.JWT_ACCESS_EXPIRATION_MINUTES || '30d',
  },
  env: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
};

export default config;
