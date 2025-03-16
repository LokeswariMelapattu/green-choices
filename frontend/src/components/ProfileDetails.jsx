import React from "react";
import styles from "../styles/UserProfile.module.css";

const ProfileDetails =() => {
  return (
    <div className={styles.profileHeader}>
      <div className={styles.profileColumns}>
        <div className={styles.profileColumn}>
          <div className={styles.userInfoContainer}>
            <h2 className={styles.userName}>John Doe</h2>
            <p className={styles.userEmail}>Jhondoe@greenlogistics.com</p>
          </div>
        </div>
        <div className={styles.profileColumnWide}>
          <div className={styles.contactInfoContainer}>
            <img
              src="/imgs/edit.png"
              className={styles.editIcon}
              alt="Edit"
            />
            <div className={styles.contactInfoBox}>
              <div className={styles.contactInfoColumns}>
                <div className={styles.contactInfoColumn}>
                  <div className={styles.contactInfoGroup}>
                    <h3 className={styles.contactInfoLabel}>Phone Number:</h3>
                    <p className={styles.contactInfoValue}>+358-0837227929</p>
                  </div>
                </div>
                <div className={styles.contactInfoColumn}>
                  <div className={styles.contactInfoGroup}>
                    <h3 className={styles.contactInfoLabel}>
                      Shipping Address:
                    </h3>
                    <address className={styles.contactInfoAddress}>
                      Orivedenkatu, Tampere
                      <br />
                      Finland
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDetails;
