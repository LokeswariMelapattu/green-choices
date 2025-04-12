const orderModel = require('../../models/order');
const orderDetailModel = require('../../models/orderDetail');
const db = require('../../config/db');


jest.mock('../../config/db');
jest.mock('../../models/orderDetail');

describe('Order Model', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        const mockOrderData = {
            userId: 1,
            shippingAddress: '123 Main St',
            totalAmount: 100.50,
            deliveryCharge: 10.00,
            orderStatus: 'pending',
            isSustainableOption: true,
            orderItems: [
                { productId: 1, quantity: 2, price: 25.00 },
                { productId: 2, quantity: 1, price: 50.50 }
            ]
        };

        test('should create an order successfully', async () => {

            const orderId = 1;
            db.query.mockResolvedValueOnce({
                rows: [{ p_orderid: orderId }]
            });

            const mockOrderResult = {
                orderid: orderId,
                userid: mockOrderData.userId,
                totalamount: mockOrderData.totalAmount
            };


            db.query.mockResolvedValueOnce({
                rows: [mockOrderResult]
            });


            orderDetailModel.createOrderDetail.mockResolvedValue({});


            const result = await orderModel.createOrder(mockOrderData);


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_InsertOrder($1, $2, $3, $4, $5, $6, NULL)',
                [
                    mockOrderData.userId,
                    mockOrderData.shippingAddress,
                    mockOrderData.totalAmount,
                    mockOrderData.deliveryCharge,
                    mockOrderData.orderStatus,
                    mockOrderData.isSustainableOption
                ]
            );

            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderByID($1)', [orderId]);

            expect(orderDetailModel.createOrderDetail).toHaveBeenCalledTimes(2);
            expect(orderDetailModel.createOrderDetail).toHaveBeenCalledWith({
                orderId,
                productId: mockOrderData.orderItems[0].productId,
                quantity: mockOrderData.orderItems[0].quantity,
                price: mockOrderData.orderItems[0].price
            });

            expect(result).toEqual(mockOrderResult);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderModel.createOrder(mockOrderData)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_InsertOrder($1, $2, $3, $4, $5, $6, NULL)',
                [
                    mockOrderData.userId,
                    mockOrderData.shippingAddress,
                    mockOrderData.totalAmount,
                    mockOrderData.deliveryCharge,
                    mockOrderData.orderStatus,
                    mockOrderData.isSustainableOption
                ]
            );
        });
    });

    describe('updateOrder', () => {
        const orderId = 1;
        const mockOrderData = {
            shippingAddress: '456 Elm St',
            totalAmount: 120.75,
            deliveryCharge: 15.00,
            orderStatus: 'shipped',
            isSustainableOption: false
        };

        test('should update an order successfully', async () => {

            db.query.mockResolvedValueOnce({});

            const mockUpdatedOrder = {
                orderid: orderId,
                shippingaddress: mockOrderData.shippingAddress,
                totalamount: mockOrderData.totalAmount,
                deliverycharge: mockOrderData.deliveryCharge,
                orderstatus: mockOrderData.orderStatus,
                issustainableoption: mockOrderData.isSustainableOption
            };

            db.query.mockResolvedValueOnce({
                rows: [mockUpdatedOrder]
            });


            const result = await orderModel.updateOrder(orderId, mockOrderData);


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_UpdateOrder($1, $2, $3, $4, $5, $6)',
                [
                    orderId,
                    mockOrderData.shippingAddress,
                    mockOrderData.totalAmount,
                    mockOrderData.deliveryCharge,
                    mockOrderData.orderStatus,
                    mockOrderData.isSustainableOption
                ]
            );

            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderByID($1)', [orderId]);
            expect(result).toEqual(mockUpdatedOrder);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderModel.updateOrder(orderId, mockOrderData)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_UpdateOrder($1, $2, $3, $4, $5, $6)',
                [
                    orderId,
                    mockOrderData.shippingAddress,
                    mockOrderData.totalAmount,
                    mockOrderData.deliveryCharge,
                    mockOrderData.orderStatus,
                    mockOrderData.isSustainableOption
                ]
            );
        });
    });

    describe('getOrderById', () => {
        const orderId = 1;

        test('should get an order by ID successfully', async () => {
            const mockOrder = {
                orderid: orderId,
                userid: 1,
                totalamount: 100.50
            };

            db.query.mockResolvedValueOnce({
                rows: [mockOrder]
            });


            const result = await orderModel.getOrderById(orderId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderByID($1)', [orderId]);
            expect(result).toEqual(mockOrder);
        });

        test('should return undefined if no order is found', async () => {
            db.query.mockResolvedValueOnce({
                rows: []
            });


            const result = await orderModel.getOrderById(orderId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderByID($1)', [orderId]);
            expect(result).toBeUndefined();
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderModel.getOrderById(orderId)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderByID($1)', [orderId]);
        });
    });

    describe('getAllOrders', () => {
        test('should get all orders successfully', async () => {
            const mockOrders = [
                { orderid: 1, userid: 1, totalamount: 100.50 },
                { orderid: 2, userid: 2, totalamount: 200.75 }
            ];

            db.query.mockResolvedValueOnce({
                rows: mockOrders
            });


            const result = await orderModel.getAllOrders();

            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetAllOrders()');
            expect(result).toEqual(mockOrders);
        });

        test('should return empty array if no orders are found', async () => {
            db.query.mockResolvedValueOnce({
                rows: []
            });


            const result = await orderModel.getAllOrders();


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetAllOrders()');
            expect(result).toEqual([]);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderModel.getAllOrders()).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetAllOrders()');
        });
    });

    describe('getOrdersByUserId', () => {
        const userId = 1;

        test('should get orders by user ID successfully', async () => {
            const mockOrders = [
                { orderid: 1, userid: userId, totalamount: 100.50 },
                { orderid: 3, userid: userId, totalamount: 150.25 }
            ];

            db.query.mockResolvedValueOnce({
                rows: mockOrders
            });


            const result = await orderModel.getOrdersByUserId(userId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrdersByUserID($1)', [userId]);
            expect(result).toEqual(mockOrders);
        });

        test('should return empty array if no orders are found for user', async () => {
            db.query.mockResolvedValueOnce({
                rows: []
            });


            const result = await orderModel.getOrdersByUserId(userId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrdersByUserID($1)', [userId]);
            expect(result).toEqual([]);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderModel.getOrdersByUserId(userId)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrdersByUserID($1)', [userId]);
        });
    });

    describe('getActiveOrdersByUserId', () => {
        const userId = 1;

        test('should get active orders by user ID successfully', async () => {
            const mockOrders = [
                { orderid: 1, userid: userId, totalamount: 100.50, orderstatus: 'pending' },
                { orderid: 3, userid: userId, totalamount: 150.25, orderstatus: 'processing' }
            ];

            db.query.mockResolvedValueOnce({
                rows: mockOrders
            });


            const result = await orderModel.getActiveOrdersByUserId(userId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetActiveOrdersByUserID($1)', [userId]);
            expect(result).toEqual(mockOrders);
        });

        test('should return empty array if no active orders are found for user', async () => {
            db.query.mockResolvedValueOnce({
                rows: []
            });


            const result = await orderModel.getActiveOrdersByUserId(userId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetActiveOrdersByUserID($1)', [userId]);
            expect(result).toEqual([]);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderModel.getActiveOrdersByUserId(userId)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetActiveOrdersByUserID($1)', [userId]);
        });
    });

    describe('getOrderAuditHistory', () => {
        const orderId = 1;

        test('should get order audit history successfully', async () => {
            const mockAuditHistory = [
                { id: 1, orderid: orderId, action: 'CREATE', timestamp: new Date() },
                { id: 2, orderid: orderId, action: 'UPDATE', timestamp: new Date() }
            ];

            db.query.mockResolvedValueOnce({
                rows: mockAuditHistory
            });


            const result = await orderModel.getOrderAuditHistory(orderId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderAuditHistory($1)', [orderId]);
            expect(result).toEqual(mockAuditHistory);
        });

        test('should return empty array if no audit history is found', async () => {
            db.query.mockResolvedValueOnce({
                rows: []
            });


            const result = await orderModel.getOrderAuditHistory(orderId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderAuditHistory($1)', [orderId]);
            expect(result).toEqual([]);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderModel.getOrderAuditHistory(orderId)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderAuditHistory($1)', [orderId]);
        });
    });
});