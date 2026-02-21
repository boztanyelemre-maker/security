require('dotenv').config();

const env = process.env.NODE_ENV || 'development';
const port = parseInt(process.env.PORT || '3000', 10);
const jwtSecret = process.env.JWT_SECRET || '';
const corsOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',').map(s => s.trim()).filter(Boolean);

if (!jwtSecret && env === 'production') {
  throw new Error('JWT_SECRET is required in production');
}

module.exports = {
  env,
  port,
  isProduction: env === 'production',
  jwtSecret: jwtSecret || 'dev-secret-change-in-production',
  corsOrigins,
  databaseUrl: process.env.DATABASE_URL,
};
