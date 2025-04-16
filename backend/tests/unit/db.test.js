jest.mock('pg', () => {
    const mockPool = {
        query: jest.fn(),
        on: jest.fn()
    };
    return { Pool: jest.fn(() => mockPool) };
});


jest.mock('dotenv', () => ({
    config: jest.fn()
}));

describe('Database Configuration', () => {
    let db;
    let pgMock;

    beforeEach(() => {

        jest.resetModules();


        pgMock = require('pg');


        db = require('../../config/db');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should create a pool with the correct configuration', () => {

        expect(pgMock.Pool).toHaveBeenCalledWith({
            user: process.env.DB_USER,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
        });
    });

    it('should export a query function that calls pool.query', async () => {
        const mockPool = pgMock.Pool();
        const queryText = 'SELECT * FROM users';
        const queryParams = [1];

        mockPool.query.mockResolvedValueOnce({ rows: [{ id: 1 }] });

        await db.query(queryText, queryParams);

        expect(mockPool.query).toHaveBeenCalledWith(queryText, queryParams);
    });

    it('should export the pool', () => {
        expect(db.pool).toBeDefined();
        expect(db.pool).toBe(pgMock.Pool());
    });

    it('should have a testConnection function that queries the database', async () => {
        const mockPool = pgMock.Pool();
        const mockResult = { rows: [{ now: new Date().toISOString() }] };


        mockPool.query.mockImplementationOnce((query, callback) => {
            callback(null, mockResult);
            return { rows: mockResult.rows };
        });


        const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

        const result = db.testConnection();

        expect(mockPool.query).toHaveBeenCalledWith('SELECT NOW()', expect.any(Function));
        expect(consoleSpy).toHaveBeenCalledWith(
            'Database connected successfully at:',
            mockResult.rows[0].now
        );


        consoleSpy.mockRestore();

        return result;
    });

    it('should handle connection errors in testConnection', async () => {
        const mockPool = pgMock.Pool();
        const mockError = new Error('Connection failed');

        mockPool.query.mockImplementationOnce((query, callback) => {
            callback(mockError, null);
            return Promise.reject(mockError);
        });

        // Create a spy on console.error
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

        try {
            await db.testConnection();
        } catch (err) {
            // Expected to fail
        }

        expect(mockPool.query).toHaveBeenCalledWith('SELECT NOW()', expect.any(Function));
        expect(consoleSpy).toHaveBeenCalledWith(
            'Database connection error:',
            mockError.stack
        );

        // Restore console.error
        consoleSpy.mockRestore();
    });
});