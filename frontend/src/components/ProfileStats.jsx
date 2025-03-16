import React from "react";
import styles from "../styles/UserProfile.module.css";

const UserProfileStats = () => {
  return (
    <div className={styles.statsSection}>
      <div className={styles.statsColumns}>
      <div className={styles.statsColumn}>
          <div className={styles.statsBox}>
            <div className={styles.statsNumberWithIcon}>
              <p className={styles.statsNumber}>8</p>
              <img
                src="/imgs/parcel.png"
                className={styles.statsIcon}
                alt="Sustainable"
              />
            </div>
            <p className={styles.statsLabel}>Orders Placed</p>
          </div>
        </div>
        <div className={styles.statsColumn}>
          <div className={styles.statsBox}>
            <div className={styles.statsNumberWithIcon}>
              <p className={styles.statsNumber}>8</p>
              <img
                src="/imgs/delivery.png"
                className={styles.statsIcon}
                alt="Sustainable"
              />
            </div>
            <p className={styles.statsLabelGreen}>Sustainable Deliveries</p>
          </div>
        </div>
        <div className={styles.statsColumn}>
          <div className={styles.statsBoxGreen}>
            <img
              src="/imgs/leaf.png"
              className={styles.emissionsIcon}
              alt="CO2"
            />
            <div className={styles.emissionsContent}>
              <p className={styles.emissionsNumber}>3,000 g</p>
              <p className={styles.emissionsLabel}>CO2 Emissions Saved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileStats;
