const express = require('express');
const router = express.Router();
const { pool } = require('../db/pool');

router.get('/', async (req, res) => {
  const env = process.env.NODE_ENV || 'development';
  const timestamp = new Date().toISOString();
  let db = 'disconnected';

  if (pool) {
    try {
      await pool.query('SELECT 1');
      db = 'connected';
    } catch (e) {
      db = 'disconnected';
    }
  }

  res.json({
    ok: true,
    status: 'ok',
    env,
    db,
    timestamp,
  });
});

module.exports = router;
