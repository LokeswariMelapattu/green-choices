// controllers/orderDetailController.js
const orderDetailModel = require('../models/orderDetail');

// Create a new order detail
const createOrderDetail = async (req, res) => {
  try {
    const orderDetail = await orderDetailModel.createOrderDetail(req.body);
    res.status(201).json({
      success: true,
      data: orderDetail
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Update an existing order detail
const updateOrderDetail = async (req, res) => {
  try {
    const orderDetail = await orderDetailModel.updateOrderDetail(req.params.id, req.body);
    if (!orderDetail) {
      return res.status(404).json({
        success: false,
        error: 'Order detail not found'
      });
    }
    res.status(200).json({
      success: true,
      data: orderDetail
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get a single order detail by ID
const getOrderDetailById = async (req, res) => {
  try {
    const orderDetail = await orderDetailModel.getOrderDetailByID(req.params.id);
    if (!orderDetail) {
      return res.status(404).json({
        success: false,
        error: 'Order detail not found'
      });
    }
    res.status(200).json({
      success: true,
      data: orderDetail
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get all order details
// const getAllOrderDetails = async (req, res) => {
//   try {
//     const orderDetails = await orderDetailModel.getAllOrderDetails();
//     res.status(200).json({
//       success: true,
//       count: orderDetails.length,
//       data: orderDetails
//     });
//   } catch (error) {
//     res.status(400).json({
//       success: false,
//       error: error.message
//     });
//   }
// };

// Get order details by Order ID
const getOrderDetailsByOrderId = async (req, res) => {
  try {
    const orderDetails = await orderDetailModel.getOrderDetailsByOrderID(req.params.orderId);
    res.status(200).json({
      success: true,
      count: orderDetails.length,
      data: orderDetails
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message
    });
  }
};

// Get order detail audit history
const getOrderDetailAuditHistory = async (req, res) => {
  try {
    const history = await orderDetailModel.getOrderDetailAuditHistory(req.params.id);
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
  createOrderDetail,
  updateOrderDetail,
  getOrderDetailById,
  getOrderDetailsByOrderId,
  getOrderDetailAuditHistory
};
