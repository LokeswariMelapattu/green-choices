require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const initializeDatabase = async () => {
  // Create a connection to PostgreSQL (not to a specific database yet)
  const pgPool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: 'postgres' // Connect to default postgres database
  });

  try {
    // Check if our target database exists
    const dbCheckResult = await pgPool.query(`
      SELECT EXISTS (
        SELECT FROM pg_database WHERE datname = $1
      );
    `, [process.env.DB_NAME]);
    
    const dbExists = dbCheckResult.rows[0].exists; 
     
    if (!dbExists) {
      console.log(`Database '${process.env.DB_NAME}' does not exist. Creating it now...`);
      
      // Create the database
      await pgPool.query(`CREATE DATABASE ${process.env.DB_NAME};`);
      console.log(`Database '${process.env.DB_NAME}' created successfully.`);
    } else {
      console.log(`Database '${process.env.DB_NAME}' already exists.`);
    }

    // Close the default postgres connection
    await pgPool.end();
    
    // Connect to our new database to create tables
    const appPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });
    
    // Read and execute the SQL migration file
    const sqlFilePath = path.join(__dirname, '..', 'db', 'migrations', 'init.sql');
    const sqlQueries = fs.readFileSync(sqlFilePath, 'utf8');
    
    console.log('Running database migrations...');
    await appPool.query(sqlQueries);
    console.log('Database migrations completed successfully.');
    
    await appPool.end();
    
    console.log('Database initialization complete!');
    process.exit(0);
  } catch (error) {
    console.error('Database initialization failed:', error.message);
    process.exit(1);
  }
};

initializeDatabase();