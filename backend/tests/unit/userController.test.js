const userController = require('../../controllers/userController');
const userModel = require('../../models/user');


jest.mock('../../models/user');

describe('User Controller', () => {
    let req, res;


    beforeEach(() => {
        req = {
            body: {},
            params: {},
            query: {}
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('should create a new user successfully', async () => {

            const userData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com',
                address: '123 Main St',
                password: 'password123'
            };
            const mockUser = { id: 1, ...userData, password: undefined };


            req.body = userData;


            userModel.createUser.mockResolvedValue(mockUser);


            await userController.createUser(req, res);


            expect(userModel.createUser).toHaveBeenCalledWith(userData);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser
            });
        });

        it('should handle errors when creating a user', async () => {
            const error = new Error('Database error');

            req.body = {
                firstName: 'John',
                lastName: 'Doe'
            };

            userModel.createUser.mockRejectedValue(error);

            await userController.createUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('updateUser', () => {
        it('should update a user successfully', async () => {
            const userId = '1';
            const updateData = {
                firstName: 'Jane',
                lastName: 'Doe',
                email: 'jane@example.com',
                address: '456 Oak St'
            };
            const mockUser = { id: 1, ...updateData };

            req.params.id = userId;
            req.body = updateData;

            userModel.updateUser.mockResolvedValue(mockUser);

            await userController.updateUser(req, res);

            expect(userModel.updateUser).toHaveBeenCalledWith(userId, updateData);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser
            });
        });

        it('should handle case when user is not found', async () => {
            const userId = '999';

            req.params.id = userId;
            req.body = { firstName: 'Jane' };

            userModel.updateUser.mockResolvedValue(null);

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'User not found'
            });
        });

        it('should handle errors when updating a user', async () => {
            const error = new Error('Database error');

            req.params.id = '1';
            req.body = { firstName: 'Jane' };

            userModel.updateUser.mockRejectedValue(error);

            await userController.updateUser(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getUserById', () => {
        it('should get a user by ID successfully', async () => {
            const userId = '1';
            const mockUser = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            req.params.id = userId;

            userModel.getUserById.mockResolvedValue(mockUser);

            await userController.getUserById(req, res);

            expect(userModel.getUserById).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser
            });
        });

        it('should handle case when user is not found', async () => {
            const userId = '999';

            req.params.id = userId;

            userModel.getUserById.mockResolvedValue(null);

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'User not found'
            });
        });

        it('should handle errors when getting a user', async () => {
            const error = new Error('Database error');

            req.params.id = '1';

            userModel.getUserById.mockRejectedValue(error);

            await userController.getUserById(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getUserByCredentials', () => {
        it('should get a user by credentials successfully', async () => {
            const mockUser = {
                id: 1,
                firstName: 'John',
                lastName: 'Doe',
                email: 'john@example.com'
            };

            req.query = {
                email: 'john@example.com',
                password: 'password123'
            };

            userModel.getUserByCredentials.mockResolvedValue(mockUser);

            await userController.getUserByCredentials(req, res);

            expect(userModel.getUserByCredentials).toHaveBeenCalledWith(
                req.query.email,
                req.query.password
            );
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockUser
            });
        });

        it('should handle case when credentials are invalid', async () => {
            req.query = {
                email: 'john@example.com',
                password: 'wrongpassword'
            };

            userModel.getUserByCredentials.mockResolvedValue(null);

            await userController.getUserByCredentials(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'User not found'
            });
        });

        it('should handle errors when validating credentials', async () => {
            const error = new Error('Authentication error');

            req.query = {
                email: 'john@example.com',
                password: 'password123'
            };

            userModel.getUserByCredentials.mockRejectedValue(error);

            await userController.getUserByCredentials(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getAllUsers', () => {
        it('should get all users successfully', async () => {
            const mockUsers = [
                { id: 1, firstName: 'John', lastName: 'Doe' },
                { id: 2, firstName: 'Jane', lastName: 'Smith' }
            ];

            userModel.getAllUsers.mockResolvedValue(mockUsers);

            await userController.getAllUsers(req, res);

            expect(userModel.getAllUsers).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: mockUsers.length,
                data: mockUsers
            });
        });

        it('should handle errors when getting all users', async () => {
            const error = new Error('Database error');

            userModel.getAllUsers.mockRejectedValue(error);

            await userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getUserAuditHistory', () => {
        it('should get user audit history successfully', async () => {
            const userId = '1';
            const mockHistory = [
                { id: 1, userId: 1, action: 'login', timestamp: new Date() },
                { id: 2, userId: 1, action: 'update profile', timestamp: new Date() }
            ];

            req.params.id = userId;

            userModel.getUserAuditHistory.mockResolvedValue(mockHistory);

            await userController.getUserAuditHistory(req, res);

            expect(userModel.getUserAuditHistory).toHaveBeenCalledWith(userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: mockHistory.length,
                data: mockHistory
            });
        });

        it('should handle errors when getting audit history', async () => {
            const error = new Error('Database error');

            req.params.id = '1';

            userModel.getUserAuditHistory.mockRejectedValue(error);

            await userController.getUserAuditHistory(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });
});