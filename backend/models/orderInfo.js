const db = require('../config/db');

const createOrder = async (orderData) => {
    const {UserID, ShippingAddress, TotalPrice, DeliveryCharge, LastUpdatedUserID} = orderData;
    try {
        const result = await db.query(
            'CALL sp_InsertOrder($1, $2, $3, $4, $5, NULL)',
            [UserID, ShippingAddress, TotalPrice, DeliveryCharge, LastUpdatedUserID]
        );
        
        //console.log(result.rows[0].p_orderid);
        // PostgreSQL stored procedure with OUT parameter only returns that value
        // Aquiring the whole created row for return
        const orderResult = await db.query(
            'SELECT * FROM Order_Info WHERE OrderID = $1', 
            [result.rows[0].p_orderid]
        );
        
        //console.log(orderResult.rows[0]);
        return orderResult.rows[0];
    } catch (error) {
        console.error('Error creating order:', error);
        throw error;
    }
};

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

// TMP test bit
//createOrder({UserID:1, ShippingAddress:'Postbox337', TotalPrice:69, DeliveryCharge:4, LastUpdatedUserID:1});
//updateOrder(1,{UserID:1, ShippingAddress:'Nice', TotalPrice:999, DeliveryCharge:4, LastUpdatedUserID:1});

module.exports = {
    createOrder,
    updateOrder
    
};
