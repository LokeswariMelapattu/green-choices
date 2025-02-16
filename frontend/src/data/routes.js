


export const mockMarineRoute = {
    name: "Mock Marine Route",
    color: "blue",
    waypoints: [
        [31.2304, 121.4737], // Shanghai, China
        [20.5937, 105.8973], // Vietnam Coast
        [2.7500, 101.7000],  // Near Malaysia
        [12.9716, 80.1494],  // Chennai, India
        [20.2961, 85.8245],  // Bay of Bengal
        [30.3753, 69.3451],  // Near Middle East
        [60.1695, 24.9354],  // Helsinki, Finland
    ],
};
export const mockMarineRouteToUSA = {
    name: "Mock Marine Route",
    color: "blue", waypoints: [
        [60.1695, 24.9354],  // Helsinki, Finland
        [59.172871, 21.498893],
        [55.527238, 16.096304],
        [50.587251, -1.554601],
        [50.785911, -33.851328],
        [37.192101, -75.659389],
        [36.905781, -76.245785]
    ]
};

export const mockAirRouteToUSA = {
    name: "Mock Air Route",
    color: "blue", waypoints: [
        [60.1695, 24.9354],  // Helsinki, Finland
        [51.50425, -0.13186],
        [38.89511, -77.03637],
    ]
};

export const USA = [
    {
        name: "Air Route",
        color: "red",
        coordinates: [
            [60.1695, 24.9354],  // Helsinki, Finland
            [51.50425, -0.13186],
            [38.837016, -76.997333],
            [37.192101, -75.659389],
        ]
    },
    {
        name: "Sea Route",
        color: "blue",
        coordinates: [
            [60.1695, 24.9354],  // Helsinki, Finland
            [59.172871, 21.498893],
            [55.527238, 16.096304],
            [50.587251, -1.554601],
            [50.785911, -33.851328],
            [37.192101, -75.659389],
        ]
    }
];


export const China = [
    {
        name: "Sea Route",
        color: "blue",
        coordinates: [
            [31.2304, 121.4737], // Shanghai, China
            [22.3193, 114.1694], // Hong Kong
            [13.4125, 103.8667], // Singapore
            [30.0444, 31.2357], // Suez Canal
            [60.1695, 24.9354], // Helsinki, Finland
        ],
    },
    {
        name: "Air Route",
        color: "red",
        coordinates: [
            [31.2304, 121.4737], // Shanghai
            [55.7558, 37.6173], // Moscow, Russia
            [60.1695, 24.9354], // Helsinki, Finland
        ],
    },
];

export default (USA, China, mockMarineRoute, mockMarineRouteToUSA);