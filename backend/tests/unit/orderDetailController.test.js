const {
    createOrderDetail,
    updateOrderDetail,
    getOrderDetailById,
    getOrderDetailsByOrderId,
    getOrderDetailAuditHistory
} = require('../../controllers/orderDetailController');
const orderDetailModel = require('../../models/orderDetail');


jest.mock('../../models/orderDetail');

describe('Order Detail Controller', () => {
    let req;
    let res;

    beforeEach(() => {

        jest.clearAllMocks();


        req = {
            body: {
                orderId: 1,
                productId: 2,
                quantity: 3,
                price: 29.99
            },
            params: {
                id: 1,
                orderId: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('createOrderDetail', () => {
        test('should create an order detail and return 201 status', async () => {

            const mockOrderDetail = { id: 1, ...req.body };
            orderDetailModel.createOrderDetail.mockResolvedValue(mockOrderDetail);


            await createOrderDetail(req, res);


            expect(orderDetailModel.createOrderDetail).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockOrderDetail
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to create order detail');
            orderDetailModel.createOrderDetail.mockRejectedValue(error);


            await createOrderDetail(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('updateOrderDetail', () => {
        test('should update an order detail and return 200 status', async () => {

            const mockOrderDetail = { id: 1, ...req.body, quantity: 5 };
            orderDetailModel.updateOrderDetail.mockResolvedValue(mockOrderDetail);


            await updateOrderDetail(req, res);


            expect(orderDetailModel.updateOrderDetail).toHaveBeenCalledWith(req.params.id, req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockOrderDetail
            });
        });

        test('should handle not found and return 404 status', async () => {

            orderDetailModel.updateOrderDetail.mockResolvedValue(null);


            await updateOrderDetail(req, res);


            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Order detail not found'
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to update order detail');
            orderDetailModel.updateOrderDetail.mockRejectedValue(error);


            await updateOrderDetail(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getOrderDetailById', () => {
        test('should get an order detail by id and return 200 status', async () => {

            const mockOrderDetail = { id: 1, orderId: 1, productId: 2, quantity: 3, price: 29.99 };
            orderDetailModel.getOrderDetailByID.mockResolvedValue(mockOrderDetail);


            await getOrderDetailById(req, res);


            expect(orderDetailModel.getOrderDetailByID).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockOrderDetail
            });
        });

        test('should handle not found and return 404 status', async () => {

            orderDetailModel.getOrderDetailByID.mockResolvedValue(null);


            await getOrderDetailById(req, res);


            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: 'Order detail not found'
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get order detail');
            orderDetailModel.getOrderDetailByID.mockRejectedValue(error);


            await getOrderDetailById(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getOrderDetailsByOrderId', () => {
        test('should get order details by order id and return 200 status', async () => {

            const mockOrderDetails = [
                { id: 1, orderId: 1, productId: 2, quantity: 3, price: 29.99 },
                { id: 2, orderId: 1, productId: 3, quantity: 1, price: 19.99 }
            ];
            orderDetailModel.getOrderDetailsByOrderID.mockResolvedValue(mockOrderDetails);


            await getOrderDetailsByOrderId(req, res);


            expect(orderDetailModel.getOrderDetailsByOrderID).toHaveBeenCalledWith(req.params.orderId);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: mockOrderDetails.length,
                data: mockOrderDetails
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get order details');
            orderDetailModel.getOrderDetailsByOrderID.mockRejectedValue(error);


            await getOrderDetailsByOrderId(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });

    describe('getOrderDetailAuditHistory', () => {
        test('should get order detail audit history and return 200 status', async () => {

            const mockHistory = [
                { id: 1, orderDetailId: 1, field: 'quantity', oldValue: '2', newValue: '3', timestamp: new Date() },
                { id: 2, orderDetailId: 1, field: 'price', oldValue: '24.99', newValue: '29.99', timestamp: new Date() }
            ];
            orderDetailModel.getOrderDetailAuditHistory.mockResolvedValue(mockHistory);


            await getOrderDetailAuditHistory(req, res);


            expect(orderDetailModel.getOrderDetailAuditHistory).toHaveBeenCalledWith(req.params.id);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                count: mockHistory.length,
                data: mockHistory
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get order detail audit history');
            orderDetailModel.getOrderDetailAuditHistory.mockRejectedValue(error);


            await getOrderDetailAuditHistory(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });
        });
    });
});