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
import { clearCart } from "../../../redux/slices/cartSlice"; 
import styles from './OrderSummary.module.css';

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
      dispatch(clearCart());
      navigate("/paymentsuccess");
    } catch (err) {
      console.error('Error saving order:', err);
    }
  };

  return (
    <Card className={styles.container}>
      <h2 className={styles.heading}>Order Summary</h2>

      <div className={styles.section}>
        <div className={styles.gridDiv}>
          <div className={styles.divSection}>
            <Timer className={styles.timer} />
            <div>
              <label>Total Duration</label>
              <p className="font-semibold">{routeTotals.duration} days</p>
            </div>
          </div>

          <div className={styles.divSection}>
            <Leaf className={styles.leaf} />
            <div>
              <label>Total Emissions</label>
              <div className={styles.divSection}>
                {/* Fire 🔥 or Tree 🌱 Icon Based on Emissions */}
                {isLowSustainable ? <ExhaustIcon/> : <TreeIcon />}
                <p className={`font-semibold ${isLowSustainable ? "text-red-600" : "text-green-600"}`}>
                  {routeTotals.emissions} kg
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.gridDiv}>
          <div className={styles.divSection}>
          <DollarSign className={styles.dollar}  />
            <div>
              <label>Item(s) total</label>
              <p className="text-[18px]">${ Number(totalAmount|| 0).toFixed(2) }</p>
            </div>
          </div>

          <div className={styles.divSection}>
          <DollarSign className={styles.dollar}  />
            <div>
              <label>Shipping</label>
              <p className="text-[18px]">${ Number(routeTotals.cost || 0).toFixed(2) }</p>
            </div>
          </div>
        </div>

        <div className={styles.divSection}>
          <DollarSign className={styles.dollar} />
          <div>
            <label className="text-sm">Order total</label>
            <p className="text-[22px] font-semibold">${ (Number(totalAmount || 0) + Number(routeTotals.cost || 0)).toFixed(2) }</p>
          </div>
        </div>

        {/* Sustainability Encouragement Message */}
        <SustainabilityMessage isLowSustainable={isLowSustainable} />

        <div className={styles.actionSection}>
          <ActionButton 
            tooltip={isLowSustainable ? "shipping-info" : ""}
            text="Continue to Payment"
            onClick={handlePayment}
            className= {isLowSustainable ? "btn-red":"btn"}
          />
         <Tooltip id="shipping-info" className={styles.tooltip}> 
          <p>Hi {user.userName},</p>
          <p>🚨 This shipping option is basically a smoke machine for the planet. 🌍💨</p>
          <p>Why not go for a greener choice? Your future self will thank you! 🌱</p> 
        </Tooltip>
        </div>
      </div>
    </Card>
  );
};

export default OrderSummary;
