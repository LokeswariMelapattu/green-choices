const express = require('express');
const router = express.Router();
const saveRouteController = require('../controllers/saveRouteController');

router.post('/save-route', saveRouteController.saveRoute);
router.put('/update-route', saveRouteController.updateRoute);
router.get('/get-route', saveRouteController.getRoute);

module.exports = router;