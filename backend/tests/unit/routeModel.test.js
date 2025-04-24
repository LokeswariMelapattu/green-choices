const routeModel = require('../../models/routeModel');
const { CONFIG } = require('../../utils/constants');
const routes = require('../../data/routes.json');

jest.mock('../../data/routes.json', () => ({
    'New York, USA': [
        {
            destination: 'London, UK',
            mode: ['sea', 'plane'],
            fuel_type: ['Diesel', 'Jet Fuel'],
            cost: [59, 169],
            duration: [7, 3],
            distance: [5600, 5500],
            carbon_emission: [50, 143],
            destination_geo_location: [51.5074, -0.1278],
            source_geo_location: [40.7128, -74.006],
            emission_reason: ['', 'Long distance air travel causes a lot of emissions']
        },
        {
            destination: 'Paris, France',
            mode: ['sea', 'plane'],
            fuel_type: ['Natural Gas', 'Jet Fuel'],
            cost: [49, 149],
            duration: [12, 6],
            distance: [5900, 5800],
            carbon_emission: [38, 150],
            destination_geo_location: [48.8566, 2.3522],
            source_geo_location: [40.7128, -74.006],
            emission_reason: ['', 'Long distance air travel causes a lot of emissions']
        }
    ],
    'London, UK': [
        {
            destination: 'Paris, France',
            mode: ['road', 'plane'],
            fuel_type: ['Diesel', 'Jet Fuel'],
            cost: [50, 120],
            duration: [5, 1],
            distance: [400, 350],
            carbon_emission: [6, 16],
            destination_geo_location: [48.8566, 2.3522],
            source_geo_location: [51.5074, -0.1278],
            emission_reason: ['', 'For shorter flights, taking off causes the most emissions']
        }
    ],
    'Paris, France': [
        {
            destination: 'Rome, Italy',
            mode: ['road', 'plane'],
            fuel_type: ['Diesel', 'Jet Fuel'],
            cost: [80, 150],
            duration: [12, 2],
            distance: [1400, 1200],
            carbon_emission: [21, 39],
            destination_geo_location: [41.9028, 12.4964],
            source_geo_location: [48.8566, 2.3522],
            emission_reason: ['', 'For shorter flights, taking off causes the most emissions']
        }
    ],

    'EmptyCity, Test': []
}));

jest.mock('../../utils/constants', () => ({
    CONFIG: {
        MAX_ROUTES: 5,
        MIN_ROUTES: 1,
        MAX_EMISSIONS: 250,
        MAX_DISTANCE: 1500,
        MAX_EMISSIONS_DISTANCE: 250,
        MIN_DURATION: 10,
        MAX_EMISSIONS_DURATION: 200
    },
    ERROR_MESSAGES: {

    }
}));

describe('Route Model', () => {
    describe('validateCity', () => {
        test('should return true for valid cities', () => {
            expect(routeModel.validateCity('New York, USA')).toBe(true);
            expect(routeModel.validateCity('London, UK')).toBe(true);
            expect(routeModel.validateCity('Paris, France')).toBe(true);
        });

        test('should return false for invalid cities', () => {
            expect(routeModel.validateCity('Invalid City')).toBe(false);
            expect(routeModel.validateCity('')).toBe(false);
            expect(routeModel.validateCity(null)).toBe(false);
            expect(routeModel.validateCity(undefined)).toBe(false);
        });

        test('should return true for cities with no routes', () => {
            expect(routeModel.validateCity('EmptyCity, Test')).toBe(true);
        });
    });

    describe('findAllRoutes', () => {
        test('should find direct route between cities', () => {
            const routes = routeModel.findAllRoutes('New York, USA', 'London, UK');

            expect(routes).toHaveLength(1);
            expect(routes[0][0].source).toBe('New York, USA');
            expect(routes[0][0].destination).toBe('London, UK');
        });

        test('should find multi-segment routes', () => {
            const routes = routeModel.findAllRoutes('New York, USA', 'Rome, Italy');

            expect(routes.length).toBeGreaterThan(0);


            const firstRoute = routes[0];
            expect(firstRoute.length).toBeGreaterThan(1);


            expect(firstRoute[0].source).toBe('New York, USA');


            const lastSegment = firstRoute[firstRoute.length - 1];
            expect(lastSegment.destination).toBe('Rome, Italy');
        });

        test('should respect maxRoutes parameter', () => {
            const maxRoutes = 1;
            const routes = routeModel.findAllRoutes('New York, USA', 'Rome, Italy', maxRoutes);

            expect(routes.length).toBeLessThanOrEqual(maxRoutes);
        });

        test('should return empty array when no routes exist', () => {
            const routes = routeModel.findAllRoutes('New York, USA', 'NonExistentCity');

            expect(routes).toEqual([]);
        });

        test('should return empty array when source city has no routes', () => {
            const routes = routeModel.findAllRoutes('EmptyCity, Test', 'London, UK');

            expect(routes).toEqual([]);
        });

        test('should not enter infinite loop with cyclic routes', () => {

            const routes = routeModel.findAllRoutes('London, UK', 'Paris, France');

            expect(routes.length).toBeGreaterThan(0);
            expect(() => routeModel.findAllRoutes('London, UK', 'Paris, France')).not.toThrow();
        });
    });

    describe('calculateRouteMetrics', () => {
        test('should calculate metrics for a route correctly', () => {
            const testRoute = [
                {
                    source: 'New York, USA',
                    destination: 'London, UK',
                    cost: [59, 169],
                    duration: [7, 3],
                    distance: [5600, 5500],
                    carbon_emission: [50, 143]
                }
            ];

            const metrics = routeModel.calculateRouteMetrics(testRoute);

            expect(metrics).toEqual({
                minCost: 59,
                maxCost: 169,
                minDuration: 3,
                maxDuration: 7,
                minDistance: 5500,
                maxDistance: 5600,
                minCarbonEmissions: 50,
                maxCarbonEmissions: 143
            });
        });

        test('should sum metrics for multi-segment routes', () => {
            const testRoute = [
                {
                    source: 'New York, USA',
                    destination: 'London, UK',
                    cost: [59, 169],
                    duration: [7, 3],
                    distance: [5600, 5500],
                    carbon_emission: [50, 143]
                },
                {
                    source: 'London, UK',
                    destination: 'Paris, France',
                    cost: [50, 120],
                    duration: [5, 1],
                    distance: [400, 350],
                    carbon_emission: [6, 16]
                }
            ];

            const metrics = routeModel.calculateRouteMetrics(testRoute);

            expect(metrics).toEqual({
                minCost: 109, // 59 + 50
                maxCost: 289, // 169 + 120
                minDuration: 4, // 3 + 1
                maxDuration: 12, // 7 + 5
                minDistance: 5850, // 5500 + 350
                maxDistance: 6000, // 5600 + 400
                minCarbonEmissions: 56, // 50 + 6
                maxCarbonEmissions: 159 // 143 + 16
            });
        });

        test('should handle empty routes', () => {
            const metrics = routeModel.calculateRouteMetrics([]);

            expect(metrics).toEqual({
                minCost: 0,
                maxCost: 0,
                minDuration: 0,
                maxDuration: 0,
                minDistance: 0,
                maxDistance: 0,
                minCarbonEmissions: 0,
                maxCarbonEmissions: 0
            });
        });
    });

    describe('getRouteEmissionReasons', () => {
        test('should return reasons for high emissions due to long distance', () => {
            const metrics = {
                minCarbonEmissions: 300,
                maxCarbonEmissions: 400,
                minDistance: 2000,
                maxDistance: 2500,
                minDuration: 15,
                maxDuration: 20
            };

            const reasons = routeModel.getRouteEmissionReasons(metrics);

            expect(reasons.minRouteReasons).toContain("Long distance routes aren't feasible to have low carbon emissions");
            expect(reasons.maxRouteReasons).toContain("Long distance routes aren't feasible to have low carbon emissions");
        });

        test('should return reasons for high emissions due to fast transport', () => {
            const metrics = {
                minCarbonEmissions: 300,
                maxCarbonEmissions: 400,
                minDistance: 1000,
                maxDistance: 1200,
                minDuration: 5,
                maxDuration: 8
            };

            const reasons = routeModel.getRouteEmissionReasons(metrics);

            expect(reasons.minRouteReasons).toContain("Fast transport methods cause more emissions than slow ones");
            expect(reasons.maxRouteReasons).toContain("Fast transport methods cause more emissions than slow ones");
        });

        test('should return default reason for high emissions when no specific cause', () => {
            const metrics = {
                minCarbonEmissions: 300,
                maxCarbonEmissions: 400,
                minDistance: 1000,
                maxDistance: 1200,
                minDuration: 15,
                maxDuration: 20
            };

            const reasons = routeModel.getRouteEmissionReasons(metrics);


            expect(reasons.minRouteReasons).toContain("Emissions for this route are high for due undefined reasons");
            expect(reasons.maxRouteReasons).toContain("Emissions for this route are high for due undefined reasons");
        });

        test('should return empty arrays for low emissions', () => {
            const metrics = {
                minCarbonEmissions: 50,
                maxCarbonEmissions: 100,
                minDistance: 1000,
                maxDistance: 1200,
                minDuration: 15,
                maxDuration: 20
            };

            const reasons = routeModel.getRouteEmissionReasons(metrics);

            expect(reasons.minRouteReasons).toEqual([]);
            expect(reasons.maxRouteReasons).toEqual([]);
        });

        test('should handle edge cases correctly', () => {
            // Test exactly at the threshold
            const metrics = {
                minCarbonEmissions: CONFIG.MAX_EMISSIONS,
                maxCarbonEmissions: CONFIG.MAX_EMISSIONS,
                minDistance: CONFIG.MAX_DISTANCE,
                maxDistance: CONFIG.MAX_DISTANCE,
                minDuration: CONFIG.MIN_DURATION,
                maxDuration: CONFIG.MIN_DURATION
            };

            const reasons = routeModel.getRouteEmissionReasons(metrics);

            expect(reasons.minRouteReasons).toEqual([]);
            expect(reasons.maxRouteReasons).toEqual([]);
        });
    });
});