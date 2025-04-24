const orderDetailModel = require('../../models/orderDetail');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('Order Detail Model', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrderDetail', () => {
        const mockOrderDetailData = {
            orderId: 1,
            productId: 2,
            quantity: 3,
            price: 19.99
        };

        test('should create an order detail successfully', async () => {

            db.query.mockResolvedValueOnce({});

            const mockOrderDetails = [
                {
                    orderdetailid: 1,
                    orderid: mockOrderDetailData.orderId,
                    productid: mockOrderDetailData.productId,
                    quantity: mockOrderDetailData.quantity,
                    price: mockOrderDetailData.price
                }
            ];


            db.query.mockResolvedValueOnce({
                rows: mockOrderDetails
            });


            const result = await orderDetailModel.createOrderDetail(mockOrderDetailData);


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_InsertOrderDetail($1, $2, $3, $4, NULL)',
                [mockOrderDetailData.orderId, mockOrderDetailData.productId, mockOrderDetailData.quantity, mockOrderDetailData.price]
            );


            expect(result).toEqual(mockOrderDetails);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValueOnce(error);


            await expect(orderDetailModel.createOrderDetail(mockOrderDetailData)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_InsertOrderDetail($1, $2, $3, $4, NULL)',
                [mockOrderDetailData.orderId, mockOrderDetailData.productId, mockOrderDetailData.quantity, mockOrderDetailData.price]
            );
        });
    });

    describe('updateOrderDetail', () => {
        const orderDetailId = 1;
        const mockOrderDetailData = {
            quantity: 5,
            price: 24.99
        };

        test('should update an order detail successfully', async () => {

            db.query.mockResolvedValueOnce({});

            const mockUpdatedOrderDetail = {
                orderdetailid: orderDetailId,
                orderid: 1,
                productid: 2,
                quantity: mockOrderDetailData.quantity,
                price: mockOrderDetailData.price
            };

            db.query.mockResolvedValueOnce({
                rows: [mockUpdatedOrderDetail]
            });


            const result = await orderDetailModel.updateOrderDetail(orderDetailId, mockOrderDetailData);


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_UpdateOrderDetail($1, $2, $3)',
                [orderDetailId, mockOrderDetailData.quantity, mockOrderDetailData.price]
            );

            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailByID($1)', [orderDetailId]);


            expect(result).toEqual(mockUpdatedOrderDetail);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValueOnce(error);


            await expect(orderDetailModel.updateOrderDetail(orderDetailId, mockOrderDetailData)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_UpdateOrderDetail($1, $2, $3)',
                [orderDetailId, mockOrderDetailData.quantity, mockOrderDetailData.price]
            );
        });
    });

    describe('getOrderDetailsByOrderID', () => {
        const orderId = 1;

        test('should get order details by order ID successfully', async () => {
            const mockOrderDetails = [
                { orderdetailid: 1, orderid: orderId, productid: 1, quantity: 2, price: 19.99 },
                { orderdetailid: 2, orderid: orderId, productid: 3, quantity: 1, price: 29.99 }
            ];

            db.query.mockResolvedValueOnce({
                rows: mockOrderDetails
            });


            const result = await orderDetailModel.getOrderDetailsByOrderID(orderId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailsByOrderID($1)', [orderId]);


            expect(result).toEqual(mockOrderDetails);
        });

        test('should return empty array if no order details are found', async () => {
            db.query.mockResolvedValueOnce({
                rows: []
            });


            const result = await orderDetailModel.getOrderDetailsByOrderID(orderId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailsByOrderID($1)', [orderId]);


            expect(result).toEqual([]);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValueOnce(error);


            await expect(orderDetailModel.getOrderDetailsByOrderID(orderId)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailsByOrderID($1)', [orderId]);
        });
    });

    describe('getOrderDetailByID', () => {
        const orderDetailId = 1;

        test('should get order detail by ID successfully', async () => {
            const mockOrderDetail = {
                orderdetailid: 1,
                orderid: 1,
                productid: 1,
                quantity: 2,
                price: 19.99
            };

            db.query.mockResolvedValueOnce({
                rows: [mockOrderDetail]
            });


            const result = await orderDetailModel.getOrderDetailByID(orderDetailId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailByID($1)', [orderDetailId]);


            expect(result).toEqual(mockOrderDetail);
        });

        test('should return undefined if no order detail is found', async () => {
            db.query.mockResolvedValueOnce({
                rows: []
            });


            const result = await orderDetailModel.getOrderDetailByID(orderDetailId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailByID($1)', [orderDetailId]);


            expect(result).toBeUndefined();
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValueOnce(error);


            await expect(orderDetailModel.getOrderDetailByID(orderDetailId)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailByID($1)', [orderDetailId]);
        });
    });

    describe('getOrderDetailAuditHistory', () => {
        const orderDetailId = 1;

        test('should get order detail audit history successfully', async () => {
            const timestamp = new Date();
            const mockAuditHistory = [
                { id: 1, orderdetailid: orderDetailId, action: 'CREATE', timestamp },
                { id: 2, orderdetailid: orderDetailId, action: 'UPDATE', timestamp }
            ];

            db.query.mockResolvedValueOnce({
                rows: mockAuditHistory
            });


            const result = await orderDetailModel.getOrderDetailAuditHistory(orderDetailId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailAuditHistory($1)', [orderDetailId]);


            expect(result).toEqual(mockAuditHistory);
        });

        test('should return empty array if no audit history is found', async () => {
            db.query.mockResolvedValueOnce({
                rows: []
            });


            const result = await orderDetailModel.getOrderDetailAuditHistory(orderDetailId);


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailAuditHistory($1)', [orderDetailId]);


            expect(result).toEqual([]);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValueOnce(error);


            await expect(orderDetailModel.getOrderDetailAuditHistory(orderDetailId)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetOrderDetailAuditHistory($1)', [orderDetailId]);
        });
    });
});