const db = require('../config/db');

/**
 * Create a new order
 * @param {Object} orderData - Order data object
 * @param {Integer} orderData.UserID - User who made the order
 * @param {string} orderData.ShippingAddress - Address for delivery
 * @param {number} orderData.TotalPrice - Total price of order
 * @param {number} orderData.DeliveryCharge - Charge for delivery
 * @param {Integer} orderData.LastUpdatedUserID - The user who last edited order
 * @returns {Promise<Object>} - Created order object
 */
const createOrder = async (orderData) => {
    const {UserID, ShippingAddress, TotalPrice, DeliveryCharge, LastUpdatedUserID} = orderData;
    try {
        const sp_out = await db.query(
            'CALL sp_InsertOrder($1, $2, $3, $4, $5, NULL)',
            [UserID, ShippingAddress, TotalPrice, DeliveryCharge, LastUpdatedUserID]
        );
        //console.log(sp_out.rows[0].p_orderid);
        
        // PostgreSQL stored procedure with OUT parameter only returns that value
        // Aquiring the whole created row for return
        const result = await db.query(
            'SELECT * FROM Order_Info WHERE OrderID = $1', 
            [sp_out.rows[0].p_orderid]
        );
        
        //console.log(result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

/**
 * Update an existing order
 * @param {Integer} OrderId - ID of the order to update
 * @param {Object} orderData - Order data object
 * @param {Integer} orderData.UserID - User who made the order
 * @param {string} orderData.ShippingAddress - Address for delivery
 * @param {number} orderData.TotalPrice - Total price of order
 * @param {number} orderData.DeliveryCharge - Charge for delivery
 * @param {Integer} orderData.LastUpdatedUserID - The user who last edited order
 * @returns {Promise<Object>} - Updated order object
 */
const updateOrder = async (OrderId, orderData) => {
    const {UserID, ShippingAddress, TotalPrice, DeliveryCharge, LastUpdatedUserID} = orderData;
  
    try {
        await db.query(
            'CALL sp_UpdateOrder($1, $2, $3, $4, $5, $6)',
            [OrderId, UserID, ShippingAddress, TotalPrice, DeliveryCharge, LastUpdatedUserID]
        );
    
        const result = await db.query('SELECT * FROM Order_Info WHERE OrderID = $1', [OrderId]);
        //console.log(result.rows[0])
        return result.rows[0];
    } catch (error) {
        console.error('Error updating order:', error);
        throw error;
    }
};

/**
 * Create a new order detail
 * @param {Object} detailData - Detail data object
 * @param {Integer} detailData.OrderID - ID of the order the detail is related to
 * @param {Integer} detailData.ProductID - ID of the product included
 * @param {Integer} detailData.ProductQuantity - Amount of product ordered 
 * @param {number} detailData.TotalPrice - Combined price of all instances of this product
 * @param {Integer} detailData.LastUpdatedUserID - The user who last edited order detail
 * @returns {Promise<Object>} - Created order detail object
*/
const createOrderDetail = async (detailData) => {
    const {OrderID, ProductID, ProductQuantity, TotalPrice, LastUpdatedUserID} = detailData;
    try {
        const sp_out = await db.query(
            'CALL sp_InsertOrder_Detail($1, $2, $3, $4, $5, NULL)',
            [OrderID, ProductID, ProductQuantity, TotalPrice, LastUpdatedUserID]
        );
        //console.log(sp_out.rows[0].p_orderdetailid);
        
        // PostgreSQL stored procedure with OUT parameter only returns that value
        // Aquiring the whole created row for return
        const result = await db.query(
            'SELECT * FROM Order_Details WHERE OrderDetailID = $1',
            [sp_out.rows[0].p_orderdetailid]
        );
        //console.log(result.rows[0]);
        return result.rows[0];
    } catch (error) {
        console.error('Error creating order detail:', error);
        throw error;
    }
};

/**
 * Update an existing order detail
 * @param {Integer} OrderDetailId - ID of the order detail to update
 * @param {Object} detailData - Detail data object
 * @param {Integer} detailData.OrderID - ID of the order the detail is related to
 * @param {Integer} detailData.ProductID - ID of the product included
 * @param {Integer} detailData.ProductQuantity - Amount of product ordered 
 * @param {number} detailData.TotalPrice - Combined price of all instances of this product
 * @param {Integer} detailData.LastUpdatedUserID - The user who last edited order detail
 * @returns {Promise<Object>} - Updated order detail object
*/
const updateOrderDetail = async (OrderDetailId, detailData) => {
    const {OrderID, ProductID, ProductQuantity, TotalPrice, LastUpdatedUserID} = detailData;
  
    try {
        await db.query(
            'CALL sp_UpdateOrder_Detail($1, $2, $3, $4, $5, $6)',
            [OrderDetailId, OrderID, ProductID, ProductQuantity, TotalPrice, LastUpdatedUserID]
        );
    
        const result = await db.query('SELECT * FROM Order_Details WHERE OrderID = $1', [OrderDetailId]);
        //console.log(result.rows[0])
        return result.rows[0];
    } catch (error) {
        console.error('Error updating order detail:', error);
        throw error;
    }
};

// TMP smoke tests until unit tests are implemented
// "CALL sp_insertUser('Teemu', 'Teekkari', 'Yliopistonkatu 2', 'tt@email.com', 'password', NULL);"
//createOrder({UserID:1, ShippingAddress:'Postbox337', TotalPrice:69, DeliveryCharge:4, LastUpdatedUserID:1});
//updateOrder(1,{UserID:1, ShippingAddress:'Nowhere', TotalPrice:999, DeliveryCharge:4, LastUpdatedUserID:1});
//createOrderDetail({OrderID:2, ProductID:22, ProductQuantity:7, TotalPrice:21, LastUpdatedUserID:1});

module.exports = {
    createOrder,
    updateOrder,
    createOrderDetail,
    updateOrderDetail
};
