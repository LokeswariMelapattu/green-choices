import { useState, useEffect } from 'react';

const useRoutes = () => {
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [totalEmissions, setTotalEmissions] = useState([]);

  useEffect(() => {
    //Default values for source and destination cities and countries please change it after implementation for checkout page and others
    const fetchRoutes = async (sourceCity = "New York", sourceCountry = "USA", destinationCity = "Warsaw", destinationCountry = "Poland") => {
      try {
        const response = await fetch(`http://localhost:3000/find-routes/?sourceCountry=${sourceCountry}&destinationCountry=${destinationCountry}&sourceCity=${sourceCity}&destinationCity=${destinationCity}`);
        const data = await response.json();
        setRoutes(data);
        if (data.routes.length > 0) {
          const sortedSegments = data.routes.map(route => {
            const minTotal = route.segments.reduce((total, segment) => {
              const minEmission = Math.min(...segment.carbonEmissions);
              return total + minEmission;
            }, 0);
            const maxTotal = route.segments.reduce((total, segment) => {
              const maxEmission = Math.max(...segment.carbonEmissions);
              return total + maxEmission;
            }, 0);
            return {
              ...route,
              segments: route.segments,
              minTotalEmissions: minTotal,
              maxTotalEmissions: maxTotal
            };
          });
          setTotalEmissions(sortedSegments.map(route => ({
            name: route.routeNumber,
            minTotalEmissions: route.minTotalEmissions,
            maxTotalEmissions: route.maxTotalEmissions
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