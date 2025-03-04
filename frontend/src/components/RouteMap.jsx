import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const RouteMap = ({ route }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersLayer = useRef(null);
  const routesLayer = useRef(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = L.map(mapContainer.current).setView([20, 0], 2);
    
    // Add base layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map.current);

    // Initialize layer groups
    markersLayer.current = L.layerGroup().addTo(map.current);
    routesLayer.current = L.layerGroup().addTo(map.current);

    return () => map.current?.remove();
  }, []);

  useEffect(() => {
    if (!map.current || !route) return;

    // Clear previous data
    markersLayer.current.clearLayers();
    routesLayer.current.clearLayers();

    // Track unique coordinates with their proper labels
    const seenCoordinates = new Set();
    const pointsWithLabels = [];

    route.segments.forEach(segment => {
        const fromKey = segment.fromGeoLocation.join('-');
        if (!seenCoordinates.has(fromKey)) {
            pointsWithLabels.push({
                coord: segment.fromGeoLocation,
                label: segment.from
            });
            seenCoordinates.add(fromKey);
        }

        const toKey = segment.toGeoLocation.join('-');
        if (!seenCoordinates.has(toKey)) {
            pointsWithLabels.push({
                coord: segment.toGeoLocation,
                label: segment.to
            });
            seenCoordinates.add(toKey);
        }
    });

    // Create markers with proper labels
    pointsWithLabels.forEach(point => {
        const marker = L.marker([point.coord[0], point.coord[1]], {
            title: point.label
        });
        markersLayer.current.addLayer(marker);
    });

    // Create polylines within the routes layer group
    route.segments.forEach((segment) => {
      const segmentLine = L.polyline([
        [segment.fromGeoLocation[0], segment.fromGeoLocation[1]],
        [segment.toGeoLocation[0], segment.toGeoLocation[1]]
      ], {
        color: '#10b981',
        weight: 3,
        opacity: 0.7,
        dashArray: '10, 10',
        lineJoin: 'round'
      }).addTo(routesLayer.current);

      // Store segment data
      segmentLine.segmentData = {
        cost: segment.costs,
        distance: segment.distances,
        emissions: segment.carbonEmissions,
        duration: segment.durations,
        modes: segment.transportModes
      };

      // Smooth hover handlers
      segmentLine.on('mouseover', (e) => {
        const updatePosition = (e) => {
          const pt = e.containerPoint;
          setTooltipPosition({ x: pt.x, y: pt.y });
        };
        
        setTooltipContent(segmentLine.segmentData);
        updatePosition(e);
        setTooltipVisible(true);
        
        // Update position on mouse move
        segmentLine.on('mousemove', updatePosition);
      });

      segmentLine.on('mouseout', () => {
        setTooltipVisible(false);
        segmentLine.off('mousemove');
      });
    });

    // Fit bounds to show all markers and line
    if (pointsWithLabels.length > 0) {
      const bounds = L.latLngBounds(pointsWithLabels.map(point => [point.coord[0], point.coord[1]]));
      map.current.fitBounds(bounds, {
        padding: [50, 50],
        maxZoom: 12
      });
    }
  }, [route]);

  return (
    <div className="relative w-full h-full rounded-lg overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />      
      {tooltipVisible && (
        <div 
          className="absolute bg-white bg-opacity-90 p-3 rounded-lg shadow-lg text-sm z-[1000] transition-transform duration-100"
          style={{
            left: `${tooltipPosition.x + 15}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translateY(-50%)',
            pointerEvents: 'none'
          }}
        >
          <div className="space-y-1">
            <div className="font-medium">Transport Modes:</div>
            <div>{tooltipContent.modes.join(' + ')}</div>
            <div className="grid grid-cols-2 gap-x-4">
              <div>
                <div className="font-medium">Cost:</div>
                <div>${tooltipContent.cost[0].toLocaleString()} - ${tooltipContent.cost[1].toLocaleString()}</div>
              </div>
              <div>
                <div className="font-medium">Distance:</div>
                <div>{tooltipContent.distance[0].toLocaleString()} - {tooltipContent.distance[1].toLocaleString()} km</div>
              </div>
              {tooltipContent.modes.map((mode, index) => (
                <div key={mode}>
                  <div className="font-medium">{mode.charAt(0).toUpperCase() + mode.slice(1)} Duration:</div>
                  <div>{tooltipContent.duration[index].toLocaleString()} days</div>
                </div>
              ))}
              <div>
                <div className="font-medium">Emissions:</div>
                <div>{tooltipContent.emissions[0].toLocaleString()} - {tooltipContent.emissions[1].toLocaleString()} kg</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RouteMap;
