require('dotenv').config();

const app = require('./app');
const config = require('./config');

// Env eksikse uyar (dev)
if (config.env !== 'production') {
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET === '') {
    console.warn('[env] JWT_SECRET not set; using dev default. Set JWT_SECRET in production.');
  }
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL === '') {
    console.warn('[env] DATABASE_URL not set; DB features will be unavailable.');
  }
  if (!process.env.CORS_ORIGINS || process.env.CORS_ORIGINS === '') {
    console.warn('[env] CORS_ORIGINS not set; using default localhost origins.');
  }
}

const port = config.port;
app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
