const {
    createOrder,
    updateOrder,
    getOrderById,
    getAllOrders,
    getOrdersByUserId,
    getActiveOrdersByUserId,
    getActiveOrdersWithRouteInfo,
    getOrderAuditHistory
} = require('../../controllers/orderController');
const orderModel = require('../../models/order');
const saveRouteModel = require('../../models/saveRouteModel');


jest.mock('../../models/order');
jest.mock('../../models/saveRouteModel');

describe('Order Controller', () => {
    let req;
    let res;


    beforeEach(() => {

        jest.clearAllMocks();


        req = {
            body: {
                userId: 1,
                shippingAddress: '123 Test St',
                totalAmount: 100,
                deliveryCharge: 10,
                orderStatus: 'pending',
                isSustainableOption: true,
                orderItems: [
                    { productId: 1, quantity: 2, price: 50 }
                ]
            },
            params: {
                id: 1,
                userId: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

    });

    describe('createOrder', () => {
        test('should create an order and return 201 status', async () => {

            const mockOrder = { id: 1, ...req.body };
            orderModel.createOrder.mockResolvedValue(mockOrder);


            await createOrder(req, res);


            expect(orderModel.createOrder).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockOrder
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to create order');
            orderModel.createOrder.mockRejectedValue(error);


            await createOrder(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('updateOrder', () => {
        test('should update an order and return 200 status', async () => {

            const mockOrder = { id: 1, ...req.body };
            orderModel.updateOrder.mockResolvedValue(mockOrder);


            await updateOrder(req, res);


            expect(orderModel.updateOrder).toHaveBeenCalledWith(req.params.id, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockOrder
            });
        });

        test('should handle not found and return 404 status', async () => {

            orderModel.updateOrder.mockResolvedValue(null);


            await updateOrder(req, res);


            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Order not found'
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to update order');
            orderModel.updateOrder.mockRejectedValue(error);


            await updateOrder(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getOrderById', () => {
        test('should get an order by id and return 200 status', async () => {

            const mockOrder = { id: 1, userId: 1, totalAmount: 100 };
            orderModel.getOrderById.mockResolvedValue(mockOrder);


            await getOrderById(req, res);


            expect(orderModel.getOrderById).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockOrder
            });
        });

        test('should handle not found and return 404 status', async () => {

            orderModel.getOrderById.mockResolvedValue(null);


            await getOrderById(req, res);


            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Order not found'
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get order');
            orderModel.getOrderById.mockRejectedValue(error);


            await getOrderById(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getAllOrders', () => {
        test('should get all orders and return 200 status', async () => {

            const mockOrders = [
                { id: 1, userId: 1, totalAmount: 100 },
                { id: 2, userId: 2, totalAmount: 200 }
            ];
            orderModel.getAllOrders.mockResolvedValue(mockOrders);


            await getAllOrders(req, res);


            expect(orderModel.getAllOrders).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: mockOrders.length,
                data: mockOrders
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get orders');
            orderModel.getAllOrders.mockRejectedValue(error);


            await getAllOrders(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getOrdersByUserId', () => {
        test('should get orders by user id and return 200 status', async () => {

            const mockOrders = [
                { id: 1, userId: 1, totalAmount: 100 },
                { id: 3, userId: 1, totalAmount: 300 }
            ];
            orderModel.getOrdersByUserId.mockResolvedValue(mockOrders);


            await getOrdersByUserId(req, res);


            expect(orderModel.getOrdersByUserId).toHaveBeenCalledWith(req.params.userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: mockOrders.length,
                data: mockOrders
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get orders by user id');
            orderModel.getOrdersByUserId.mockRejectedValue(error);


            await getOrdersByUserId(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getActiveOrdersByUserId', () => {
        test('should get active orders by user id and return 200 status', async () => {

            const mockOrders = [
                { id: 1, userId: 1, totalAmount: 100, orderStatus: 'pending' }
            ];
            orderModel.getActiveOrdersByUserId.mockResolvedValue(mockOrders);


            await getActiveOrdersByUserId(req, res);


            expect(orderModel.getActiveOrdersByUserId).toHaveBeenCalledWith(req.params.userId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: mockOrders.length,
                data: mockOrders
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get active orders by user id');
            orderModel.getActiveOrdersByUserId.mockRejectedValue(error);


            await getActiveOrdersByUserId(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getActiveOrdersWithRouteInfo', () => {
        test('should get active orders and the routes for them by user id and return 200 status', async () => {

            const mockOrders = [
                { orderId: 1, userId: 1, totalAmount: 100, orderStatus: 'pending' }
            ];
            orderModel.getActiveOrdersByUserId.mockResolvedValue(mockOrders);

            const mockRoutes = [
                { orderId: 1, routeId: 1, source: "source", destination: "destination", carbonEmission: 123, duration: 1, routeNumber: 1,
                  distance: 12, totalCost: 123, lastUpdateduserId: 1 
                }
            ];
            saveRouteModel.getRouteByOrderId.mockResolvedValue(mockRoutes);

            const mockData = [{
                ...mockOrders[0],
                routeInfo: mockRoutes
            }];

            await getActiveOrdersWithRouteInfo(req, res);

            expect(orderModel.getActiveOrdersByUserId).toHaveBeenCalledWith(req.params.userId);
            expect(saveRouteModel.getRouteByOrderId).toHaveBeenCalledWith(req.params.orderId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Active orders with route info fetched successfully",
                data: mockData
            });

        })

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get active orders by user id');
            orderModel.getActiveOrdersByUserId.mockRejectedValue(error);


            await getActiveOrdersWithRouteInfo(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: "Error fetching active orders with route info",
                error: error.message
            });
        });
    })

    describe('getOrderAuditHistory', () => {
        test('should get order audit history and return 200 status', async () => {

            const mockHistory = [
                { id: 1, orderId: 1, status: 'created', timestamp: new Date() },
                { id: 2, orderId: 1, status: 'updated', timestamp: new Date() }
            ];
            orderModel.getOrderAuditHistory.mockResolvedValue(mockHistory);


            await getOrderAuditHistory(req, res);


            expect(orderModel.getOrderAuditHistory).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: mockHistory.length,
                data: mockHistory
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get order audit history');
            orderModel.getOrderAuditHistory.mockRejectedValue(error);


            await getOrderAuditHistory(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });
});