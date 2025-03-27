const express = require('express');
const router = express.Router();
const orderDetailController = require('../controllers/orderDetailController');

router.post('/', orderDetailController.createOrderDetail);
router.put('/:id', orderDetailController.updateOrderDetail);
// router.get('/:id', orderDetailController.getOrderDetailById);
router.get('/order/:orderId', orderDetailController.getOrderDetailsByOrderId);
router.get('/:id/history', orderDetailController.getOrderDetailAuditHistory);

module.exports = router;
