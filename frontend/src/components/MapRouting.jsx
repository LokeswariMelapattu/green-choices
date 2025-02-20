import { useMap } from "react-leaflet";
import L from "leaflet";
import { useEffect } from "react";
import { mockMarineRoute, mockAirRouteToUSA, mockMarineRouteToUSA } from "../data/routes";


const MapRouting = ({ routes }) => {
    const map = useMap(); // Access the map instance using the useMap hook
    //map.setView([60.1695, 24.9354], 3);

    useEffect(() => {
        if (!map || !routes || routes.routes.length === 0) return;
    
        let allBounds = [];
        let maxCarbonRouteIndex = 0;
        let maxCarbonSum = 0;
        let minCarbonSum = Infinity;

        let routeCarbonSums = [];

        routes.routes.forEach((route, routeIndex) => {
            let totalCarbon = route.segments.reduce((sum, segment) => sum + (segment.carbonEmissions[0] || 0), 0);
            routeCarbonSums[routeIndex] = totalCarbon;
        
            if (totalCarbon < minCarbonSum) minCarbonSum = totalCarbon;
            if (totalCarbon > maxCarbonSum) maxCarbonSum = totalCarbon;
        });

        routes.routes.forEach((route, routeIndex) => {
            if(routeIndex < 4){
                let totalCarbon = routeCarbonSums[routeIndex];
                console.log(totalCarbon);
                let color = "yellow"; // Default for middle carbon routes

                if (totalCarbon === minCarbonSum) color = "green"; // Least carbon emission
                else if (totalCarbon === maxCarbonSum) color = "red"; // Highest carbon emission

            route.segments.forEach((segment, segmentIndex) => {
                let fromCoords = segment.fromGeoLocation;
                let toCoords = segment.toGeoLocation;
    
                // Skip if coordinates are missing
                if (!fromCoords || !toCoords) return;

                // Create polyline
                let polyline = L.polyline([fromCoords, toCoords], {
                    color: color,
                    weight: 3,
                    opacity: 0.7,
                    dashArray: segment.transportModes.includes("sea") ? "4, 6" : null, // Dashed for sea routes
                }).addTo(map);
    
                // Store bounds for fitting map
                allBounds.push(fromCoords, toCoords);
    
                // Add popup with segment details
                let popup = L.popup().setContent(`
                    <b>Route ${routeIndex + 1} - Segment ${segmentIndex + 1}</b><br>
                    <b>From:</b> ${segment.from} <br>
                    <b>To:</b> ${segment.to} <br>
                    <b>Distance:</b> ${segment.distances[0]} km<br>
                    <b>Duration:</b> ${segment.durations[0]} hrs<br>
                    <b>Cost:</b> $${segment.costs[0]}
                `);
        
                // Show popup on hover
                polyline.on("mouseover", function (e) {
                    popup.setLatLng(e.latlng).openOn(map);
                });
        
                // Hide popup when mouse leaves
                polyline.on("mouseout", function () {
                    map.closePopup(popup);
                });
            });
        }
        });

        
        // Fit map to include all route segments
        if (allBounds.length > 0) {
            map.fitBounds(allBounds, { padding: [50, 50] });
        }
    
    }, [map, routes]); // Dependency array ensures re-render when data changes


    return null;
};

export default MapRouting;