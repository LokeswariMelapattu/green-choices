import { Card } from "@/components/ui/Card";
import { Plane, Ship, Timer, DollarSign, Route, Leaf, Truck } from "lucide-react";
import { useMemo, useEffect } from "react";
import { useTransport } from '@/context/transport-context';

// New helper component
const MetricItem = ({ icon: Icon, label, value }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-gray-600">
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </div>
    <p className="font-semibold">{value}</p>
  </div>
);

// New helper component
const TransportIcon = ({ mode, isActive, onClick }) => {
  const Icon = {
    road: Truck,
    sea: Ship,
    plane: Plane
  }[mode];

  return (
    <div
      role="button"
      aria-label={`Select ${mode} transport`}
      className={`p-1 rounded-md ${
        isActive ? 'bg-green-500' : 'hover:bg-gray-300'
      } transition-colors`}
      onClick={onClick}
    >
      <Icon className={`h-4 w-4 ${isActive ? 'text-gray-50' : 'text-gray-500'}`} />
    </div>
  );
};

const RouteDetails = ({ route }) => {
  const { selectedModes, setSelectedModes, setCurrentRoute } = useTransport();

  // Calculate initial modes based on minimum emissions while preserving order
  const initialModes = useMemo(() => 
    route?.segments.map(segment => {
      const minEmission = Math.min(...segment.carbonEmissions);
      return segment.transportModes[segment.carbonEmissions.indexOf(minEmission)];
    }) || []
  , [route]);

  useEffect(() => {
    if (route) {
      setCurrentRoute(route);
      setSelectedModes(initialModes);
    }
  }, [route, setCurrentRoute, setSelectedModes, initialModes]);

  if (!route) return null;
  console.log(route);

  const handleToggle = (index) => {
    setSelectedModes(prevModes => {
      const newModes = [...prevModes];
      const segment = route.segments[index];
      const currentIndex = segment.transportModes.indexOf(newModes[index]);
      const nextIndex = (currentIndex + 1) % segment.transportModes.length;
      newModes[index] = segment.transportModes[nextIndex];
      return newModes;
    });
  };

  return (
    <Card className="p-6 bg-white/70 backdrop-blur-lg">
      <h2 className="text-xl font-semibold mb-4">Route {route.routeNumber} Details</h2>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricItem
            icon={Timer}
            label="Duration"
            value={`${route.metrics.duration.minimum}-${route.metrics.duration.maximum} days`}
          />
          <MetricItem
            icon={DollarSign}
            label="Cost"
            value={`$${route.metrics.cost.minimum}-${route.metrics.cost.maximum}`}
          />
          <MetricItem
            icon={Route}
            label="Distance"
            value={`${route.metrics.distance.minimum} km`}
          />
          <MetricItem
            icon={Leaf}
            label="Emissions"
            value={`${route.metrics.carbonEmissions.minimum}-${route.metrics.carbonEmissions.maximum} kg`}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium">Route Segments</h3>
          {route.segments.map((segment, index) => {
            const modeIndex = segment.transportModes.indexOf(selectedModes[index]);
            
            return (
              <Card key={segment.id} className="p-4 border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">{segment.from} → {segment.to}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>{segment.distances[modeIndex]} km</span>
                      <span>•</span>
                      <span>{segment.durations[modeIndex]} days</span>
                    </div>
                  </div>
                  <div className="flex gap-2 bg-gray-200 py-1 px-2 rounded-lg">
                    {segment.transportModes.map((mode) => (
                      <TransportIcon
                        key={mode}
                        mode={mode}
                        isActive={selectedModes[index] === mode}
                        onClick={() => handleToggle(index)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Cost Range:</span>
                    <p className="font-medium">${segment.costs[modeIndex]}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Emissions:</span>
                    <p className="font-medium">{segment.carbonEmissions[modeIndex]} kg</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

export default RouteDetails;
