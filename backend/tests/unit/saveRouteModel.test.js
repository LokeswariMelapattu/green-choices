const saveRouteModel = require('../../models/saveRouteModel');
const db = require('../../config/db');


jest.mock('../../config/db', () => ({
    query: jest.fn()
}));

describe('Save Route Model', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('saveRoute', () => {
        test('should save a route successfully', async () => {

            const routeData = {
                source: 'New York, USA',
                destination: 'London, UK',
                carbonEmissions: 100,
                duration: 7,
                totalCost: 500,
                orderId: 1,
                lastUpdatedUserId: 2
            };


            db.query.mockImplementation((query, params) => {
                if (query.includes('sp_InsertRoute')) {
                    return { rows: [{ p_routeid: 1 }] };
                } else {
                    return {
                        rows: [{
                            routeid: 1,
                            orderid: 1,
                            source: 'New York, USA',
                            destination: 'London, UK',
                            carbonemissions: 100,
                            duration: 7,
                            totalcost: 500,
                            lastupdatedby: 2,
                            lastupdatedon: new Date().toISOString()
                        }]
                    };
                }
            });


            const result = await saveRouteModel.saveRoute(routeData);


            expect(db.query).toHaveBeenCalledTimes(2);
            expect(result).toBeDefined();
            expect(result.routeid).toBe(1);
            expect(result.source).toBe(routeData.source);
            expect(result.destination).toBe(routeData.destination);
        });

        test('should throw error when database operation fails', async () => {

            const routeData = {
                source: 'New York, USA',
                destination: 'London, UK',
                carbonEmissions: 100,
                duration: 7,
                totalCost: 500,
                orderId: 1,
                lastUpdatedUserId: 2
            };


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.saveRoute(routeData)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateRoute', () => {
        test('should update a route successfully', async () => {

            const routeData = {
                routeId: 1,
                orderId: 2,
                source: 'New York, USA',
                destination: 'Paris, France',
                carbonEmissions: 150,
                duration: 8,
                routeNumber: 1,
                totalCost: 600,
                lastUpdatedUserId: 3
            };


            db.query.mockImplementation((query, params) => {
                if (query.includes('sp_UpdateRoute')) {
                    return { rows: [{ p_routeid: 1 }] };
                } else if (query.includes('sp_UpdateOrderSustainability')) {
                    return { rows: [] };
                } else if (query.includes('fn_GetRouteByID')) {
                    return {
                        rows: [{
                            routeid: 1,
                            orderid: 2,
                            source: 'New York, USA',
                            destination: 'Paris, France',
                            carbonemissions: 150,
                            duration: 8,
                            routenumber: 1,
                            totalcost: 600,
                            lastupdatedby: 3,
                            lastupdatedon: new Date().toISOString()
                        }]
                    };
                }
            });


            const result = await saveRouteModel.updateRoute(routeData);


            expect(db.query).toHaveBeenCalledTimes(3);
            expect(result).toBeDefined();
            expect(result.routeid).toBe(1);
            expect(result.source).toBe(routeData.source);
            expect(result.destination).toBe(routeData.destination);
        });

        test('should throw error when update operation fails', async () => {

            const routeData = {
                routeId: 1,
                orderId: 2,
                source: 'New York, USA',
                destination: 'Paris, France',
                carbonEmissions: 150,
                duration: 8,
                routeNumber: 1,
                totalCost: 600,
                lastUpdatedUserId: 3
            };


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.updateRoute(routeData)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('getRouteByOrderId', () => {
        test('should get routes by order ID successfully', async () => {

            const orderId = 1;
            const expectedRoute = {
                routeid: 1,
                orderid: 1,
                source: 'New York, USA',
                destination: 'London, UK',
                carbonemissions: 100,
                duration: 7,
                totalcost: 500
            };


            db.query.mockResolvedValueOnce({ rows: [expectedRoute] });


            const result = await saveRouteModel.getRouteByOrderId(orderId);


            expect(db.query).toHaveBeenCalledTimes(1);
            expect(db.query).toHaveBeenCalledWith('SELECT * FROM fn_GetRouteByOrderID($1)', [orderId]);
            expect(result).toEqual(expectedRoute);
        });

        test('should throw error when get operation fails', async () => {

            const orderId = 1;


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.getRouteByOrderId(orderId)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('saveRouteDetails', () => {
        test('should save route details successfully', async () => {

            const routeSegment = {
                from: 'New York, USA',
                to: 'London, UK',
                transportMode: 'plane',
                carbonEmissions: 100,
                duration: 7,
                cost: 500,
                distance: 5500,
                statusId: 1
            };
            const routeId = 1;
            const lastUpdatedUserId = 2;
            const seqNo = 1;


            db.query.mockImplementation((query, params) => {
                if (query.includes('sp_InsertRouteDetails')) {
                    return { rows: [{ p_routedetailid: 1 }] };
                } else {
                    return {
                        rows: [{
                            routedetailid: 1,
                            routeid: 1,
                            seqno: 1,
                            source: 'New York, USA',
                            destination: 'London, UK',
                            transportmode: 'plane',
                            carbonemissions: 100,
                            duration: 7,
                            cost: 500,
                            distance: 5500,
                            statusid: 1,
                            lastupdatedby: 2,
                            lastupdatedon: new Date().toISOString()
                        }]
                    };
                }
            });


            const result = await saveRouteModel.saveRouteDetails(routeSegment, routeId, lastUpdatedUserId, seqNo);


            expect(db.query).toHaveBeenCalledTimes(2);
            expect(result).toBeDefined();
            expect(result.routedetailid).toBe(1);
            expect(result.routeid).toBe(routeId);
        });

        test('should throw error when saving route details fails', async () => {

            const routeSegment = {
                from: 'New York, USA',
                to: 'London, UK',
                transportMode: 'plane',
                carbonEmissions: 100,
                duration: 7,
                cost: 500,
                distance: 5500,
                statusId: 1
            };
            const routeId = 1;
            const lastUpdatedUserId = 2;
            const seqNo = 1;


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.saveRouteDetails(routeSegment, routeId, lastUpdatedUserId, seqNo)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateRouteDetails', () => {
        test('should update route details successfully', async () => {

            const routeId = 1;
            const seqNo = 1;
            const routeSegment = {
                routeDetailId: 1,
                from: 'New York, USA',
                to: 'London, UK',
                transportMode: 'plane',
                carbonEmissions: 120,
                duration: 8,
                cost: 550,
                distance: 5500,
                statusId: 2
            };
            const lastUpdatedUserId = 3;


            db.query.mockImplementation((query, params) => {
                if (query.includes('sp_UpdateRouteDetails')) {
                    return { rows: [] };
                } else {
                    return {
                        rows: [{
                            routedetailid: 1,
                            routeid: 1,
                            seqno: 1,
                            source: 'New York, USA',
                            destination: 'London, UK',
                            transportmode: 'plane',
                            carbonemissions: 120,
                            duration: 8,
                            cost: 550,
                            distance: 5500,
                            statusid: 2,
                            lastupdatedby: 3,
                            lastupdatedon: new Date().toISOString()
                        }]
                    };
                }
            });


            const result = await saveRouteModel.updateRouteDetails(routeId, seqNo, routeSegment, lastUpdatedUserId);


            expect(db.query).toHaveBeenCalledTimes(2);
            expect(result).toBeDefined();
            expect(result.routedetailid).toBe(routeSegment.routeDetailId);
            expect(result.routeid).toBe(routeId);
        });

        test('should throw error when updating route details fails', async () => {

            const routeId = 1;
            const seqNo = 1;
            const routeSegment = {
                routeDetailId: 1,
                from: 'New York, USA',
                to: 'London, UK',
                transportMode: 'plane',
                carbonEmissions: 120,
                duration: 8,
                cost: 550,
                distance: 5500,
                statusId: 2
            };
            const lastUpdatedUserId = 3;


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.updateRouteDetails(routeId, seqNo, routeSegment, lastUpdatedUserId)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('getRouteDetailsByRouteId', () => {
        test('should get route details by route ID successfully', async () => {

            const routeId = 1;
            const expectedDetails = [
                {
                    routedetailid: 1,
                    routeid: 1,
                    seqno: 1,
                    source: 'New York, USA',
                    destination: 'London, UK',
                    transportmode: 'plane',
                    carbonemissions: 100,
                    duration: 7,
                    cost: 500,
                    distance: 5500,
                    statusid: 1
                }
            ];


            db.query.mockResolvedValueOnce({ rows: expectedDetails });


            const result = await saveRouteModel.getRouteDetailsByRouteId(routeId);


            expect(db.query).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedDetails);
        });

        test('should throw error when get operation fails', async () => {

            const routeId = 1;


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.getRouteDetailsByRouteId(routeId)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('saveRouteStatus', () => {
        test('should save route status successfully', async () => {

            const routeId = 1;
            const routeDetailId = 1;
            const statusId = 1;
            const lastUpdatedUserId = 2;


            db.query.mockImplementation((query, params) => {
                if (query.includes('sp_InsertRouteStatus')) {
                    return { rows: [{ p_routestatusid: 1 }] };
                } else {
                    return {
                        rows: [{
                            routestatusid: 1,
                            routeid: 1,
                            routedetailid: 1,
                            seqno: 0,
                            statusid: 1,
                            lastupdatedby: 2,
                            lastupdatedon: new Date().toISOString()
                        }]
                    };
                }
            });


            const result = await saveRouteModel.saveRouteStatus(routeId, routeDetailId, statusId, lastUpdatedUserId);


            expect(db.query).toHaveBeenCalledTimes(2);
            expect(result).toBeDefined();
            expect(result.routestatusid).toBe(1);
            expect(result.routeid).toBe(routeId);
        });

        test('should throw error when saving route status fails', async () => {
            // Mock data
            const routeId = 1;
            const routeDetailId = 1;
            const statusId = 1;
            const lastUpdatedUserId = 2;


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.saveRouteStatus(routeId, routeDetailId, statusId, lastUpdatedUserId)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('updateRouteStatus', () => {
        test('should update route status successfully', async () => {

            const routeStatusId = 1;
            const routeId = 1;
            const routeDetailId = 1;
            const seqNo = 1;
            const statusId = 2;
            const lastUpdatedUserId = 3;


            db.query.mockImplementation((query, params) => {
                if (query.includes('sp_UpdateRouteStatus')) {
                    return { rows: [] };
                } else {
                    return {
                        rows: [{
                            routestatusid: 1,
                            routeid: 1,
                            routedetailid: 1,
                            seqno: 1,
                            statusid: 2,
                            lastupdatedby: 3,
                            lastupdatedon: new Date().toISOString()
                        }]
                    };
                }
            });


            const result = await saveRouteModel.updateRouteStatus(routeStatusId, routeId, routeDetailId, seqNo, statusId, lastUpdatedUserId);


            expect(db.query).toHaveBeenCalledTimes(2);
            expect(result).toBeDefined();
            expect(result.routestatusid).toBe(routeStatusId);
            expect(result.statusid).toBe(statusId);
        });

        test('should throw error when updating route status fails', async () => {

            const routeStatusId = 1;
            const routeId = 1;
            const routeDetailId = 1;
            const seqNo = 1;
            const statusId = 2;
            const lastUpdatedUserId = 3;


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.updateRouteStatus(routeStatusId, routeId, routeDetailId, seqNo, statusId, lastUpdatedUserId)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });

    describe('getRouteStatusByRouteId', () => {
        test('should get route status by route ID successfully', async () => {

            const routeId = 1;
            const expectedStatus = [
                {
                    routestatusid: 1,
                    routeid: 1,
                    routedetailid: 1,
                    seqno: 0,
                    statusid: 1,
                    lastupdatedby: 2,
                    lastupdatedon: new Date().toISOString()
                }
            ];


            db.query.mockResolvedValueOnce({ rows: expectedStatus });


            const result = await saveRouteModel.getRouteStatusByRouteId(routeId);


            expect(db.query).toHaveBeenCalledTimes(1);
            expect(result).toEqual(expectedStatus);
        });

        test('should throw error when get operation fails', async () => {

            const routeId = 1;


            const dbError = new Error('Database error');
            db.query.mockRejectedValueOnce(dbError);


            await expect(saveRouteModel.getRouteStatusByRouteId(routeId)).rejects.toThrow(dbError);
            expect(db.query).toHaveBeenCalledTimes(1);
        });
    });
});