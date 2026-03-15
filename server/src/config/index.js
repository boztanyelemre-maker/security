// DOTENV_SKIP=1: test ortamında .env yüklemesini atla (env validation testi)
if (!process.env.DOTENV_SKIP) require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT || '3000', 10);
const jwtSecret = process.env.JWT_SECRET || '';
const jwtExpiresIn = process.env.JWT_EXPIRES_IN || '7d';
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean);

if (!jwtSecret && env === 'production') {
  throw new Error('JWT_SECRET is required in production');
}

module.exports = {
  env,
  port,
  isProduction: env === 'production',
  jwtSecret: jwtSecret || 'dev-secret-change-in-production',
  jwtExpiresIn,
  corsOrigins,
  databaseUrl: process.env.DATABASE_URL,
};
