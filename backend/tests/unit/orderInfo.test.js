const orderInfoModel = require('../../models/orderInfo');
const db = require('../../config/db');


jest.mock('../../config/db');

describe('OrderInfo Model', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createOrder', () => {
        const mockOrderData = {
            UserID: 1,
            ShippingAddress: '123 Main St',
            TotalPrice: 150.50,
            DeliveryCharge: 10.00,
            LastUpdatedUserID: 1
        };

        test('should create an order successfully', async () => {

            const orderId = 5;
            db.query.mockResolvedValueOnce({
                rows: [{ p_orderid: orderId }]
            });


            const mockOrderResult = {
                orderid: orderId,
                userid: mockOrderData.UserID,
                shippingaddress: mockOrderData.ShippingAddress,
                totalprice: mockOrderData.TotalPrice,
                deliverycharge: mockOrderData.DeliveryCharge,
                lastupdateduserid: mockOrderData.LastUpdatedUserID,
                createdat: new Date(),
                updatedat: new Date()
            };

            db.query.mockResolvedValueOnce({
                rows: [mockOrderResult]
            });


            const result = await orderInfoModel.createOrder(mockOrderData);


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_InsertOrder($1, $2, $3, $4, $5, NULL)',
                [
                    mockOrderData.UserID,
                    mockOrderData.ShippingAddress,
                    mockOrderData.TotalPrice,
                    mockOrderData.DeliveryCharge,
                    mockOrderData.LastUpdatedUserID
                ]
            );

            expect(db.query).toHaveBeenCalledWith(
                'SELECT * FROM Order_Info WHERE OrderID = $1',
                [orderId]
            );


            expect(result).toEqual(mockOrderResult);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderInfoModel.createOrder(mockOrderData)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_InsertOrder($1, $2, $3, $4, $5, NULL)',
                [
                    mockOrderData.UserID,
                    mockOrderData.ShippingAddress,
                    mockOrderData.TotalPrice,
                    mockOrderData.DeliveryCharge,
                    mockOrderData.LastUpdatedUserID
                ]
            );
        });
    });

    describe('updateOrder', () => {
        const orderId = 5;
        const mockOrderData = {
            UserID: 1,
            ShippingAddress: '456 Elm St',
            TotalPrice: 200.75,
            DeliveryCharge: 15.00,
            LastUpdatedUserID: 2
        };

        test('should update an order successfully', async () => {

            db.query.mockResolvedValueOnce({});


            const mockUpdatedOrder = {
                orderid: orderId,
                userid: mockOrderData.UserID,
                shippingaddress: mockOrderData.ShippingAddress,
                totalprice: mockOrderData.TotalPrice,
                deliverycharge: mockOrderData.DeliveryCharge,
                lastupdateduserid: mockOrderData.LastUpdatedUserID,
                createdat: new Date(),
                updatedat: new Date()
            };

            db.query.mockResolvedValueOnce({
                rows: [mockUpdatedOrder]
            });


            const result = await orderInfoModel.updateOrder(orderId, mockOrderData);


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_UpdateOrder($1, $2, $3, $4, $5, $6)',
                [
                    orderId,
                    mockOrderData.UserID,
                    mockOrderData.ShippingAddress,
                    mockOrderData.TotalPrice,
                    mockOrderData.DeliveryCharge,
                    mockOrderData.LastUpdatedUserID
                ]
            );

            expect(db.query).toHaveBeenCalledWith(
                'SELECT * FROM Order_Info WHERE OrderID = $1',
                [orderId]
            );


            expect(result).toEqual(mockUpdatedOrder);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderInfoModel.updateOrder(orderId, mockOrderData)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_UpdateOrder($1, $2, $3, $4, $5, $6)',
                [
                    orderId,
                    mockOrderData.UserID,
                    mockOrderData.ShippingAddress,
                    mockOrderData.TotalPrice,
                    mockOrderData.DeliveryCharge,
                    mockOrderData.LastUpdatedUserID
                ]
            );
        });
    });

    describe('createOrderDetail', () => {
        const mockDetailData = {
            OrderID: 5,
            ProductID: 10,
            ProductQuantity: 3,
            TotalPrice: 45.00,
            LastUpdatedUserID: 1
        };

        test('should create an order detail successfully', async () => {

            const orderDetailId = 15;
            db.query.mockResolvedValueOnce({
                rows: [{ p_orderdetailid: orderDetailId }]
            });


            const mockDetailResult = {
                orderdetailid: orderDetailId,
                orderid: mockDetailData.OrderID,
                productid: mockDetailData.ProductID,
                productquantity: mockDetailData.ProductQuantity,
                totalprice: mockDetailData.TotalPrice,
                lastupdateduserid: mockDetailData.LastUpdatedUserID,
                createdat: new Date(),
                updatedat: new Date()
            };

            db.query.mockResolvedValueOnce({
                rows: [mockDetailResult]
            });


            const result = await orderInfoModel.createOrderDetail(mockDetailData);


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_InsertOrder_Detail($1, $2, $3, $4, $5, NULL)',
                [
                    mockDetailData.OrderID,
                    mockDetailData.ProductID,
                    mockDetailData.ProductQuantity,
                    mockDetailData.TotalPrice,
                    mockDetailData.LastUpdatedUserID
                ]
            );

            expect(db.query).toHaveBeenCalledWith(
                'SELECT * FROM Order_Details WHERE OrderDetailID = $1',
                [orderDetailId]
            );


            expect(result).toEqual(mockDetailResult);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderInfoModel.createOrderDetail(mockDetailData)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_InsertOrder_Detail($1, $2, $3, $4, $5, NULL)',
                [
                    mockDetailData.OrderID,
                    mockDetailData.ProductID,
                    mockDetailData.ProductQuantity,
                    mockDetailData.TotalPrice,
                    mockDetailData.LastUpdatedUserID
                ]
            );
        });
    });

    describe('updateOrderDetail', () => {
        const orderDetailId = 15;
        const mockDetailData = {
            OrderID: 5,
            ProductID: 10,
            ProductQuantity: 5,
            TotalPrice: 75.00,
            LastUpdatedUserID: 2
        };

        test('should update an order detail successfully', async () => {

            db.query.mockResolvedValueOnce({});


            const mockUpdatedDetail = {
                orderdetailid: orderDetailId,
                orderid: mockDetailData.OrderID,
                productid: mockDetailData.ProductID,
                productquantity: mockDetailData.ProductQuantity,
                totalprice: mockDetailData.TotalPrice,
                lastupdateduserid: mockDetailData.LastUpdatedUserID,
                createdat: new Date(),
                updatedat: new Date()
            };

            db.query.mockResolvedValueOnce({
                rows: [mockUpdatedDetail]
            });


            const result = await orderInfoModel.updateOrderDetail(orderDetailId, mockDetailData);


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_UpdateOrder_Detail($1, $2, $3, $4, $5, $6)',
                [
                    orderDetailId,
                    mockDetailData.OrderID,
                    mockDetailData.ProductID,
                    mockDetailData.ProductQuantity,
                    mockDetailData.TotalPrice,
                    mockDetailData.LastUpdatedUserID
                ]
            );

            expect(db.query).toHaveBeenCalledWith(
                'SELECT * FROM Order_Details WHERE OrderID = $1',
                [orderDetailId]
            );


            expect(result).toEqual(mockUpdatedDetail);
        });

        test('should throw an error if database query fails', async () => {

            const error = new Error('Database error');
            db.query.mockRejectedValue(error);


            await expect(orderInfoModel.updateOrderDetail(orderDetailId, mockDetailData)).rejects.toThrow('Database error');


            expect(db.query).toHaveBeenCalledWith(
                'CALL sp_UpdateOrder_Detail($1, $2, $3, $4, $5, $6)',
                [
                    orderDetailId,
                    mockDetailData.OrderID,
                    mockDetailData.ProductID,
                    mockDetailData.ProductQuantity,
                    mockDetailData.TotalPrice,
                    mockDetailData.LastUpdatedUserID
                ]
            );
        });
    });
});