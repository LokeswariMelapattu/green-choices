import { Card, CardHeader, CardContent } from "../components/ui/Card";
import MapComponent from "../components/MapComponent";


const Checkout = ({ deliveryDetails, orderSummary, deliveryRoutes }) => {
    return (
        <div className="content">
            <div className="content-details">
                <div className="address">
                    <h2 className="text-xl font-semibold">Shipping Address</h2>
                    <p className="font-semibold">{deliveryDetails.name}</p>
                    <p>{deliveryDetails.phone}</p>
                    <p className="text-orange-600">{deliveryDetails.address}</p>
                    <p>{deliveryDetails.city}, {deliveryDetails.postalCode}, {deliveryDetails.country}</p>
                </div>
                <div className="summary">
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    <p><strong>Item(s) total:</strong> {orderSummary.itemsTotal}€</p>
                    <p><strong>Shipping:</strong> {orderSummary.shippingCost === 0 ? "FREE" : `${orderSummary.shippingCost}€`}</p>
                    <p className="text-lg font-bold">Total: {orderSummary.total}€</p>
                    <button className="bg-orange text-white rounded-md w-full mt-4">
                        Order and Pay
                    </button>
                </div>
            </div>
            <div className="map-content">
                <MapComponent routes={deliveryRoutes} />
            </div>
        </div>
    );
};


export default Checkout;
