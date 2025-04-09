const db = require('../config/db');


/**
 * Save a new route
 * @param {Object} route - Route data object
 * @param {string} route.source - Source location of the route
 * @param {string} route.destination - Destination location of the route
 * @param {int} route.carbonEmissions - Amount of emissions on the whole route
 * @param {int} route.duration - Duration of the route
 * @param {int} route.totalCost - Total cost of the route
 * @param {int} route.orderId - OrderID connected to the route
 * @param {int} route.lastUpdatedUserId - UserID which was used to save route
 * @returns {Promise<Object>} - Created route object
 */
const saveRoute = async (route, orderId) => {
    const {source, destination, carbonEmissions, duration, totalCost, lastUpdatedUserId} = route;

    try {
        const result = await db.query(
            'CALL sp_InsertRoute($1, $2, $3, $4, $5, $6, $7, NULL)',
            [orderId, source, destination, carbonEmissions, duration, totalCost, lastUpdatedUserId]
        );
        const routeResult = await db.query(
            'SELECT * FROM Route_Info WHERE RouteID = $1',
            [result.rows[0].p_routeid]
        );
        return routeResult.rows[0];
    } catch (error) {
        console.error('Error saving route:', error);
        throw error;
    }

};

/**
 * Update a route
 * @param {Object} route - Route data object
 * @param {string} route.source - Source location of the route
 * @param {string} route.destination - Destination location of the route
 * @param {int} route.carbonEmissions - Amount of emissions on the whole route
 * @param {int} route.duration - Duration of the route
 * @param {int} route.totalCost - Total cost of the route
 * @param {int} route.routeId - RouteID of the route
 * @param {int} route.orderId - OrderID connected to the route
 * @param {int} route.lastUpdatedUserId - UserID which was used to update route
 * @returns {Promise<Object>} - Updated route object
 */
const updateRoute = async (routeData) => {
    const {source, destination, carbonEmissions, duration, totalCost, orderId, lastUpdatedUserId} = routeData;
  
  try {
    const result = await db.query(
      'CALL sp_UpdateRoute($1, $2, $3, $4, $5, $6, $7, NULL)',
      [orderId, source, destination, carbonEmissions, duration, totalCost, lastUpdatedUserId]
    );
    
    const routeId = result?.rows[0]?.p_routeid;

    await db.query(
      'CALL sp_UpdateOrderSustainability($1, $2)',
      [orderId, true]
    );

    const routeResult = await db.query('SELECT * FROM fn_GetRouteByID($1)', [routeId]);
    return routeResult.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Getting routes, connected to orderID
 * @param {int} orderId - OrderID connected to the route
 * @returns {Promise<Object>} - Searched route object
 */
const getRouteByOrderId = async (orderId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetRouteByOrderID($1)', [orderId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Save new route details
 * @param {Object} routeSegment - Route segment data object
 * @param {string} routeSegment.from - Source location of the segment
 * @param {string} routeSegment.to - Destination location of the segment
 * @param {string} routeSegment.transportMode - Transport mode of the segment
 * @param {int} routeSegment.carbonEmissions - Amount of emissions on the segment
 * @param {int} routeSegment.duration - Duration of the segment
 * @param {int} routeSegment.cost - Cost of the segment
 * @param {int} routeSegment.distance - Distance of the segment
 * @param {int} routeSegment.statusId - StatusID of the segment
 * @param {int} routeId - RouteID which is used to save segment
 * @param {int} lastUpdatedUserId - UserID which was used to save segment
 * @param {int} seqNo - Sequence Number
 * @returns {Promise<Object>} - Created routeDetails object
 */
const saveRouteDetails = async (routeSegment, routeId, lastUpdatedUserId, seqNo) => {
    
    const {from, to, transportMode, carbonEmissions, duration, cost, distance, statusId} = routeSegment;

    try {

      const result =await db.query(
            'CALL sp_InsertRouteDetails($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NULL)',
            [routeId, seqNo, from, to, transportMode, carbonEmissions, duration, cost, distance, statusId, lastUpdatedUserId]
        );

      const routeDetailsResult = await db.query(
          'SELECT * FROM Route_Details WHERE RouteDetailID = $1',
          [result.rows[0].p_routedetailid]
      );

      return routeDetailsResult.rows[0];

    } catch (error) {
      console.error('Error saving route:', error);
      throw error;
    }

};

/**
 * Save new route details
 * @param {Object} routeSegment - Route segment data object
 * @param {string} routeSegment.from - Source location of the segment
 * @param {string} routeSegment.to - Destination location of the segment
 * @param {string} routeSegment.transportMode - Transport mode of the segment
 * @param {int} routeSegment.carbonEmissions - Amount of emissions on the segment
 * @param {int} routeSegment.duration - Duration of the segment
 * @param {int} routeSegment.cost - Cost of the segment
 * @param {int} routeSegment.distance - Distance of the segment
 * @param {int} routeSegment.statusId - StatusID of the segment
 * @param {int} routeSegment.routeDetailId - routeDetailID to update
 * @param {int} routeId - RouteID which is used to update segment
 * @param {int} lastUpdatedUserId - UserID which was used to update segment
 * @param {int} seqNo - Sequence number of the segment
 * @returns {Promise<Object>} - Updated routeDetails object
 */
const updateRouteDetails = async (routeId, seqNo, routeSegment, lastUpdatedUserId) => {

  const {routeDetailId, from, to, transportMode, carbonEmissions, duration, cost, distance, statusId} = routeSegment;

  try {
    await db.query(
      'CALL sp_UpdateRouteDetails($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
      [routeDetailId, routeId, seqNo, from, to, transportMode, carbonEmissions, duration, cost, distance, statusId, lastUpdatedUserId]
    );

    const result = await db.query('SELECT * FROM fn_GetRouteDetailsByID($1)', [routeDetailId]);

    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Getting routeDetails, connected to routeID
 * @param {int} routeId - routeID connected to the routeDetails
 * @returns {Promise<Object>} - Searched routeDetails object
 */
const getRouteDetailsByRouteId = async (routeId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetRouteDetailsByRouteID($1)', [routeId]);
    return result.rows;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Save new route details
 * @param {int} routeId - RouteID which is used to save status
 * @param {int} routeDetailId - RouteDetailID which is current segment
 * @param {int} statusId - StatusID of the route
 * @param {int} lastUpdatedUserId - UserID which was used to save status
 * @returns {Promise<Object>} - Created routeStatus object
 */
const saveRouteStatus = async (routeId, routeDetailId, statusId, lastUpdatedUserId) => {
  try {

      const result = await db.query(
          'CALL sp_InsertRouteStatus($1, $2, $3, $4, $5, NULL)',
          [routeId, routeDetailId, 0, statusId, lastUpdatedUserId]
      );

      const routeStatusResult = await db.query(
          'SELECT * FROM Route_Status WHERE RouteStatusID = $1',
          [result.rows[0].p_routestatusid]
      );
      return routeStatusResult.rows[0];
  } catch (error) {
      console.error('Error saving route:', error);
      throw error;
  }

};

/**
 * Save new route details
 * @param {int} routeStatusId - RouteStatusID which is to be updated
 * @param {int} routeId - RouteID which is used to update status
 * @param {int} routeDetailId - RouteDetailID which is current segment
 * @param {int} seqNo - Sequence number of the current segment
 * @param {int} statusId - StatusID of the route
 * @param {int} lastUpdatedUserId - UserID which was used to update status
 * @returns {Promise<Object>} - Updated routeStatus object
 */
const updateRouteStatus = async (routeStatusId, routeId, routeDetailId, seqNo, statusId, lastUpdatedUserId) => {
  try {

    await db.query(
      'CALL sp_UpdateRouteStatus($1, $2, $3, $4, $5, $6)',
      [routeStatusId, routeId, routeDetailId, seqNo, statusId, lastUpdatedUserId]
    );

    const result = await db.query('SELECT * FROM fn_GetRouteStatusByID($1)', [routeStatusId]);
    return result.rows[0];

  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

/**
 * Getting routeStatus, connected to routeID
 * @param {int} routeId - routeID connected to the routeDetails
 * @returns {Promise<Object>} - Searched routeStatus object
 */
const getRouteStatusByRouteId = async (routeId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetRouteStatusByRouteID($1)', [routeId]);
    return result.rows;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

module.exports = {
    saveRoute,
    updateRoute,
    getRouteByOrderId,
    saveRouteDetails,
    updateRouteDetails,
    getRouteDetailsByRouteId,
    saveRouteStatus,
    updateRouteStatus,
    getRouteStatusByRouteId
}