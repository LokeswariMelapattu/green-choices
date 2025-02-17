const express = require('express');
const router = express.Router();
const { findRoutes } = require('../controllers/routeController');

router.post('/find-routes', findRoutes);

module.exports = router;