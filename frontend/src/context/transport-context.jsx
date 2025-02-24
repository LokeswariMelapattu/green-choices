import { createContext, useContext, useState, useEffect } from 'react';

const TransportContext = createContext();

export const TransportProvider = ({ children }) => {
  const [selectedModes, setSelectedModes] = useState([]);
  const [routeTotals, setRouteTotals] = useState(null);
  const [currentRoute, setCurrentRoute] = useState(null);

  const calculateTotals = (route, modes) => {
    if (!route || !modes) return null;
    
    return route.segments.reduce((acc, segment, index) => {
      const modeIndex = segment.transportModes.indexOf(modes[index]);
      acc.duration += segment.durations[modeIndex];
      acc.cost += segment.costs[modeIndex];
      acc.emissions += segment.carbonEmissions[modeIndex];
      return acc;
    }, { duration: 0, cost: 0, emissions: 0 });
  };

  useEffect(() => {
    if (currentRoute && selectedModes.length) {
      setRouteTotals(calculateTotals(currentRoute, selectedModes));
    }
  }, [currentRoute, selectedModes]);

  return (
    <TransportContext.Provider value={{
      selectedModes,
      setSelectedModes,
      routeTotals,
      setCurrentRoute,
      calculateTotals
    }}>
      {children}
    </TransportContext.Provider>
  );
};

export const useTransport = () => {
  const context = useContext(TransportContext);
  if (!context) {
    throw new Error('useTransport must be used within a TransportProvider');
  }
  return context;
}; 