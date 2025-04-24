import { Card } from "@/components/ui/Card";
import { Plane, Ship, Timer, DollarSign, Route, Leaf, Truck } from "lucide-react";
import { useMemo, useEffect, useState } from "react";
import { useTransport } from '@/context/transport-context';
import { motion } from "framer-motion";
const Switch = ({ checked, onCheckedChange, ariaLabel }) => {
  return (
    <label className="inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onCheckedChange(e.target.checked)}
        aria-label={ariaLabel}
        className="sr-only peer"
      />
      <div class="relative w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-green-300 dark:peer-focus:ring-green-800 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600 dark:peer-checked:bg-green-600"></div>
      <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
        {ariaLabel}
      </span>
    </label>
  );
};
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
const TransportIcon = ({ mode, isActive, onClick, disabled }) => {
  const Icon = {
    road: Truck,
    sea: Ship,
    plane: Plane,
  }[mode];
  return (
    <div
      role="button"
      aria-label={`Select ${mode} transport`}
      className={`p-1 rounded-md ${isActive ? "bg-green-500" : "hover:bg-gray-300"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""} transition-colors`}
      onClick={disabled ? undefined : onClick}
    >
      <Icon
        className={`h-4 w-4 ${isActive ? "text-gray-50" : "text-gray-500"}`}
      />
    </div>
  );
};

const RouteDetails = ({ route, greenestRoute, disableCustomization = false }) => {
  const { selectedModes, setSelectedModes, setCurrentRoute } = useTransport();
  const [key, setKey] = useState(0); // Key to trigger re-animation
  const [showGif, setShowGif] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
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
      setKey(prev => prev + 1); // Change key to trigger animation
      setShowGif(true);
      setTimeout(() => setShowGif(false), 3000); // Hide after 3 seconds
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
    <motion.div
      className="w-full"
      key={key} // Changing key re-triggers animation
      initial={{ opacity: 0, scale: 0.95, y: 5 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 1, ease: "easeOut" }} // Custom cubic bezier for smooth feel
    >
      <Card className="p-6 bg-white/70 backdrop-blur-lg shadow-lg transition-transform w-full" data-testid="routeDetails">

        <div className="flex items-center gap-2">

          <h2 className="text-xl font-semibold mb-4 mr-6">Option {route.routeNumber} Details</h2>

          {route.routeNumber == 1 && (<div className="rounded-lg shadow-md text-center bg-green-100">
            <p className="text-sm font-semibold text-green-700 mr-2 ml-2 mb-2 mt-2 text-center">Good Job! You are saving 20% of carbon emission!</p>
          </div>

          )}
          {!disableCustomization && (<div className="flex items-center gap-2">
            <div className="absolute right-0 inline-flex space-x-2 transform translate-x-[-25%]">
              <span className="text-sm text-gray-600 ">Customize Route</span>
              <Switch
                className="ml-auto"
                checked={isCustomizing}
                onCheckedChange={setIsCustomizing}
                aria-label="Toggle customization mode"
              />
            </div>
          </div>)}
        </div>


        {/* Conditionally render the GIF only for the greenest route */}
        {showGif && greenestRoute.routeNumber == route.routeNumber && (
          <img
            src="/imgs/animation_greenroute.gif"
            alt="Greenest Route"
            className="absolute top-8 right-2 w-32"
          />
        )}
        {/* Conditionally render the GIF only for the greenest route */}
        {showGif && greenestRoute.routeNumber != route.routeNumber && (
          <img
            src="/imgs/animation_notgreen.gif"
            alt="Greenest Route"
            className="absolute top-10 right-0"
          />
        )}

        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricItem
              icon={Timer}
              label="Duration"
              value={`${route.metrics.duration.maximum} days`}
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
                      {segment.transportModes
                        .filter((mode) => isCustomizing || selectedModes[index] === mode)
                        .map((mode) => (
                          <TransportIcon
                            key={mode}
                            mode={mode}
                            isActive={selectedModes[index] === mode}
                            onClick={() => handleToggle(index)}
                            disabled={disableCustomization ? !isCustomizing : false}
                          />
                        ))}

                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Cost Range:</span>
                      <p className="font-medium">${segment.costs[modeIndex]}</p>
                    </div>
                    <div>
                      <span className="text-gray-600">Emissions:</span>
                      <p className="font-medium">{segment.carbonEmissions[modeIndex]} kg</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="">
                        <span className="text-gray-600">Fuel Type:</span>
                        <p className="font-medium">{segment.fuel_types[modeIndex]}</p>
                      </div>
                      <div className="flex items-center">
                        <img
                          className="w-6 h-6"
                          alt="Fuel Type Icon"
                          src={
                            segment.fuel_types[modeIndex] === "Bio Fuel"
                              ? "/imgs/bio-fuel.png"
                              : segment.fuel_types[modeIndex] === "Jet Fuel"
                                ? "/imgs/jet-fuel.png"
                                : segment.fuel_types[modeIndex] === "Gasoline"
                                  ? "/imgs/gasoline.png"
                                  : segment.fuel_types[modeIndex] === "Diesel"
                                    ? "/imgs/diesel.png"
                                    : segment.fuel_types[modeIndex] === "Natural Gas"
                                      ? "/imgs/natural-gas.png"
                                      : segment.fuel_types[modeIndex] === "Electric (Fossil)"
                                        ? "/imgs/electric.png"
                                        : segment.fuel_types[modeIndex] === "Electric (Renewable)"
                                          ? "/imgs/electric.png"
                                          : ""
                          }
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default RouteDetails;
