const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/', userController.createUser);
router.put('/:id', userController.updateUser);
router.get('/:id', userController.getUserById);
router.get('/check/credentials', userController.getUserByCredentials);
router.get('/', userController.getAllUsers);
router.get('/:id/history', userController.getUserAuditHistory);

module.exports = router;