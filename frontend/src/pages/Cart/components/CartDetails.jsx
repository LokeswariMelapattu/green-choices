import { Card } from "@/components/ui/Card";
import styles from './CartDetails.module.css'
const CartDetails = ({ total, handleCheckout }) => {
    return (
        <Card className={styles.card}>
            <h2 className={styles.heading}>Details</h2>
            <div className={styles.cardBody}>
                <div>
                    <div className={styles.item}>
                        <p className={styles.itemheading}>Sub Total</p>
                        <p>${(total).toFixed(2)}</p>
                    </div>
                    <div className={styles.item}>
                        <p className={styles.itemheading}>Tax</p>
                        <p>$32.00</p>
                    </div>
                    <div className={styles.item}>
                        <p className={styles.itemheading}>Total</p>
                        <p>${(total + 32.00).toFixed(2)}</p>
                    </div>
                </div>

                <div className={styles.btnSection}>
                    <button
                        onClick={() => handleCheckout(total.toFixed(2), 32.00)} // Add onClick handler
                        className="btn"
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </Card>
    )
}

export default CartDetails;