import CartItems from "../components/CartItems";
import CartDetails from "../components/CartDetails";
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from "../redux/slices/cartSlice"

const Cart = () => {
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const handleUpdateQuantity = (index, newQuantity) => {
        dispatch(updateQuantity({ index, quantity: newQuantity }));
    };

    const handleRemoveItem = (index) => {
        dispatch(removeItem(index));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <h3 class="text-xl sm:text-2xl md:text-3xl font-semibold">Cart Details</h3>
                        <CartItems
                            items={cartItems}
                            updateQuantity={handleUpdateQuantity}
                            removeItem={handleRemoveItem}
                        />
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <h3 class="text-xl sm:text-2xl md:text-3xl font-semibold invisible">Details</h3>
                        <CartDetails total={calculateTotal()} />
                    </div>
                </div>


            </main>
        </div>
    );
}

export default Cart;