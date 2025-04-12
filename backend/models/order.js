const db = require('../config/db');
const orderDetailModel = require('./orderDetail');
const saveRouteModel = require('./saveRouteModel');

/**
 * Create a new order
 * @param {Object} orderData - Order data object
 * @param {number} orderData.userId - User ID
 * @param {string} orderData.shippingAddress - Shipping address
 * @param {number} orderData.totalAmount - Total amount
 * @param {number} orderData.deliveryCharge - Delivery charge
 * @param {string} orderData.orderStatus - Order orderStatus
 * @param {Array} orderData.orderItems - Array of order items with product details
 * @returns {Promise<Object>} - Created order object
 */
const createOrder = async (orderData) => {
  const { userId, shippingAddress, totalAmount, deliveryCharge, orderStatus, isSustainableOption, orderItems, routeInfo } = orderData;
  //const client = await db.pool.connect();
  try {
    //await client.query('BEGIN'); // Start a transaction

    const result = await db.query(
      'CALL sp_InsertOrder($1, $2, $3, $4, $5, $6, NULL)',
      [userId, shippingAddress, totalAmount, deliveryCharge, orderStatus, isSustainableOption]
    );

    console.log("order created: ");
    console.log(result?.rows[0]?.p_orderid);

    const orderId = result?.rows[0]?.p_orderid;
    const orderResult = await getOrderById(orderId);

    for (const item of orderItems) {
      const { productId, quantity, price } = item;
      await orderDetailModel.createOrderDetail({ orderId, productId, quantity, price });
    }

    if (routeInfo) {
      await saveRouteModel.saveRoute(routeInfo, orderId);
    }

    return orderResult;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  } finally {
  }
};

/**
 * Update an existing order
 * @param {number} orderId - Order ID
 * @param {Object} orderData - Updated order data
 * @returns {Promise<Object>} - Updated order object
 */
const updateOrder = async (orderId, orderData) => {
  const { shippingAddress, totalAmount, deliveryCharge, orderStatus, isSustainableOption } = orderData;
  
  try {
    await db.query(
      'CALL sp_UpdateOrder($1, $2, $3, $4, $5, $6)',
      [orderId, shippingAddress, totalAmount, deliveryCharge, orderStatus, isSustainableOption]
    );
    
    const result = await getOrderById(orderId);
    return result;
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

/**
 * Get order by ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Object>} - Order object
 */
const getOrderById = async (orderId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetOrderByID($1)', [orderId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting order by ID:', error);
    throw error;
  }
};

/**
 * Get all orders
 * @returns {Promise<Array>} - Array of order objects
 */
const getAllOrders = async () => {
  try {
    const result = await db.query('SELECT * FROM fn_GetAllOrders()');
    return result.rows;
  } catch (error) {
    console.error('Error getting all orders:', error);
    throw error;
  }
};

/**
 * Get all orders by User ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of order objects
 */
const getOrdersByUserId = async (userId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetOrdersByUserID($1)', [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting orders by user ID:', error);
    throw error;
  }
};

/**
 * Get active orders by User ID
 * @param {number} userId - User ID
 * @returns {Promise<Array>} - Array of active order objects
 */
const getActiveOrdersByUserId = async (userId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetActiveOrdersByUserID($1)', [userId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting active orders by user ID:', error);
    throw error;
  }
};

/**
 * Get order audit history
 * @param {number} orderId - Order ID
 * @returns {Promise<Array>} - Array of audit records
 */
const getOrderAuditHistory = async (orderId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetOrderAuditHistory($1)', [orderId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting order audit history:', error);
    throw error;
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getOrderById,
  getAllOrders,
  getOrdersByUserId,
  getActiveOrdersByUserId,
  getOrderAuditHistory
};
