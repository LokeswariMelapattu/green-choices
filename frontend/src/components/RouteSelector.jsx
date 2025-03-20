import { Card } from '@/components/ui/Card';
import { Plane, Ship, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

const RouteSelector = ({ routes, selectedRoute, onRouteSelect,isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center p-6">
        <div className="animate-pulse text-lg font-medium text-gray-600">
          Loading routes...
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Available Routes</h2>
      <div className="flex overflow-x-auto flex-nowrap gap-4 pb-2">
        {routes.map((route,index) => {
          const transportModes = [...new Set(route.segments.flatMap(segment => segment.transportModes))];
          return (
            <Card
              key={route.routeNumber}
              className={cn(
                "min-w-[300px] p-4 cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 m-1",
                selectedRoute?.routeNumber === route.routeNumber
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-green-300", "first:ml-6"
              )}
              onClick={() => onRouteSelect(route)}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Option {index+1}</h3> 
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{route.metrics.duration.maximum} days</span>
                      <span>•</span>
                      <span>{route.metrics.distance.minimum} km</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {transportModes.map(mode => {
                      const Icon = {
                        plane: Plane,
                        sea: Ship,
                        road: Truck
                      }[mode];
                      return <Icon key={mode} className="h-4 w-4 text-gray-500" />;
                    })}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Cost</span>
                    <span className="font-medium">
                      ${route.metrics.cost.minimum} - ${route.metrics.cost.maximum}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Carbon Emissions</span>
                    <span className="font-medium">
                      {route.metrics.carbonEmissions.minimum} - {route.metrics.carbonEmissions.maximum} kg
                    </span>
                  </div>

                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default RouteSelector;
