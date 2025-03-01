const express = require('express');
const router = express.Router();
const { findRoutes } = require('../controllers/routeController');
const userController = require('../controllers/userController');

router.get('/find-routes', findRoutes);

// Routes follow RESTful convention with base path /user
router.post('/user', userController.createUser);
router.put('/user/:id', userController.updateUser);
router.get('/user/:id', userController.getUserById);
router.get('/user', userController.getAllUsers);
router.get('/user/:id/history', userController.getUserAuditHistory);

module.exports = router;