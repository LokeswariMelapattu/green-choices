const saveRouteModel = require('../models/saveRouteModel');
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

const updateRouteInfo = async (req, res) => {
  try {
    const route = req.body;
    const routeInfo = await saveRouteModel.updateRoute(route);
    if (!routeInfo) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    res.status(200).json({
      success: true,
      data: routeInfo
    });
  } catch (error) {
    res.status(400).json({
      success: false,
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

    } catch (error) {
        console.error('Route Update Error:', error);
        res.status(400).json({
            success: false,
            message: ERROR_MESSAGES.routeNotUpdated,
            error: error.message
        });
    }
};

const getRoute = async (req, res) => {

    try {

        const { orderId } = req.query;

        const routeInfos = await saveRouteModel.getRouteByOrderId(orderId);

        let allRouteDetails = [];
        let allRouteStatus = [];

        for await (let row of routeInfos) {

            const routeDetails = await saveRouteModel.getRouteDetailsByRouteId(row.routeid);
            const routeStatus = await saveRouteModel.getRouteStatusByRouteId(row.routeid);

            allRouteDetails.push(routeDetails);
            allRouteStatus.push(routeStatus);
        }

        res.status(200).json({
            success: true,
            message: "Route infos, details and statuses have been gotten",
            routeInfos: routeInfos,
            routeDetails: allRouteDetails,
            routeStatus: allRouteStatus
        });

    } catch (error) {
        console.error('Route Get Error:', error);
        res.status(400).json({
            success: false,
            message: "Route infos, details and statuses were unable to be gotten",
            error: error.message
        });
    }

};

module.exports = {
    saveRoute,
    updateRoute,
    updateRouteInfo,
    getRoute
};