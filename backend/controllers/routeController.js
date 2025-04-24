const { findAllRoutes, calculateRouteMetrics, validateCity, getRouteEmissionReasons } = require('../models/routeModel');
const { CONFIG, ERROR_MESSAGES } = require('../utils/constants');

const formatRoutes = (routes) => {
    return routes.map((route, index) => {
        const metrics = calculateRouteMetrics(route);
        const routeEmissionReasons = getRouteEmissionReasons(metrics);
        return {
            routeNumber: index + 1,
            segments: route.map(segment => ({
                from: segment.source,
                to: segment.destination,
                fromGeoLocation: segment.source_geo_location || null,
                toGeoLocation: segment.destination_geo_location || null,
                transportModes: segment.mode,
                fuel_types: segment.fuel_type,
                costs: segment.cost,
                durations: segment.duration,
                distances: segment.distance,
                carbonEmissions: segment.carbon_emission,
                emissionReasons: segment.emission_reason
            })),
            metrics: {
                cost: {
                    minimum: metrics.minCost,
                    maximum: metrics.maxCost
                },
                duration: {
                    minimum: metrics.minDuration,
                    maximum: metrics.maxDuration
                },
                distance: {
                    minimum: metrics.minDistance,
                    maximum: metrics.maxDistance
                },
                carbonEmissions: {
                    minimum: metrics.minCarbonEmissions,
                    maximum: metrics.maxCarbonEmissions
                }
            },
            routeEmissionReasons: {
                minimum: routeEmissionReasons.minRouteReasons,
                maximum: routeEmissionReasons.maxRouteReasons
            }
        };
    });
};

const findRoutes = (req, res) => {
    try {
        const { sourceCity, destinationCity, sourceCountry, destinationCountry } = req.query;

        // Check if any required parameters are missing
        if (!sourceCity || !destinationCity || !sourceCountry || !destinationCountry) {
            return res.status(400).json({
                error: ERROR_MESSAGES.sourceDestinationRequired
            });
        }

        const source = sourceCity + ', ' + sourceCountry;
        const destination = destinationCity + ', ' + destinationCountry;

        if (!validateCity(source)) {
            return res.status(404).json({
                error: ERROR_MESSAGES.sourceCityNotFound
            });
        }

        const routes = findAllRoutes(source, destination);

        if (routes.length === 0) {
            return res.status(404).json({
                error: ERROR_MESSAGES.noRoutesFound
            });
        }

        if (routes.length < CONFIG.MIN_ROUTES) {
            return res.status(404).json({
                error: ERROR_MESSAGES.notEnoughRoutes
            });
        }

        const formattedRoutes = formatRoutes(routes);
        formattedRoutes.sort((a, b) => a.metrics.carbonEmissions.minimum - b.metrics.carbonEmissions.minimum);
        formattedRoutes.forEach((route, index) => {
            route.routeNumber = index + 1;
        });
        return res.json({
            source,
            destination,
            routesFound: routes.length,
            routes: formattedRoutes
        });
    } catch (error) {
        console.error('Route Controller Error:', error);
        return res.status(500).json({
            error: "An internal server error occurred"
        });
    }
};

module.exports = {
    findRoutes
};
