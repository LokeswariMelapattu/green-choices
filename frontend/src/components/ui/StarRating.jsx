import React from "react";
import styles from "../../../public/css/StarRatings.module.css";

const StarRatings = ({ rating = 0 }) => {
  const totalStars = 5;

  return (
    <div className={styles.starsContainer}>
      {[...Array(totalStars)].map((_, index) => (
        <img
          key={index}
          src={
            index < rating
              ? "/imgs/star_filled.png"
              : "/imgs/star_not_filled.png"
          }
          className={styles.starIcon}
          alt={index < rating ? "Filled star" : "Empty star"}
        />
      ))}
    </div>
  );
}

export default StarRatings;