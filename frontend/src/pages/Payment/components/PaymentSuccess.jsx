import React from "react";
import styles from "../PaymentSuccess.module.css";
import ActionButton from "@/components/ui/ActionButton";
import { useNavigate } from "react-router-dom";
// import { SpinningSuccess } from "./ui/SpinningSuccess"

const PaymentSuccess = () =>{
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/home");
  };

  const handleTrackOrder = () => {
    // Navigation to order tracking
    console.log("Navigating to order tracking");
    navigate("/orders");
  };

  return (
    
    <div className={styles.container}>
      <div className={styles.successSection}>
        <div className={styles.iconContainer}>
         {/* <SpinningSuccess className={styles.successImage}/> */}
         <img
                  src="/imgs/success.png"
                  alt="Success checkmark"
                  width={214}
                  height={214}
                  className={styles.successImage}
                /> 
          </div>

        <h1 className={styles.successHeading}>
          <span className={styles.regularText}>Payment Was </span>
          <span className={styles.highlightText}>Successful</span>
          <span className={styles.regularText}>!</span>
        </h1>

        <div className={styles.actionButtons}>
          <ActionButton
            text="Go to Homepage"
            onClick={handleGoHome}
            className="btn"
          />
          <ActionButton
            text="Track your Order"
            onClick={handleTrackOrder}
            className="btn"
          />
        </div>
      </div>
    </div>

  );
}

export default PaymentSuccess;