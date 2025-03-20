import { Card } from "@/components/ui/Card";
import { DollarSign, Leaf, Timer } from "lucide-react";
import { useTransport } from '@/context/transport-context';
import ActionButton from "./ui/ActionButton";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import FireIcon from "./ui/FireIcon";
import TreeIcon from "./ui/TreeIcon";
import ExhaustIcon from "./ui/ExhaustIcon";
import SustainabilityMessage from "./ui/SustainabilityMessage";

const OrderSummary = ({ isLowSustainable }) => {
  const { routeTotals } = useTransport();
  const navigate = useNavigate();

  if (!routeTotals) return null;

  const handlePayment = () => {
    navigate("/paymentsuccess");
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
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-2xl font-bold">${routeTotals.cost.toFixed(2)}</p>
          </div>
        </div>

        {/* Sustainability Encouragement Message */}
        <SustainabilityMessage isLowSustainable={isLowSustainable} />

        <div className="flex items-center justify-center min-h-[100px]">
          <ActionButton 
            tooltip={isLowSustainable ? "shipping-info" : ""}
            text="Continue to Payment"
            onClick={handlePayment}
            className="px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors rounded-[12px]"
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
