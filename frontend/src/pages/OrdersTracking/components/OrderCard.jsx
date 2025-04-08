import React from 'react';
import { Leaf, Globe2, Truck } from 'lucide-react';


const OrderCard = ({
  orderId,
  arrivalDate,
  emissions,
  isSustainable,
  isGreenDelivery,
}) => {
  return (
    <div className={`rounded-xl min-w-[300px] border p-4 shadow-sm transition-all duration-200 hover:shadow-md relative overflow-hidden
      ${isSustainable ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
      {/* Background Icons */}
      <div className="absolute -bottom-2 -right-2 transform rotate-12">
        {isSustainable && (
          <Globe2 className="h-24 w-24 text-green-100" strokeWidth={1} />
        )}
        {isGreenDelivery && (
          <Leaf className="h-24 w-24 text-green-100" strokeWidth={1} />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Order {orderId}</h3>
          {/* {isSustainable && (
            <Globe2 className="h-6 w-6 text-green-600" />
          )}
          {isGreenDelivery && (
            <Leaf className="h-6 w-6 text-green-600" />
          )} */}
        </div>
        
        <div className="mt-2 space-y-2">
          <p className="text-sm text-gray-600">
            Arrives {arrivalDate}
          </p>
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Truck className="h-5 w-5" />
            <span>Emits {emissions}</span>
          </div>
        </div>
        
        <div className="mt-3">
          {isGreenDelivery && (
            <p className="text-sm font-medium text-green-600">
              Greener delivery available
            </p>
          )}
          {isSustainable && (
            <p className="text-sm font-medium text-green-600">
              Most sustainable selected
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderCard;