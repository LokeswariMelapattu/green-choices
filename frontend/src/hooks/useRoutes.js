import { useState, useEffect } from 'react';
import { VITE_APP_API_URL } from '../data/constants'
const useRoutes = () => {
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [totalEmissions, setTotalEmissions] = useState([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [greenestRoute, setGreenestRoute] = useState(null); 

  useEffect(() => {
    //Default values for source and destination cities and countries please change it after implementation for checkout page and others
    const fetchRoutes = async (sourceCity = "New York", sourceCountry = "USA", destinationCity = "Warsaw", destinationCountry = "Poland") => {
      try {
        const response = await fetch(`${VITE_APP_API_URL}find-routes/?sourceCountry=${sourceCountry}&destinationCountry=${destinationCountry}&sourceCity=${sourceCity}&destinationCity=${destinationCity}`);
        const data = await response.json();
        const rawRoutes = data.routes || [];
        const updatedRoutes = rawRoutes.map(route => ({
          ...route,
          source: `${sourceCity}, ${sourceCountry}`,
          destination: `${destinationCity}, ${destinationCountry}`,
        }));
        data.routes = updatedRoutes;
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
              source: `${sourceCity}, ${sourceCountry}`,
              destination: `${destinationCity}, ${destinationCountry}`,
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
          setGreenestRoute(sortedSegments[0]);
        }
      } catch (error) {
        console.error('Error fetching routes:', error);
      }
      finally {
        setIsLoading(false);
      }
    };
    fetchRoutes();
  }, []);
 
  return { routes, selectedRoute, setSelectedRoute, totalEmissions, greenestRoute,isLoading };
 
};

export default useRoutes; 