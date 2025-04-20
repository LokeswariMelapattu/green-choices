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
import { useDispatch, useSelector } from 'react-redux';
import { setActiveOrders } from '../../redux/slices/authSlice';
import useOrder from "../../hooks/useOrder";

import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

export default function OrdersTrackingPage() {
  //Uncomment this if you want to use the RouteSelector implementation may need some fixes
  const { routes, selectedRoute, setSelectedRoute, totalEmissions, greenestRoute, isLoading } = useRoutes();
  const navigate = useNavigate();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderLoading, setIsOrderLoading] = useState(null);

  const dispatch = useDispatch();
  const { getActiveOrders } = useOrder();
  const userId = useSelector((state) => state.auth.user.id || 1);
  const activeOrders = useSelector((state) => state.auth.user.activeOrders);
  console.log(selectedRoute);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const orders = await getActiveOrders(userId); // Fetch orders from the API
        console.log(orders);
        dispatch(setActiveOrders(orders)); // Dispatch to Redux to update the state
      } catch (error) {
        console.error('Error fetching active orders:', error);
      }
    };

    fetchOrders(); // Fetch active orders 
  }, [userId, dispatch]);

  useEffect(() => {
    if (activeOrders?.length > 0) {
      const latestOrder = activeOrders[0];
      setSelectedOrder(latestOrder);
    }
  }, [activeOrders]);

  useEffect(() => {
    if (selectedOrder) {
      const routeNumber =  selectedOrder?.routeInfo?.routenumber;
      const route = routes?.routes?.find(route => route.routeNumber === routeNumber);
      setSelectedRoute(route !== null ? route : selectedRoute);
    }
  }, [selectedOrder]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!selectedRoute) {
    return <div>No route selected</div>;
  }

  const calculateArrivalDate = (order) => {
    const createdDateObj = new Date(order?.createdat);
    const routeNumber =  order?.routeInfo?.routenumber;
    const route = routes?.routes?.find(route => route.routeNumber === routeNumber);

    const totalDurationAllSegments = route?.segments.reduce(
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
  
    const savings = ((currentEmission - sustainableEmission) / currentEmission) * 100;
    return parseFloat(savings.toFixed(2));
  };

  const handleLearnMore = () => {
    console.log('Learn more clicked');
  };

  const handleSwitchToGreen = (orderId) => {
    console.log('Switch to green clicked');
    navigate(`/orders/${orderId}`);
  };

  const onOrderClick =(order) => {
    setIsOrderLoading(true);
    setSelectedOrder(order);
    
    // Simulate loading or wait for actual fetch logic if needed
    setTimeout(() => {
      setIsOrderLoading(false);
    }, 500);
  };

  return (
    <>
      <Header />
      <div className="mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          
          
            <div className="w-full lg:w-[25%]">
            {activeOrders?.length > 0 && (
              <TrackingDetails 
              selectedRoute={selectedRoute} 
              order={selectedOrder} 
              arrivalDate={selectedOrder?.createdat ? 
                calculateArrivalDate(selectedOrder).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric', 
                    year: 'numeric' 
                  }) 
                  : null} 
              isLoading={isLoading} />
            )}
            </div>
          
          <div className="w-full lg:w-[75%]">
            <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl px-12">
              Active Orders
            </h1>
            <div className="flex overflow-x-auto scrollbar-hide gap-4 bg-white/70 backdrop-blur-lg border-none my-3 px-5 p-4
              ">
              {activeOrders?.length > 0 ? (
                activeOrders?.map((order, index) => (
                  <OrderCard
                    key={index}
                    orderId={order.orderid}
                    arrivalDate={order?.createdat ? 
                      calculateArrivalDate(order).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        }) 
                        : null}
                    emissions={`${order?.routeInfo?.carbonemission} kg CO₂`}
                    isSustainable={order?.issustainableoption}
                    isGreenDelivery={!order?.issustainableoption}
                    isSelected={selectedOrder === order}
                    isLoading={selectedOrder?.orderid === order.orderid && isOrderLoading}
                    onClick={() => onOrderClick(order)}
                  />
                ))
            ) : (
              <div className="p-6 my-8 text-gray-700 bg-gray-100 rounded-xl shadow-sm text-lg font-semibold">
                No active orders at the moment.
              </div>
            )}
            </div>
            {activeOrders?.length > 0 && (
            <Card className="h-[300px] md:h-[400px] bg-white/70 backdrop-blur-lg">
              <RouteMap route={activeOrders?.length > 0 ? selectedRoute : null} />
            </Card>)}
            <div className="flex flex-col justify-center mt-4 md:mt-6">
              {/* Conditionally Render Based on Data from backend right shows for both */}
              <div className="transition-all duration-300 ease-in-out overflow-hidden">
                {activeOrders?.length > 0 ? (
                  !selectedOrder?.issustainableoption ? (
                    <EcoFriendly
                      variant="choice"
                      percentage={`${calculateSavings(
                        selectedOrder?.routeInfo?.carbonemission,
                        greenestRoute?.minTotalEmissions
                      )}%`}
                      onAction={() => handleSwitchToGreen(selectedOrder?.orderid)}
                    />
                  ) : (
                    <EcoFriendly
                      variant="confirmation"
                      onAction={() => handleLearnMore()}
                    />
                  )
                ) : null}
              </div>
              {/* <div className="flex flex-col md:flex-row justify-end items-center gap-4 md:gap-6 my-4">
                <p>Need your parcel sooner?</p>
                <Button
                  className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-lg font-semibold w-full md:w-auto"
                  onClick={() => setClicked(!clicked)}
                >
                  Change Route
                </Button>
              </div> */}
            </div>

          </div>
        </div>
      </div>
    </>
  );
};


