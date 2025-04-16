const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Function to test the connection (no longer runs automatically)
const testConnection = () => {
  return pool.query('SELECT NOW()', (err, res) => {
    if (err) {
      console.error('Database connection error:', err.stack);
    } else {
      console.log('Database connected successfully at:', res.rows[0].now);
    }
  });
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
  testConnection
};