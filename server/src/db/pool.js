const { Pool } = require('pg');
const config = require('../config');

let pool = null;
if (config.databaseUrl) {
  try {
    pool = new Pool({ connectionString: config.databaseUrl });
  } catch (e) {
    pool = null;
  }
}

module.exports = { pool };
