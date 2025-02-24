const {saveRouteToDB} = require('../models/saveRouteModel');
const { CONFIG, ERROR_MESSAGES } = require('../utils/constants');


const saveRoute = (req, res) => {
    try {
        const route = req.body;

        // something to actually validify the route needed here
        // using temporary one to just so it is noticed at somepoint
        if (!route.test) {
            return res.status(400).json({
                error: ERROR_MESSAGES.routeNotReceived
            });
        }

        const saved = saveRouteToDB(route);

        if (!saved) {
            return res.status(404).json({
                error: ERROR_MESSAGES.routeNotSaved
            });
        }

        return res.json({
            Message: "Route has been saved"
        });
        
    } catch (error) {
        console.error('Route Controller Error:', error);
        return res.status(500).json({
            error: "An internal server error occurred"
        });
    }
};

module.exports = {
    saveRoute
};