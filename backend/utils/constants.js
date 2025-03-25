const CONFIG = {
    MAX_ROUTES: 5,
    MIN_ROUTES: 1,
    MAX_EMISSIONS: 250,
    MAX_DISTANCE: 10000,
    MAX_EMISSIONS_DISTANCE: 250,
    MIN_DURATION: 32,
    MAX_EMISSIONS_DURATION: 200
};

const ERROR_MESSAGES = {
    sourceDestinationRequired: "Both source and destination are required",
    sourceCityNotFound: "Source city not found in the database",
    noRoutesFound: "No routes found between the specified cities",
    notEnoughRoutes: "Unable to find the minimum distinct routes between the specified cities",
    routeNotReceived: "Didn't receive a route",
    routeNotSaved: "Unable to save route info, details or status",
    routeNotUpdated: "Unable to update route info, details or status"
};

module.exports = {
    CONFIG,
    ERROR_MESSAGES,
};
