import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file if present
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const ENV = {
  BASE_URL: process.env.BASE_URL || 'https://www.demoblaze.com',
  API_BASE_URL: process.env.API_BASE_URL || 'https://api.demoblaze.com',
  HEADLESS: process.env.HEADLESS === 'true' || true,
  TIMEOUT: process.env.TIMEOUT ? parseInt(process.env.TIMEOUT, 10) : 30000,
  DEFAULT_USER: process.env.DEFAULT_USER || 'testuser_qa_2026',
  DEFAULT_PASSWORD: process.env.DEFAULT_PASSWORD || 'Password123!',
};
