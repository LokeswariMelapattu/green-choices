const express = require('express');
const router = express.Router();
const { findRoutes } = require('../controllers/routeController');
const { saveRoute } = require('../controllers/saveRouteController');


router.get('/find-routes', findRoutes);


module.exports = router;