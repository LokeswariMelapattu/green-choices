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

    if (metrics.minDistance > 10000 && metrics.minCarbonEmissions > 250) {
        minRouteReasons.push("Long distance routes aren't feasible to have low carbon emissions")
    }

    if (metrics.maxDistance > 10000 && metrics.maxCarbonEmissions > 250) {
        maxRouteReasons.push("Long distance routes aren't feasible to have low carbon emissions")
    }

    if (metrics.minDuration < 32 && metrics.minCarbonEmissions > 200) {
        minRouteReasons.push("Fast transport methods cause more emissions than slow ones")
    }

    if (metrics.maxDuration < 32 && metrics.maxCarbonEmissions > 200) {
        maxRouteReasons.push("Fast transport methods cause more emissions than slow ones")
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