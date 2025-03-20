import React from "react";
import styles from "../styles/PaymentSuccess.module.css";
import ActionButton from "./ui/ActionButton";
import { useNavigate } from "react-router-dom";

const PaymentSuccess = () =>{
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/home");
  };

  const handleTrackOrder = () => {
    // Navigation to order tracking
    console.log("Navigating to order tracking");
    navigate("/tracking");
  };

  return (
    <div className={styles.container}>
      <div className={styles.successSection}>
        <div className={styles.iconContainer}>
          <img
            src="/imgs/success.png"
            alt="Success checkmark"
            width={214}
            height={214}
            className={styles.successImage}
          /> </div>

        <h1 className={styles.successHeading}>
          <span className={styles.regularText}>Payment Was </span>
          <span className={styles.highlightText}>Successful</span>
          <span className={styles.regularText}>!</span>
        </h1>

        <div className={styles.actionButtons}>
          <ActionButton
            text="Go to Homepage"
            onClick={handleGoHome}
            className="w-full px-4 py-2 mt-6 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700"
          />
          <ActionButton
            text="Track your Order"
            onClick={handleTrackOrder}
            className="w-full px-4 py-2 mt-6 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700"
          />
        </div>
      </div>
    </div>

  );
}

export default PaymentSuccess;