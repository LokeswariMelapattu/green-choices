const CONFIG = {
    MAX_ROUTES: 5,
    MIN_ROUTES: 1,
};

const ERROR_MESSAGES = {
    sourceDestinationRequired: "Both source and destination are required",
    sourceCityNotFound: "Source city not found in the database",
    noRoutesFound: "No routes found between the specified cities",
    notEnoughRoutes: "Unable to find the minimum distinct routes between the specified cities",
    routeNotReceived: "Didn't receive a route",
    routeNotSaved: "Unable to save route"
};

module.exports = {
    CONFIG,
    ERROR_MESSAGES,
};
