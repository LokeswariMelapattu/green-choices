const express = require('express');
const router = express.Router();
const { findRoutes } = require('../controllers/routeController');
const { saveRoute } = require('../controllers/saveRouteController');

router.post('/find-routes', findRoutes);
router.post('/save-route', saveRoute);

module.exports = router;