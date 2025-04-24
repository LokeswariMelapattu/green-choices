// User model tests
const userModel = require('../../models/user');
const db = require('../../config/db');
const bcrypt = require('bcrypt');

// Mock database and bcrypt
jest.mock('../../config/db');
jest.mock('bcrypt');

describe('User Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {
            // Mock data
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                email: 'john@example.com',
                password: 'password123'
            };

            const mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                address: '123 Main St',
                email: 'john@example.com',
                password: 'hashedpassword'
            };

            // Mock bcrypt hash
            bcrypt.hash.mockResolvedValue('hashedpassword');

            // Mock database queries
            db.query.mockImplementation((query, params) => {
                if (query.includes('SELECT * FROM User_Info')) {
                    return { rows: [mockUser] };
                }
                return { rows: [] };
            });

            // Call the function
            const result = await userModel.createUser(userData);

            // Assertions
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
            expect(db.query).toHaveBeenCalledTimes(2);
            expect(result).toEqual(mockUser);
        });

        it('should handle database errors', async () => {
            // Mock data
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                email: 'john@example.com',
                password: 'password123'
            };

            // Mock bcrypt hash
            bcrypt.hash.mockResolvedValue('hashedpassword');

            // Mock database error
            db.query.mockRejectedValue(new Error('Database error'));

            // Call function and expect it to throw
            await expect(userModel.createUser(userData)).rejects.toThrow('Database error');
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            // Mock data
            const userId = 1;
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                email: 'john@example.com'
            };

            const mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                address: '123 Main St',
                email: 'john@example.com'
            };

            // Mock database queries
            db.query.mockImplementation((query, params) => {
                if (query.includes('fn_GetUserByID')) {
                    return { rows: [mockUser] };
                }
                return { rows: [] };
            });

            // Call the function
            const result = await userModel.updateUser(userId, userData);

            // Assertions
            expect(db.query).toHaveBeenCalledTimes(2);
            expect(result).toEqual(mockUser);
        });

        it('should handle database errors during update', async () => {
            // Mock data
            const userId = 1;
            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                address: '123 Main St',
                email: 'john@example.com'
            };

            // Mock database error
            db.query.mockRejectedValue(new Error('Database error'));

            // Call function and expect it to throw
            await expect(userModel.updateUser(userId, userData)).rejects.toThrow('Database error');
        });
    });

    describe('getUserById', () => {
        it('should get a user by ID successfully', async () => {
            // Mock data
            const userId = 1;
            const mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                address: '123 Main St',
                email: 'john@example.com'
            };

            // Mock database query
            db.query.mockResolvedValue({ rows: [mockUser] });

            // Call the function
            const result = await userModel.getUserById(userId);

            // Assertions
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetUserByID($1)', [userId]);
            expect(result).toEqual(mockUser);
        });

        it('should handle database errors when getting user by ID', async () => {
            // Mock data
            const userId = 1;

            // Mock database error
            db.query.mockRejectedValue(new Error('Database error'));

            // Call function and expect it to throw
            await expect(userModel.getUserById(userId)).rejects.toThrow('Database error');
        });
    });

    describe('getUserByCredentials', () => {
        it('should authenticate a user with valid credentials', async () => {
            // Mock data
            const email = 'john@example.com';
            const password = 'password123';
            const mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'hashedpassword'
            };

            const expectedReturnedUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com'
            };

            // Mock database query
            db.query.mockResolvedValue({ rows: [mockUser] });

            // Mock bcrypt compare
            bcrypt.compare.mockResolvedValue(true);

            // Call the function
            const result = await userModel.getUserByCredentials(email, password);

            // Assertions
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM User_Info WHERE Email = $1', [email]);
            expect(bcrypt.compare).toHaveBeenCalledWith(password, mockUser.password);
            expect(result).toEqual(expectedReturnedUser);
        });

        it('should return undefined with invalid email', async () => {
            const email = 'wrong@email.com';
            const password = 'password';
            db.query.mockResolvedValue({rows: []});

            // Call the function
            const result = await userModel.getUserByCredentials(email, password);

            // Assertions
            expect(result).toBeUndefined();

        })

        it('should return undefined with invalid credentials', async () => {
            // Mock data
            const email = 'john@example.com';
            const password = 'wrongpassword';
            const mockUser = {
                user_id: 1,
                first_name: 'John',
                last_name: 'Doe',
                email: 'john@example.com',
                password: 'hashedpassword'
            };

            // Mock database query
            db.query.mockResolvedValue({ rows: [mockUser] });

            // Mock bcrypt compare (password doesn't match)
            bcrypt.compare.mockResolvedValue(false);

            // Call the function
            const result = await userModel.getUserByCredentials(email, password);

            // Assertions
            expect(result).toBeUndefined();
        });

        it('should handle database errors during authentication', async () => {
            // Mock data
            const email = 'john@example.com';
            const password = 'password123';

            // Mock database error
            db.query.mockRejectedValue(new Error('Database error'));

            // Call function and expect it to throw
            await expect(userModel.getUserByCredentials(email, password)).rejects.toThrow('Database error');
        });
    });

    describe('getAllUsers', () => {
        it('should get all users successfully', async () => {
            // Mock data
            const mockUsers = [
                { user_id: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com' },
                { user_id: 2, first_name: 'Jane', last_name: 'Smith', email: 'jane@example.com' }
            ];

            // Mock database query
            db.query.mockResolvedValue({ rows: mockUsers });

            // Call the function
            const result = await userModel.getAllUsers();

            // Assertions
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetAllUsers()');
            expect(result).toEqual(mockUsers);
        });

        it('should handle database errors when getting all users', async () => {
            // Mock database error
            db.query.mockRejectedValue(new Error('Database error'));

            // Call function and expect it to throw
            await expect(userModel.getAllUsers()).rejects.toThrow('Database error');
        });
    });

    describe('getUserAuditHistory', () => {
        it('should get user audit history successfully', async () => {
            // Mock data
            const userId = 1;
            const mockHistory = [
                { audit_id: 1, user_id: 1, action: 'login', timestamp: '2023-01-01T00:00:00Z' },
                { audit_id: 2, user_id: 1, action: 'update profile', timestamp: '2023-01-02T00:00:00Z' }
            ];

            // Mock database query
            db.query.mockResolvedValue({ rows: mockHistory });

            // Call the function
            const result = await userModel.getUserAuditHistory(userId);

            // Assertions
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetUserAuditHistory($1)', [userId]);
            expect(result).toEqual(mockHistory);
        });

        it('should handle database errors when getting audit history', async () => {
            // Mock data
            const userId = 1;

            // Mock database error
            db.query.mockRejectedValue(new Error('Database error'));

            // Call function and expect it to throw
            await expect(userModel.getUserAuditHistory(userId)).rejects.toThrow('Database error');
        });
    });
});