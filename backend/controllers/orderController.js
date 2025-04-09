// controllers/orderController.js
const orderModel = require('../models/order');
const saveRouteModel = require('../models/saveRouteModel');

// Create a new order
const createOrder = async (req, res) => {
  try {
    const order = await orderModel.createOrder(req.body);
    res.status(201).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update an existing order
const updateOrder = async (req, res) => {
  try {
    const order = await orderModel.updateOrder(req.params.id, req.body);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single order by ID
const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all orders
const getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.getAllOrders();
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get active orders by UserID
const getOrdersByUserId = async (req, res) => {
  try {
    const orders = await orderModel.getOrdersByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get active orders by UserID
const getActiveOrdersByUserId = async (req, res) => {
  try {
    const orders = await orderModel.getActiveOrdersByUserId(req.params.userId);
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

const getActiveOrdersWithRouteInfo = async (req, res) => {
  try {
      const { userId } = req.params;

      const activeOrders = await orderModel.getActiveOrdersByUserId(userId);
      const activeOrdersWithRouteInfo = [];

      for (const order of activeOrders) {
        const routeInfo = await saveRouteModel.getRouteByOrderId(order.orderid);
      
        activeOrdersWithRouteInfo.push({
          ...order,
          routeInfo,
        });
      }

      

      // Step 4: Return the combined data (active orders with route info)
      return res.status(200).json({
          success: true,
          message: "Active orders with route info fetched successfully",
          data: activeOrdersWithRouteInfo,
      });
  } catch (error) {
      // If any error occurs, send error response
      return res.status(400).json({
          success: false,
          message: "Error fetching active orders with route info",
          error: error.message,
      });
  }
};

// Get order audit history
const getOrderAuditHistory = async (req, res) => {
  try {
    const history = await orderModel.getOrderAuditHistory(req.params.id);
    res.status(200).json({
      success: true,
      count: history.length,
      data: history
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

module.exports = {
  createOrder,
  updateOrder,
  getOrderById,
  getAllOrders,
  getOrdersByUserId,
  getActiveOrdersByUserId,
  getActiveOrdersWithRouteInfo,
  getOrderAuditHistory
};
