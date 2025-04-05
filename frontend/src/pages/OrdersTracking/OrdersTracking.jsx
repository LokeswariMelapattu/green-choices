import { Card } from "@/components/ui/Card";
import RouteMap from "@/components/RouteMap";
import RouteSelector from "@/components/RouteSelector";
import RouteDetails from "@/components/RouteDetails";
import useRoutes from '../../hooks/useRoutes';
import TrackingDetails from "./components/TrackingDetails";
import OrderCard from "./components/OrderCard";
import EcoFriendly from "./components/EcoFriendly";
import { Button } from "@/components/ui/button";
import { useState } from "react";

import Header from "../../components/Header";
import { useNavigate } from "react-router-dom";

/// Mock data for orders
// This should be replaced with actual data from your API or state management
const orders = [
  {
    orderId: "123",
    arrivalDate: "Mar 23, 2025",
    emissions: "1500 kg CO₂",
    isGreenDelivery: true,
  },
  {
    orderId: "123",
    arrivalDate: "Mar 23, 2025",
    emissions: "1500 kg CO₂",
    isSustainable: true,
  },
  {
    orderId: "123",
    arrivalDate: "Mar 23, 2025",
    emissions: "1500 kg CO₂",
    isGreenDelivery: true,
  },
  {
    orderId: "123",
    arrivalDate: "Mar 23, 2025",
    emissions: "1500 kg CO₂",
    isGreenDelivery: true,
  },

];
export default function OrdersTrackingPage() {
  //Uncomment this if you want to use the RouteSelector implementation may need some fixes
  const { routes, selectedRoute, setSelectedRoute, totalEmissions, greenestRoute, isLoading } = useRoutes();
  const navigate = useNavigate();
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!selectedRoute) {
    return <div>No route selected</div>;
  }
  const handleLearnMore = () => {
    console.log('Learn more clicked');
  };

  const handleSwitchToGreen = (orderId) => {
    console.log('Switch to green clicked');
    navigate(`/orders/${orderId}`);
  };
  return (
    <>
      <Header />
      <div className="mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6">
          <div className="w-full lg:w-[25%]">
            <TrackingDetails selectedRoute={selectedRoute} isLoading={isLoading} />
          </div>
          <div className="w-full lg:w-[75%]">
            <h1 className="mb-3 text-2xl font-bold text-gray-900 md:text-3xl">
              Active Orders
            </h1>
            <div className="flex overflow-x-auto scrollbar-hide gap-3 bg-white/70 backdrop-blur-lg border-none my-3 
          ">

              {orders.map((order, index) => (
                <OrderCard
                  key={index}
                  orderId={order.orderId}
                  arrivalDate={order.arrivalDate}
                  emissions={order.emissions}
                  isSustainable={order.isSustainable}
                  isGreenDelivery={order.isGreenDelivery}
                />
              ))}
            </div>
            <Card className="h-[300px] md:h-[400px] bg-white/70 backdrop-blur-lg">
              <RouteMap route={selectedRoute} />
            </Card>
            <div className="flex flex-col justify-center mt-4 md:mt-6">
              {/* Conditionally Render Based on Data from backend right shows for both */}
              <div className={`transition-all duration-300 ease-in-out overflow-hidden`}>
                <EcoFriendly
                  variant="choice"
                  percentage="30%"
                  onAction={() => handleSwitchToGreen(1)}
                />
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


