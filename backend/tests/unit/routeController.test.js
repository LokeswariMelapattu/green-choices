const { findRoutes } = require('../../controllers/routeController');
const routeModel = require('../../models/routeModel');
const { CONFIG, ERROR_MESSAGES } = require('../../utils/constants');


jest.mock('../../models/routeModel');

describe('Route Controller', () => {
    let req;
    let res;

    beforeEach(() => {

        jest.clearAllMocks();


        req = {
            query: {
                sourceCity: 'New York',
                destinationCity: 'Los Angeles',
                sourceCountry: 'USA',
                destinationCountry: 'USA'
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };


        routeModel.validateCity.mockReturnValue(true);
        routeModel.findAllRoutes.mockReturnValue([
            [
                {
                    source: 'New York, USA',
                    destination: 'Los Angeles, USA',
                    mode: ['road', 'plane'],
                    fuel_type: ['Gasoline', 'Jet Fuel'],
                    cost: [1000, 500],
                    duration: [72, 6],
                    distance: [4500, 3900],
                    carbon_emission: [350, 650],
                    emission_reason: ['Long distance', 'Fast transport']
                }
            ]
        ]);
        routeModel.calculateRouteMetrics.mockReturnValue({
            minCost: 500,
            maxCost: 1000,
            minDuration: 6,
            maxDuration: 72,
            minDistance: 3900,
            maxDistance: 4500,
            minCarbonEmissions: 350,
            maxCarbonEmissions: 650
        });
        routeModel.getRouteEmissionReasons.mockReturnValue({
            minRouteReasons: ['Test reason min'],
            maxRouteReasons: ['Test reason max']
        });
    });

    describe('findRoutes', () => {
        test('should find routes and return formatted data', () => {

            findRoutes(req, res);


            expect(routeModel.validateCity).toHaveBeenCalledWith('New York, USA');


            expect(routeModel.findAllRoutes).toHaveBeenCalledWith('New York, USA', 'Los Angeles, USA');


            expect(routeModel.calculateRouteMetrics).toHaveBeenCalled();


            expect(routeModel.getRouteEmissionReasons).toHaveBeenCalled();


            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
                source: 'New York, USA',
                destination: 'Los Angeles, USA',
                routesFound: 1,
                routes: expect.arrayContaining([
                    expect.objectContaining({
                        routeNumber: expect.any(Number),
                        segments: expect.arrayContaining([
                            expect.objectContaining({
                                from: expect.any(String),
                                to: expect.any(String),
                                transportModes: expect.any(Array),
                                costs: expect.any(Array),
                                durations: expect.any(Array),
                                distances: expect.any(Array),
                                carbonEmissions: expect.any(Array)
                            })
                        ]),
                        metrics: expect.objectContaining({
                            cost: expect.objectContaining({
                                minimum: expect.any(Number),
                                maximum: expect.any(Number)
                            }),
                            duration: expect.objectContaining({
                                minimum: expect.any(Number),
                                maximum: expect.any(Number)
                            }),
                            distance: expect.objectContaining({
                                minimum: expect.any(Number),
                                maximum: expect.any(Number)
                            }),
                            carbonEmissions: expect.objectContaining({
                                minimum: expect.any(Number),
                                maximum: expect.any(Number)
                            })
                        }),
                        routeEmissionReasons: expect.objectContaining({
                            minimum: expect.any(Array),
                            maximum: expect.any(Array)
                        })
                    })
                ])
            }));
        });

        test('should return error if source or destination is missing', () => {

            req.query = {

                destinationCity: 'Los Angeles',
                sourceCountry: 'USA',
                destinationCountry: 'USA'
            };


            findRoutes(req, res);


            expect(res.status).toHaveBeenCalledWith(400);


            expect(res.json).toHaveBeenCalledWith({
                error: ERROR_MESSAGES.sourceDestinationRequired
            });
        });

        test('should return error if source city is not valid', () => {

            routeModel.validateCity.mockReturnValue(false);


            findRoutes(req, res);


            expect(res.status).toHaveBeenCalledWith(404);


            expect(res.json).toHaveBeenCalledWith({
                error: ERROR_MESSAGES.sourceCityNotFound
            });
        });

        test('should return error if no routes are found', () => {

            routeModel.findAllRoutes.mockReturnValue([]);


            findRoutes(req, res);


            expect(res.status).toHaveBeenCalledWith(404);


            expect(res.json).toHaveBeenCalledWith({
                error: ERROR_MESSAGES.noRoutesFound
            });
        });

        test('should return error if not enough routes are found', () => {

            routeModel.findAllRoutes.mockReturnValue([[]]);


            CONFIG.MIN_ROUTES = 2;


            findRoutes(req, res);


            expect(res.status).toHaveBeenCalledWith(404);


            expect(res.json).toHaveBeenCalledWith({
                error: ERROR_MESSAGES.notEnoughRoutes
            });
        });

        test('should handle unexpected errors', () => {

            routeModel.findAllRoutes.mockImplementation(() => {
                throw new Error('Test error');
            });


            findRoutes(req, res);


            expect(res.status).toHaveBeenCalledWith(500);


            expect(res.json).toHaveBeenCalledWith({
                error: "An internal server error occurred"
            });
        });
    });
});