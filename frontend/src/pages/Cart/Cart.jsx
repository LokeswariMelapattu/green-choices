import CartItems from "./components/CartItems";
import CartDetails from "./components/CartDetails";
import { useSelector, useDispatch } from 'react-redux';
import { removeItem, updateQuantity } from "../../redux/slices/cartSlice"
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import styles from "./Cart.module.css";

const Cart = () => {
    const navigate = useNavigate();
    const cartItems = useSelector((state) => state.cart.items);
    const dispatch = useDispatch();
    const handleUpdateQuantity = (index, newQuantity) => {
        dispatch(updateQuantity({ index, quantity: newQuantity }));
    };
    let totalAmount = 0.0;
    const handleRemoveItem = (index) => {
        dispatch(removeItem(index));
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    // Function to handle checkout button click
    const handleCheckout = (totalAmount, taxAmount) => {
        console.log('inside checkout:');
        const total =  Number(totalAmount) + Number(taxAmount);
        // Pass the total amount as state to the Index page
        navigate("../checkout", { state: { totalAmount: total, cartItems: cartItems } });
    };

    return (
        <>
            <Header />
            <div className={styles.mainDiv}>
                <main className={styles.main}>
                    <div className={styles.body}>
                        <div className={styles.cartItems}>
                            <h3 className={styles.itemsHeading}>Cart Details</h3>
                            <CartItems
                                items={cartItems}
                                updateQuantity={handleUpdateQuantity}
                                removeItem={handleRemoveItem}
                            />
                        </div>

                        <div className={styles.cartDetails}>
                            <h3 className={styles.detailsHeading}>Details</h3>
                            <CartDetails total={calculateTotal()} handleCheckout={handleCheckout} />
                        </div>
                    </div>


                </main>
            </div>
        </>
    );
}

export default Cart;