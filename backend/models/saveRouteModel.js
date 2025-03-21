const db = require('../config/db');

const saveRoute = async (route) => {
    const {source, destination, carbonEmissions, duration, totalCost, orderId, lastUpdatedUserId} = route;
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

const updateRoute = async (routeData) => {
    const {source, destination, carbonEmissions, duration, totalCost, routeId, orderId, lastUpdatedUserId} = routeData;
  
  try {
    await db.query(
      'CALL sp_UpdateRoute($1, $2, $3, $4, $5, $6, $7, $8)',
      [routeId, orderId, source, destination, carbonEmissions, duration, totalCost, lastUpdatedUserId]
    );
    
    const result = await db.query('SELECT * FROM fn_GetRouteByID($1)', [routeId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const getRouteById = async (routeId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetRouteByID($1)', [routeId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

const saveRouteDetails = async (routeSeqment, routeId, lastUpdatedUserId, seqNo) => {
    
    const {from, to, transportMode, carbonEmissions, duration, cost, distance, statusId} = routeSeqment;

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

const updateRouteDetails = async (routeId, seqNo, routeDetailsData, lastUpdatedUserId) => {

  const {routeDetailId, from, to, transportMode, carbonEmissions, duration, cost, distance, statusId} = routeDetailsData;

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

const getRouteDetailsById = async (routeDetailId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetRouteDetailsByID($1)', [routeDetailId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

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

const getRouteStatusById = async (routeStatusId) => {
  try {
    const result = await db.query('SELECT * FROM fn_GetRouteStatusByID($1)', [routeStatusId]);
    return result.rows[0];
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

module.exports = {
    saveRoute,
    updateRoute,
    getRouteById,
    saveRouteDetails,
    updateRouteDetails,
    getRouteDetailsById,
    saveRouteStatus,
    updateRouteStatus,
    getRouteStatusById
}