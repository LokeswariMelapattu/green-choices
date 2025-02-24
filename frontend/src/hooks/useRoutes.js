import { useState, useEffect } from 'react';

const useRoutes = () => {
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [totalEmissions, setTotalEmissions] = useState([]);

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await fetch('/mock-data.json');
        const data = await response.json();
        setRoutes(data);
        if (data.routes.length > 0) {
          const sortedSegments = data.routes.map(route => {
            const minTotal = route.segments.reduce((total, segment) => {
              const minEmission = Math.min(...segment.carbonEmissions);
              return total + minEmission;
            }, 0);
            return {
              ...route,
              segments: route.segments,
              minTotalEmissions: minTotal
            };
          });
          setTotalEmissions(sortedSegments.map(route => ({
            name: route.routeNumber,
            minTotalEmissions: route.minTotalEmissions
          })));
          setSelectedRoute(sortedSegments[0]);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
    };

    fetchRoutes();
  }, []);

  return { routes, selectedRoute, setSelectedRoute, totalEmissions };
};

export default useRoutes; 