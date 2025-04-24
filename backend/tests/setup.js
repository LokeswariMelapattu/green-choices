// Test setup file
const { pool } = require('../config/db');

// Close database connection after all tests are finished
afterAll(async () => {
    await pool.end();
});

// Global before/after hooks can be added here