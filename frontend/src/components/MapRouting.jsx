import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { mockMarineRoute, mockAirRouteToUSA, mockMarineRouteToUSA } from "../data/routes";


const MapRouting = ({ waypoints, routeType }) => {
    const map = useMap(); // Access the map instance using the useMap hook
    map.setView([60.1695, 24.9354], 3);


    useEffect(() => {
        if (!map) return;

        const createRoute = (waypoints, color) => ({
            waypoints,
            // routeWhileDragging: true,
            show: true,
            // addWaypoints: true,
            // draggableWaypoints: true,
            fitSelectedRoutes: true,
            lineOptions: {
                styles: [{ color, opacity: 1, weight: 5 }],
            },
            createMarker: () => null
        });

        // const routes = [
        //     createRoute(waypoints, "#0078A8"), // Default user waypoints
        //     createRoute([[61.498419, 23.775704], [60.307239, 24.964993]], "#fc4f4f"), // Airport A
        //     createRoute([[38.837016, -76.997333], [37.553091, -77.476253]], "#fc4f4f"), // Airport B
        //     createRoute([[36.905781, -76.245785], [37.553091, -77.476253]], "#0078A8"), // Sea B
        // ];

        let seapolyline = L.polyline(mockMarineRouteToUSA.waypoints, {
            color: "#26b509",
            weight: 3,
            opacity: 0.7,
            dashArray: "2, 5",
        }).addTo(map);

        let airpolyline = L.polyline(mockAirRouteToUSA.waypoints, {
            color: "red",
            weight: 3,
            opacity: 0.7,
        }).addTo(map);

        let roadpolyline1 = L.polyline([
            [61.498419, 23.775704],  // Tampere
            [60.170054, 24.941279]   // Helsinki
        ], { 
            color: "#0078A8", // Line color
            weight: 3,        // Line thickness
            opacity: 0.7      // Line opacity
        }).addTo(map);

        let roadpolyline2 = L.polyline([
            [38.89511, -77.03637],  // Washington, D.C.
            [37.553091, -77.476253]   // Richmond, VA
        ], { 
            color: "#0078A8", // Line color
            weight: 3,        // Line thickness
            opacity: 0.7      // Line opacity
        }).addTo(map);

        let roadpolyline = L.polyline([
            [36.905781, -76.245785],  // Norfolk, VA
            [37.553091, -77.476253]   // Richmond, VA
        ], { 
            color: "#0078A8", // Line color
            weight: 3,        // Line thickness
            opacity: 0.7      // Line opacity
        }).addTo(map);

        airpolyline.on("click", function (e) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`<b>Air Route Details</b><br>Distance: 5000 km<br>Estimated Time: 2 days`)
                .openOn(map);
        });

        seapolyline.on("click", function (e) {
            L.popup()
                .setLatLng(e.latlng)
                .setContent(`<b>Sea Route Details</b><br>Distance: 5000 km<br>Estimated Time: 10 days`)
                .openOn(map);
        });

        const bounds = [
            [61.498419, 23.775704],  // Tampere, Finland
            [37.553091, -77.476253]  // Richmond, VA
        ];

        if (map && bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }

        // L.Routing.control(routingAirportA).addTo(map);
        // L.Routing.control(routingOptions).addTo(map);
        // L.Routing.control(routingAirportB).addTo(map);
        // L.Routing.control(routingSeaB).addTo(map);

        //routes.forEach(route => L.Routing.control(route).addTo(map));

        // return () => {
        //     map.removeControl(routingControl);
        // };
    }, [map, waypoints, routeType]);

    return null;
};

export default MapRouting;