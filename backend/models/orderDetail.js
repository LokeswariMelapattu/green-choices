const db = require('../config/db');

/**
 * Create a new order detail
 * @param {Object} orderDetailData - Order detail data object
 * @param {number} orderDetailData.orderId - Order ID
 * @param {number} orderDetailData.productId - Product ID
 * @param {number} orderDetailData.quantity - Quantity
 * @param {number} orderDetailData.price - Unit Price
 * @returns {Promise<Object>} - Created order detail object
 */
const createOrderDetail = async (orderDetailData) => {
  const { orderId, productId, quantity, price } = orderDetailData;
  
  try {
    await db.query(
      'CALL sp_InsertOrderDetail($1, $2, $3, $4, NULL)',
      [orderId, productId, quantity, price]
    );
    
    const result = getOrderDetailsByOrderID(orderId);
    return result;
  } catch (error) {
    console.error('Error creating order detail:', error);
    throw error;
  }
};

/**
 * Update an existing order detail
 * @param {number} orderDetailId - Order Detail ID
 * @param {Object} orderDetailData - Updated order detail data
 * @returns {Promise<Object>} - Updated order detail object
 */
const updateOrderDetail = async (orderDetailId, orderDetailData) => {
  const { quantity, price } = orderDetailData;
  
  try {
    await db.query(
      'CALL sp_UpdateOrderDetail($1, $2, $3)',
      [orderDetailId, quantity, price]
    );
    
    const result = await getOrderDetailByID(orderDetailId);
    return result;
  } catch (error) {
    console.error('Error updating order detail:', error);
    throw error;
  }
};

/**
 * Get order details by order ID
 * @param {number} orderId - Order ID
 * @returns {Promise<Array>} - Array of order detail objects
 */
const getOrderDetailsByOrderID = async (orderId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetOrderDetailsByOrderID($1)', [orderId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting order details by order ID:', error);
    throw error;
  }
};

/**
 * Get order detail by ID
 * @param {number} orderDetailId - Order Detail ID
 * @returns {Promise<Object>} - Order detail object
 */
const getOrderDetailByID = async (orderDetailId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetOrderDetailByID($1)', [orderDetailId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error getting order detail by ID:', error);
    throw error;
  }
};

/**
 * Get order details audit history
 * @param {number} orderDetailId - Order Detail ID
 * @returns {Promise<Array>} - Array of audit records
 */
const getOrderDetailAuditHistory = async (orderDetailId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetOrderDetailAuditHistory($1)', [orderDetailId]);
    return result.rows;
  } catch (error) {
    console.error('Error getting order detail audit history:', error);
    throw error;
  }
};

module.exports = {
  createOrderDetail,
  updateOrderDetail,
  getOrderDetailsByOrderID,
  getOrderDetailByID,
  getOrderDetailAuditHistory
};
