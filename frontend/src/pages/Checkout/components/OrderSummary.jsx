import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Card } from "@/components/ui/Card";
import { DollarSign, Leaf, Timer } from "lucide-react";
import { useTransport } from '@/context/transport-context';
import ActionButton from "../../../components/ui/ActionButton";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import FireIcon from "../../../components/ui/FireIcon";
import TreeIcon from "../../../components/ui/TreeIcon";
import ExhaustIcon from "../../../components/ui/ExhaustIcon";
import SustainabilityMessage from "../../../components/ui/SustainabilityMessage";
import useOrder from "../../../hooks/useOrder";
import { setOrderData } from '../../../redux/slices/orderSlice'; 

const OrderSummary = ({ isLowSustainable, totalAmount, cartItems}) => {
  const { routeTotals } = useTransport();
  const { saveOrder, loading, error } = useOrder();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderData = useSelector((state) => state.order);
  const user = useSelector((state) => state.auth?.user || null); 
 
  useEffect(() => {
    if (routeTotals && user) {
      console.log("isGreen : " + !isLowSustainable);
      dispatch(setOrderData({
        userId: user.id,
        shippingAddress: user.shippingAddress,
        totalAmount: (Number(totalAmount || 0) + Number(routeTotals.cost || 0)).toFixed(2),
        deliveryCharge: Number(routeTotals.cost || 0).toFixed(2),
        isSustainableOption : !isLowSustainable,
        orderItems: cartItems,
      }));
    }
  }, [totalAmount, routeTotals, isLowSustainable, cartItems, user, dispatch]);

  if (!routeTotals) return null;

  const handlePayment = async () => {
    try {
      console.log(orderData);
      await saveOrder(orderData); // Call save order API
      navigate("/paymentsuccess");
    } catch (err) {
      console.error('Error saving order:', err);
    }
  };

  return (
    <Card className="p-6 bg-white/70 backdrop-blur-lg">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-sm text-gray-600">Total Duration</p>
              <p className="font-semibold">{routeTotals.duration} days</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-gray-600" />
            <div>
              <p className="text-gray-600">Total Emissions</p>
              <div className="flex items-center gap-2">
                {/* Fire 🔥 or Tree 🌱 Icon Based on Emissions */}
                {isLowSustainable ? <ExhaustIcon/> : <TreeIcon />}
                <p className={`font-semibold ${isLowSustainable ? "text-red-600" : "text-green-600"}`}>
                  {routeTotals.emissions} kg
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Subtotal</p>
            <p className="text-[22px]">${ (Number(totalAmount || 0) + Number(routeTotals.cost || 0)).toFixed(2) }</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-gray-600" />
          <div>
            <p className="text-sm text-gray-600">Shipping</p>
            <p className="text-[18px]">${ Number(routeTotals.cost || 0).toFixed(2) }</p>
          </div>
        </div>

        {/* Sustainability Encouragement Message */}
        <SustainabilityMessage isLowSustainable={isLowSustainable} />

        <div className="flex items-center justify-center min-h-[100px]">
          <ActionButton 
            tooltip={isLowSustainable ? "shipping-info" : ""}
            text="Continue to Payment"
            onClick={handlePayment}
            className=""
          />
          <Tooltip id="shipping-info">
            <p>🔥 This shipping option emits high CO₂.</p>
            <p>Consider eco-friendly alternatives for a **greener** 🌱 option.</p>
          </Tooltip>
        </div>
      </div>
    </Card>
  );
};

export default OrderSummary;
