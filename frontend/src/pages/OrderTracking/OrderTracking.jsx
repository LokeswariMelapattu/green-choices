import { Card } from "@/components/ui/Card";
import RouteMap from "@/components/RouteMap";
import RouteSelector from "@/components/RouteSelector";
import RouteDetails from "@/components/RouteDetails";
import useRoutes from '../../hooks/useRoutes';
import TrackingDetails from "./components/TrackingDetails";
import OrderCard from "./components/OrderCard";
import EcoFriendly from "./components/EcoFriendly";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import CarbonEmissionBar from "./components/CarbonEmissionBar";
import { useParams } from 'react-router-dom';
import useOrder from "../../hooks/useOrder";
import { useTransport } from '@/context/transport-context';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/// Mock data for orders
// This should be replaced with actual data from your API or state management and also please Send Props for Each order here

export default function OrderTrackingPage({ }) {
    //Uncomment this if you want to use the RouteSelector implementation may need some fixes
    const { routes, selectedRoute, setSelectedRoute, totalEmissions, greenestRoute, isLoading } = useRoutes();
    const navigate = useNavigate();
    const { orderId } = useParams();
    const { routeTotals } = useTransport();
    const { updateOrderRoute, getOrderById, loading, error } = useOrder();
    const user = useSelector((state) => state.auth?.user || null); 
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [savings, setSavings] = useState(null);

    useEffect(() => {
        const fetchOrderbyId = async () => {
          try {
            const order = await getOrderById(orderId); // Fetch orders from the API
            console.log(order);
            setSelectedOrder(order);
          } catch (error) {
            console.error('Error fetching active orders:', error);
          }
        };
    
        fetchOrderbyId(); // Fetch order
      }, [orderId]);

      const calculateArrivalDate = (order) => {
        const createdDateObj = new Date(order?.createdat);
        const totalDurationAllSegments = selectedRoute?.segments.reduce(
          (sum, seg) => sum + (seg.durations?.[0] || 0),
          0
        );
        // Adding duration in days to the created date
        createdDateObj.setDate(createdDateObj.getDate() + totalDurationAllSegments);
        return createdDateObj;
      };

      const calculateSavings = (currentEmission, sustainableEmission) => {
        if (typeof currentEmission !== 'number' || typeof sustainableEmission !== 'number') return 0;
        if (currentEmission <= 0 || sustainableEmission < 0 || sustainableEmission >= currentEmission) return 0;
      
        const savings = (currentEmission - sustainableEmission);
        return parseFloat(savings.toFixed(2));
      };
    

    const handleUpdateRoute = async (route) => {
        console.log('Update route clicked', route);
        try {
            const routeInfo = {
                orderId: orderId,
                source: route?.source,  // assuming selectedRoute has source
                destination: route?.destination,
                carbonEmissions: routeTotals.emissions,
                duration: routeTotals.duration,
                routeNumber: route.routeNumber,
                totalCost: routeTotals.cost,
                lastUpdatedUserId: user.id
              };
            const updated = await updateOrderRoute(routeInfo);
            console.log('Route updated successfully:', updated);
            showToastMessage();
            //navigate("/orders");
          } catch (err) {
            console.error('Failed to update route:', err);
          }
    };

      const showToastMessage = () => {
        toast.success(
            <div className="flex items-center justify-between gap-4">
            <p>Route updated successfully!</p>
            <span
              onClick={() => navigate('/orders')}
              className="toast-success"
            >
              Go to Order History
            </span>
            </div>, {
          position: "bottom-right",
          style: { width: '500px' },
          onClose: () => navigate('/orders')
        });
      };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!selectedRoute) {
        return <div>No route selected</div>;
    }

    const emissionSaved = calculateSavings(selectedOrder?.routeInfo?.carbonemission, selectedRoute?.minTotalEmissions);

    return (
        <>
            <Header />
            <ToastContainer />
            <div className="mx-auto p-4 md:p-6 lg:p-8">
                <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
                    <div className="w-full lg:w-[25%]">
                        <TrackingDetails 
                        selectedRoute={selectedRoute} 
                        order={selectedOrder} 
                        arrivalDate={selectedOrder?.createdat ? 
                        calculateArrivalDate(selectedOrder).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                        }) : null}  
                  isLoading={isLoading} />
                    </div>
                    <div className="w-full lg:w-[75%]">

                        <Card className="h-[300px] md:h-[400px] bg-white/70 backdrop-blur-lg">
                            <RouteMap route={selectedRoute} />
                        </Card>
                        <div className="mt-4 md:mt-6 space-y-6">
                            <div className="flex flex-col md:flex-row justify-between items-end">
                                <div className="flex flex-col md:flex-row grow-[1]"> 
                                    <RouteSelector
                                        routes={routes.routes}
                                        selectedRoute={selectedRoute}
                                        onRouteSelect={setSelectedRoute}
                                        isLoading={isLoading}
                                        displayFirstOnly={true}
                                    />
                                </div>
                                 <div className="flex flex-col items-center p-4 bg-white/70 backdrop-blur-lg rounded-lg shadow-md border border-gray-200 grow-[1]">
                                    <div className="text-center">
                                        <h3 className="text-lg font-bold text-green-600">Great Choice!</h3>
                                        <p className="text-sm text-gray-600">
                                            This Option saves {emissionSaved} kg more CO2. It is equivalent to planting 2 trees
                                        </p>
                                    </div>
                                    <div className="flex flex-col items-start w-full mt-4">
                                        <div className="flex justify-between w-full">
                                            <span className="text-sm font-medium text-gray-700">CO2 Emission</span>
                                            <span className="text-sm font-medium text-gray-700">-500 Kg</span>
                                        </div>
                                        <CarbonEmissionBar value={-emissionSaved} maxValue={1000} />
                                    </div>
                                </div>
                            </div>

                            {/* <div className="flex flex-col md:flex-row md:w-full gap-3">
                                <div className="flex !grow-1">
                                    <RouteDetails route={selectedRoute} greenestRoute={greenestRoute} disableCustomization={true} />
                                </div>
                                <div className="flex flex-col !grow-1">
                                    <div className="p-4 bg-white/70 backdrop-blur-lg rounded-lg shadow-md border border-gray-200">
                                        <CarbonEmissionBar value={-500} maxValue={1000} />
                                    </div>
                                </div>
                            </div> */}
                            <div className="flex flex-col md:flex-row gap-3 justify-between items-end">
                                <div className="flex flex-col md:flex-row gap-3 grow-[3]">
                                    <RouteDetails route={selectedRoute} greenestRoute={greenestRoute} disableCustomization={true} />
                                </div>
                               
                            </div>
                            <div className="flex flex-col md:flex-row justify-end gap-4 md:gap-6">
                                <Button
                                    variant="outline"
                                    className="w-full md:w-auto px-6 py-2 text-lg font-semibold"
                                    onClick={() => navigate('/orders')}
                                >
                                    Close
                                </Button>
                                <Button
                                    className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-semibold"
                                    onClick={() => handleUpdateRoute(selectedRoute)}
                                >
                                    Update
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};


