import React from "react";
import styles from "../UserProfile.module.css";

const UserProfileMilestones = () => {
  return (
    <div className={styles.milestonesSection}>
      <h2 className={styles.milestonesTitle}>Milestones</h2>

      <div className={styles.milestoneCard}>
        <div className={styles.milestoneInfo}>
          <img
            src="/imgs/badge.png"
            className={styles.milestoneIcon}
            alt="Milestone"
          />
          <p className={styles.milestoneDescription}>
            Choose 5 Sustainable Deliveries to get 20 % off on your next purchase
            !
          </p>
        </div>
        <p className={styles.milestoneProgress}>
          <span className={styles.greenText}>5</span> / 10
        </p>
      </div>

      <div className={styles.milestoneCard}>
        <div className={styles.milestoneInfo}>
          <img
            src="/imgs/badge.png"
            className={styles.milestoneIcon}
            alt="Milestone"
          />
          <p className={styles.milestoneDescription}>
            Choose 12 Economic Deliveries to get 30 % off on your next purchase
            !
          </p>
        </div>
        <p className={styles.milestoneProgress}>
          <span className={styles.greenText}>8</span> / 20
        </p>
      </div>
    </div>
  );
}

export default UserProfileMilestones;
