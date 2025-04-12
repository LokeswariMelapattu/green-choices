const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

router.post('/', orderController.createOrder);
router.put('/:id', orderController.updateOrder);
router.get('/:id', orderController.getOrderById);
router.get('/', orderController.getAllOrders);
router.get('/user/:userId', orderController.getOrdersByUserId);  // Get all orders by User ID
router.get('/user/:userId/active', orderController.getActiveOrdersByUserId);  // Get active orders by User ID
router.get('/user/:userId/active-with-route', orderController.getActiveOrdersWithRouteInfo);
router.get('/:id/history', orderController.getOrderAuditHistory);

module.exports = router;
