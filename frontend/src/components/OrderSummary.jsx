import { Card } from "@/components/ui/Card";
import { DollarSign, Leaf, Timer } from "lucide-react";
import { useState } from "react";
import { useTransport } from '@/context/transport-context';

const OrderSummary = () => {
  const { routeTotals } = useTransport();
  const [promoCode, setPromoCode] = useState("");
  
  if (!routeTotals) return null;

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
              <p className="text-sm text-gray-600">Total Emissions</p>
              <p className="font-semibold">{routeTotals.emissions} kg</p>
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

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Promo Code</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              placeholder="Enter promo code"
            />
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
              Apply
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default OrderSummary; 
