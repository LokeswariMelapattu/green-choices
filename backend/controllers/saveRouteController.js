const saveRouteModel = require('../models/saveRouteModel');
const { all } = require('../routes/routes');
const { CONFIG, ERROR_MESSAGES } = require('../utils/constants');

// Saves routeInfo, routeDetails and saves routeStatus
const saveRoute = async (req, res) => {
    try {
        const route = req.body;

        const routeInfo = await saveRouteModel.saveRoute(req.body);

        let allRouteDetails = [];

        let i = 0;
        for await (const segment of route.segments) {
            const routeDetails = await saveRouteModel.saveRouteDetails(segment, routeInfo.routeid, route.lastUpdatedUserId, i);
            allRouteDetails.push(routeDetails);
            ++i;
        }

        const routeStatus = await saveRouteModel.saveRouteStatus(routeInfo.routeid, allRouteDetails[0].routedetailid,
            allRouteDetails[0].statusid, route.lastUpdatedUserId)

        res.status(201).json({
            success: true,
            message: "Route info, details and status have been saved",
            routeInfo: routeInfo,
            routeDetails: allRouteDetails,
            routeStatus: routeStatus
        });

    } catch (error) {
        console.error('Route Controller Error:', error);
        res.status(400).json({
            success: false,
            message: ERROR_MESSAGES.routeNotSaved,
            error: error.message
        });
    }
};

const updateRoute = async (req, res) => {
    try {

        const route = req.body

        const routeInfo = await saveRouteModel.updateRoute(route);

        let allRouteDetails = [];

        let i = 0;
        for await (const segment of route.segments) {
            let routeDetails = await saveRouteModel.updateRouteDetails(routeInfo.routeid, i,
                 segment, route.lastUpdatedUserId);
            
            // if there happens to be more segments than there were before updating

            if (routeDetails === undefined) {
                routeDetails = await saveRouteModel.saveRouteDetails(segment, routeInfo.routeid, route.lastUpdatedUserId, i);
            }

            allRouteDetails.push(routeDetails);
            ++i;
        }

        const routeStatus = await saveRouteModel.updateRouteStatus(route.routeStatusId, routeInfo.routeid, 
            allRouteDetails[route.currentSeqNo].routedetailid, route.currentSeqNo, allRouteDetails[route.currentSeqNo].statusid,
            route.lastUpdatedUserId)
        

        res.status(200).json({
            success: true,
            message: "Route info, details and status have been updated",
            routeInfo: routeInfo,
            routeDetails: allRouteDetails,
            routeStatus: routeStatus
        });
    } catch {
        res.status(400).json({
            success: false,
            message: "Route not updated",
            error: "error.message"
        });
    } 
};

module.exports = {
    saveRoute,
    updateRoute
};