const fs = require('fs');
const path = require('path');
const pool = require('../config/db');


async function initDatabase() {
  const schemaPath = path.join(__dirname, 'schema.sql');
  const schema = fs.readFileSync(schemaPath, 'utf8');

  try {
    await pool.query(schema);
    console.log('Database schema initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize database:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

initDatabase();