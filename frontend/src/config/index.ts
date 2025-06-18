/**
 * Environment Configuration
 * 
 * This file centralizes all environment variable access and provides
 * type-safe access to configuration values throughout the application.
 */

interface EnvConfig {
  api: {
    baseUrl: string;
    timeout: number;
  };
  features: {
    enableAuth: boolean;
    enableNotifications: boolean;
  };
  app: {
    name: string;
  };
}

// Validate that a required environment variable exists
const requireEnv = (name: string): string => {
  // Check both import.meta.env and process.env for compatibility
  const value = import.meta.env[name] || process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Parse boolean environment variables
const parseBool = (value: string | undefined): boolean => {
  if (!value) return false;
  return value.toLowerCase() === 'true';
};

// Parse numeric environment variables
const parseNumber = (value: string | undefined, defaultValue: number): number => {
  if (!value) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper to get environment variable from either Vite or legacy React format
const getEnv = (viteKey: string, reactKey: string, defaultValue: string = ''): string => {
  return import.meta.env[viteKey] || process.env[reactKey] || defaultValue;
};

// Create and export the configuration object
const config: EnvConfig = {
  api: {
    baseUrl: getEnv('VITE_API_URL', 'REACT_APP_API_URL', 'http://localhost:5000/api'),
    timeout: parseNumber(getEnv('VITE_API_TIMEOUT', 'REACT_APP_API_TIMEOUT'), 10000),
  },
  features: {
    enableAuth: parseBool(getEnv('VITE_ENABLE_AUTH', 'REACT_APP_ENABLE_AUTH')),
    enableNotifications: parseBool(getEnv('VITE_ENABLE_NOTIFICATIONS', 'REACT_APP_ENABLE_NOTIFICATIONS')),
  },
  app: {
    name: getEnv('VITE_APP_NAME', 'REACT_APP_APP_NAME', 'KeepNotes'),
  },
};

export default config;
