import React from "react";
import styles from "../../public/css/ProductDetails.module.css";

const ProductGallery = ({productImage}) => {
  return (
    <div className={styles.galleryContainer}>
      <figure className={styles.imageContainer}>
        <img
          src={productImage}
          className={styles.productImage}
          alt="Caliber Canvas Suede Shoes"
        />
      </figure>

      <div className={styles.thumbnailsContainer}>
        <img
          src={productImage}
          className={styles.thumbnail}
          alt="Product thumbnail 1"
        />
        <img
          src={productImage}
          className={styles.thumbnail}
          alt="Product thumbnail 2"
        />
        <img
          src={productImage}
          className={styles.thumbnail}
          alt="Product thumbnail 3"
        />
      </div>
    </div>
  );
}

export default ProductGallery;
