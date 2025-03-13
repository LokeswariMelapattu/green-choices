const graph = require('../data/routes.json');
const { CONFIG } = require('../utils/constants');


const findAllRoutes = (source, destination, maxRoutes = CONFIG.MAX_ROUTES, visited = new Set(), path = []) => {
    if (source === destination && path.length > 0) {
        return [path];
    }

    if (!graph[source] || visited.has(source)) {
        return [];
    }

    let routes = [];
    visited.add(source);

    for (const route of graph[source]) {
        if (visited.has(route.destination)) {
            continue;
        }

        const newPath = [...path, { source, ...route }];

        if (route.destination === destination) {
            routes.push(newPath);
            if (routes.length >= maxRoutes) {
                break;
            }
            continue;
        }

        const newRoutes = findAllRoutes(
            route.destination,
            destination,
            maxRoutes - routes.length,
            new Set(visited),
            newPath
        );

        routes = [...routes, ...newRoutes];
        if (routes.length >= maxRoutes) {
            break;
        }
    }

    visited.delete(source);
    return routes;
};

const calculateRouteMetrics = (route) => {
    return route.reduce((metrics, segment) => {
        const minCost = Math.min(...segment.cost);
        const maxCost = Math.max(...segment.cost);
        const minDuration = Math.min(...segment.duration);
        const maxDuration = Math.max(...segment.duration);
        const minDistance = Math.min(...segment.distance);
        const maxDistance = Math.max(...segment.distance);
        const minCarbon = Math.min(...segment.carbon_emission);
        const maxCarbon = Math.max(...segment.carbon_emission);

        return {
            minCost: metrics.minCost + minCost,
            maxCost: metrics.maxCost + maxCost,
            minDuration: metrics.minDuration + minDuration,
            maxDuration: metrics.maxDuration + maxDuration,
            minDistance: metrics.minDistance + minDistance,
            maxDistance: metrics.maxDistance + maxDistance,
            minCarbonEmissions: metrics.minCarbonEmissions + minCarbon,
            maxCarbonEmissions: metrics.maxCarbonEmissions + maxCarbon
        };
    }, {
        minCost: 0, maxCost: 0,
        minDuration: 0, maxDuration: 0,
        minDistance: 0, maxDistance: 0,
        minCarbonEmissions: 0, maxCarbonEmissions: 0
    });
};

const validateCity = (city) => {
    return Boolean(graph[city]);
};

const getRouteEmissionReasons = (metrics) => {
    minRouteReasons = [];
    maxRouteReasons = [];

    if (metrics.minDistance > CONFIG.MAX_DISTANCE && metrics.minCarbonEmissions > CONFIG.MAX_EMISSIONS_DISTANCE) {
        minRouteReasons.push("Long distance routes aren't feasible to have low carbon emissions")
    }

    if (metrics.maxDistance > CONFIG.MAX_DISTANCE && metrics.maxCarbonEmissions > CONFIG.MAX_EMISSIONS_DISTANCE) {
        maxRouteReasons.push("Long distance routes aren't feasible to have low carbon emissions")
    }

    if (metrics.minDuration < CONFIG.MIN_DURATION && metrics.minCarbonEmissions > CONFIG.MAX_EMISSIONS_DURATION) {
        minRouteReasons.push("Fast transport methods cause more emissions than slow ones")
    }

    if (metrics.maxDuration < CONFIG.MIN_DURATION && metrics.maxCarbonEmissions > CONFIG.MAX_EMISSIONS_DURATION) {
        maxRouteReasons.push("Fast transport methods cause more emissions than slow ones")
    }

    // If the emissions are high but the other options aren't the reason, then gives this reason
    // Could be changed later if someone gets an idea for this
    if (minRouteReasons.length === 0 && metrics.minCarbonEmissions > CONFIG.MAX_EMISSIONS) {
        minRouteReasons.push("Emissions for this route are high for due undefined reasons")
    }

    if (maxRouteReasons.length === 0 && metrics.maxCarbonEmissions > CONFIG.MAX_EMISSIONS) {
        maxRouteReasons.push("Emissions for this route are high for due undefined reasons")
    }

    return {
        minRouteReasons: minRouteReasons,
        maxRouteReasons: maxRouteReasons
    };
}

module.exports = {
    findAllRoutes,
    calculateRouteMetrics,
    validateCity,
    getRouteEmissionReasons
};