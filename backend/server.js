const express = require('express');
const cors = require('cors')
const routeRoutes = require('./routes/routes.js');
const userRoutes = require('./routes/userRoutes.js');
const productRoutes = require('./routes/productRoutes.js')
const saveRouteRoutes = require('./routes/saveRouteRoutes.js');
const { pool } = require('./config/db');
require('dotenv').config();

const app = express();
app.use(cors())
app.use(express.json());

// Routes
app.use('/', routeRoutes);
app.use('/user', userRoutes);
app.use('/products', productRoutes);
app.use('/', saveRouteRoutes);

const verifyDatabaseConnection = async () => {
    try {
        // Test if the database is running and we can connect
        const client = await pool.connect();

        // Test if our required database exists and tables are present
        const dbCheckResult = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'user_info'
        );
      `);

        const tablesExist = dbCheckResult.rows[0].exists;

        if (!tablesExist) {
            console.error('Database tables not found! Please run the migrations script.');
            return false;
        }

        console.log('Database connection successful and required tables exist.');
        client.release();
        return true;
    } catch (error) {
        console.error('Database connection error:', error.message);
        console.error('Please check if PostgreSQL is running and the database exists.');
        return false;
    }
};

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        // Check database connection
        const dbConnectionSuccessful = await verifyDatabaseConnection();

        if (dbConnectionSuccessful) {
            return res.status(200).json({
                status: 'healthy',
                database: 'connected',
                timestamp: new Date().toISOString()
            });
        } else {
            return res.status(500).json({
                status: 'unhealthy',
                database: 'disconnected',
                timestamp: new Date().toISOString()
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

const PORT = process.env.PORT || 3000;;
const startServer = async () => {
    try {
        // First verify database connection
        const dbReady = await verifyDatabaseConnection();

        if (!dbReady) {
            console.error('Failed to connect to the database. Server will not start.');
            process.exit(1);
        }

        // Start the server if database is ready
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Health check available at: http://localhost:${PORT}/health`);
        }).on('error', (err) => {
            console.error('Failed to start server:', err.message);
            process.exit(1);
        });
    } catch (error) {
        console.error('Failed to start application:', error);
        process.exit(1);
    }
};


startServer();