const {
    saveRoute,
    updateRouteInfo,
    updateRoute,
    getRoute
} = require('../../controllers/saveRouteController');
const saveRouteModel = require('../../models/saveRouteModel');
const { ERROR_MESSAGES } = require('../../utils/constants');


jest.mock('../../models/saveRouteModel');

describe('Save Route Controller', () => {
    let req;
    let res;

    beforeEach(() => {

        jest.clearAllMocks();


        req = {
            body: {
                source: 'New York',
                destination: 'Los Angeles',
                carbonEmissions: 500,
                duration: 120,
                totalCost: 300,
                orderId: 1,
                lastUpdatedUserId: 2,
                segments: [
                    {
                        from: 'New York',
                        to: 'Chicago',
                        transportMode: 'flight',
                        carbonEmissions: 200,
                        duration: 60,
                        cost: 150,
                        distance: 1200,
                        statusId: 1
                    },
                    {
                        from: 'Chicago',
                        to: 'Los Angeles',
                        transportMode: 'train',
                        carbonEmissions: 300,
                        duration: 60,
                        cost: 150,
                        distance: 2000,
                        statusId: 1
                    }
                ]
            },
            query: {
                orderId: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('saveRoute', () => {
        test('should save a route and return 201 status', async () => {

            const mockRouteInfo = {
                routeid: 1,
                orderid: 1,
                source: 'New York',
                destination: 'Los Angeles',
                carbonemissions: 500,
                duration: 120,
                totalcost: 300
            };
            saveRouteModel.saveRoute.mockResolvedValue(mockRouteInfo);

            const mockRouteDetails1 = {
                routedetailid: 1,
                routeid: 1,
                seqno: 0,
                from: 'New York',
                to: 'Chicago',
                transportmode: 'flight',
                carbonemissions: 200,
                duration: 60,
                cost: 150,
                distance: 1200,
                statusid: 1
            };
            const mockRouteDetails2 = {
                routedetailid: 2,
                routeid: 1,
                seqno: 1,
                from: 'Chicago',
                to: 'Los Angeles',
                transportmode: 'train',
                carbonemissions: 300,
                duration: 60,
                cost: 150,
                distance: 2000,
                statusid: 1
            };
            saveRouteModel.saveRouteDetails
                .mockResolvedValueOnce(mockRouteDetails1)
                .mockResolvedValueOnce(mockRouteDetails2);

            const mockRouteStatus = {
                routestatusid: 1,
                routeid: 1,
                routedetailid: 1,
                seqno: 0,
                statusid: 1
            };
            saveRouteModel.saveRouteStatus.mockResolvedValue(mockRouteStatus);


            await saveRoute(req, res);

            // Assert model calls
            expect(saveRouteModel.saveRoute).toHaveBeenCalledWith(req.body);
            expect(saveRouteModel.saveRouteDetails).toHaveBeenCalledTimes(2);
            expect(saveRouteModel.saveRouteStatus).toHaveBeenCalledWith(
                mockRouteInfo.routeid,
                mockRouteDetails1.routedetailid,
                mockRouteDetails1.statusid,
                req.body.lastUpdatedUserId
            );


            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Route info, details and status have been saved",
                routeInfo: mockRouteInfo,
                routeDetails: [mockRouteDetails1, mockRouteDetails2],
                routeStatus: mockRouteStatus
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to save route');
            saveRouteModel.saveRoute.mockRejectedValue(error);


            await saveRoute(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                message: ERROR_MESSAGES.routeNotSaved,
                error: error.message
            });
        });
    });

    describe('updateRouteInfo', () => {
        test('should update route info and return 200 status', async () => {
            const mockRouteInfo = {
                routeid: 1,
                orderid: 1,
                source: 'New York',
                destination: 'Los Angeles',
                carbonemissions: 500,
                duration: 120,
                totalcost: 300
            };

            saveRouteModel.updateRoute.mockResolvedValue(mockRouteInfo);

            await updateRouteInfo(req, res);

            expect(saveRouteModel.updateRoute).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                data: mockRouteInfo
            });

        })

        test('should handle if route to be updated is not found and return 404 status', async () => {
            saveRouteModel.updateRoute.mockResolvedValue(undefined);

            await updateRouteInfo(req, res);

            expect(saveRouteModel.updateRoute).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: "Route not found"
            });

        })

        test('should handle errors and return 400 status', async () => {
            const error = new Error('Failed to update route');
            saveRouteModel.updateRoute.mockRejectedValue(error);

            await updateRouteInfo(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                success: false,
                error: error.message
            });

        })
    })

    describe('updateRoute', () => {
        test('should update a route and return 200 status', async () => {

            req.body.routeId = 1;
            req.body.routeStatusId = 1;
            req.body.currentSeqNo = 0;


            const mockRouteInfo = {
                routeid: 1,
                orderid: 1,
                source: 'New York',
                destination: 'Los Angeles',
                carbonemissions: 500,
                duration: 120,
                totalcost: 300
            };
            saveRouteModel.updateRoute.mockResolvedValue(mockRouteInfo);

            const mockRouteDetails1 = {
                routedetailid: 1,
                routeid: 1,
                seqno: 0,
                from: 'New York',
                to: 'Chicago',
                transportmode: 'flight',
                carbonemissions: 200,
                duration: 60,
                cost: 150,
                distance: 1200,
                statusid: 1
            };
            const mockRouteDetails2 = {
                routedetailid: 2,
                routeid: 1,
                seqno: 1,
                from: 'Chicago',
                to: 'Los Angeles',
                transportmode: 'train',
                carbonemissions: 300,
                duration: 60,
                cost: 150,
                distance: 2000,
                statusid: 1
            };
            saveRouteModel.updateRouteDetails
                .mockResolvedValueOnce(mockRouteDetails1)
                .mockResolvedValueOnce(mockRouteDetails2);

            const mockRouteStatus = {
                routestatusid: 1,
                routeid: 1,
                routedetailid: 1,
                seqno: 0,
                statusid: 1
            };
            saveRouteModel.updateRouteStatus.mockResolvedValue(mockRouteStatus);


            await updateRoute(req, res);


            expect(saveRouteModel.updateRoute).toHaveBeenCalledWith(req.body);
            expect(saveRouteModel.updateRouteDetails).toHaveBeenCalledTimes(2);
            expect(saveRouteModel.updateRouteStatus).toHaveBeenCalled();


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Route info, details and status have been updated",
                routeInfo: mockRouteInfo,
                routeDetails: [mockRouteDetails1, mockRouteDetails2],
                routeStatus: mockRouteStatus
            });
        });

        test('should handle case where new segments are added during update', async () => {

            req.body.routeId = 1;
            req.body.routeStatusId = 1;
            req.body.currentSeqNo = 0;


            const mockRouteInfo = { routeid: 1, orderid: 1 };
            saveRouteModel.updateRoute.mockResolvedValue(mockRouteInfo);


            saveRouteModel.updateRouteDetails
                .mockResolvedValueOnce({ routedetailid: 1, routeid: 1, seqno: 0, statusid: 1 })
                .mockResolvedValueOnce(undefined);

            saveRouteModel.saveRouteDetails
                .mockResolvedValueOnce({ routedetailid: 2, routeid: 1, seqno: 1, statusid: 1 });

            const mockRouteStatus = { routestatusid: 1, routeid: 1 };
            saveRouteModel.updateRouteStatus.mockResolvedValue(mockRouteStatus);


            await updateRoute(req, res);


            expect(saveRouteModel.updateRoute).toHaveBeenCalled();
            expect(saveRouteModel.updateRouteDetails).toHaveBeenCalledTimes(2);
            expect(saveRouteModel.saveRouteDetails).toHaveBeenCalledTimes(1);
            expect(saveRouteModel.updateRouteStatus).toHaveBeenCalled();


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: true,
                message: "Route info, details and status have been updated"
            }));
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to update route');
            saveRouteModel.updateRoute.mockRejectedValue(error);


            await updateRoute(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: ERROR_MESSAGES.routeNotUpdated
            }));
        });
    });

    describe('getRoute', () => {
        test('should get routes by order id and return 200 status', async () => {

            const mockRouteInfos = [
                { routeid: 1, orderid: 1 },
                { routeid: 2, orderid: 1 }
            ];
            saveRouteModel.getRouteByOrderId.mockResolvedValue(mockRouteInfos);

            const mockRouteDetails1 = [
                { routedetailid: 1, routeid: 1, seqno: 0 },
                { routedetailid: 2, routeid: 1, seqno: 1 }
            ];
            const mockRouteDetails2 = [
                { routedetailid: 3, routeid: 2, seqno: 0 }
            ];
            saveRouteModel.getRouteDetailsByRouteId
                .mockResolvedValueOnce(mockRouteDetails1)
                .mockResolvedValueOnce(mockRouteDetails2);

            const mockRouteStatus1 = [{ routestatusid: 1, routeid: 1 }];
            const mockRouteStatus2 = [{ routestatusid: 2, routeid: 2 }];
            saveRouteModel.getRouteStatusByRouteId
                .mockResolvedValueOnce(mockRouteStatus1)
                .mockResolvedValueOnce(mockRouteStatus2);


            await getRoute(req, res);


            expect(saveRouteModel.getRouteByOrderId).toHaveBeenCalledWith(req.query.orderId);
            expect(saveRouteModel.getRouteDetailsByRouteId).toHaveBeenCalledTimes(2);
            expect(saveRouteModel.getRouteStatusByRouteId).toHaveBeenCalledTimes(2);


            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                success: true,
                message: "Route infos, details and statuses have been gotten",
                routeInfos: mockRouteInfos,
                routeDetails: [mockRouteDetails1, mockRouteDetails2],
                routeStatus: [mockRouteStatus1, mockRouteStatus2]
            });
        });

        test('should handle errors and return 400 status', async () => {

            const error = new Error('Failed to get routes');
            saveRouteModel.getRouteByOrderId.mockRejectedValue(error);


            await getRoute(req, res);


            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                success: false,
                message: "Route infos, details and statuses were unable to be gotten"
            }));
        });
    });
});