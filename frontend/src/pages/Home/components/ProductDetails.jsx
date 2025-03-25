"use client";
import React from "react";
import styles from "./ProductDetails.module.css";
import StarRating from "./StarRating";
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';

const ProductDetails = ({name, price, description}) => {
  const [selectedColor, setSelectedColor] = useState("beige");
  const [selectedSize, setSelectedSize] = useState("8");

  const handleSizeChange = (e) => {
    setSelectedSize(e.target.value);
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
  };

  // Format price to always show 2 decimal places
  const formattedPrice = typeof price === "number" ? price.toFixed(2) : price;

  return (
    <section className={styles.detailsContainer}>
      <div className={styles.detailsContent}>
        <h1 className={styles.productTitle}>{name}</h1>
        <p className={styles.productPrice}>$ {formattedPrice}</p>
        <p className={styles.productDescription}>{description}</p>

        {/* Size Options */}
        <div className={styles.sizeContainer}>
          <label>Size : </label> 
          <div className={styles.sizeSelectWrapper}>
            <select
              className={styles.sizeSelect}
              value={selectedSize}
              onChange={handleSizeChange}
              aria-label="Select size">
              <option value="6">EU 32</option>
              <option value="6.5">EU 34</option>
              <option value="7">EU 36</option>
              <option value="7.5">EU 39</option>
              <option value="8">EU 40</option>
              <option value="8.5">EU 44</option>
            </select>
          </div>
        </div>

        {/* Color Options */}
        <div className={styles.colorContainer}>
          <h3 className={styles.colorLabel}>Color:</h3>
          <button
            className={`${styles.colorOption} ${styles.beigeColor} ${selectedColor === "beige" ? styles.selected : ""}`}
            onClick={() => handleColorSelect("beige")}
            aria-label="Beige color"
          />
          <button
            className={`${styles.colorOption} ${styles.blackColor} ${selectedColor === "black" ? styles.selected : ""}`}
            onClick={() => handleColorSelect("black")}
            aria-label="Black color"
          />
          <button
            className={`${styles.colorOption} ${styles.brownColor} ${selectedColor === "brown" ? styles.selected : ""}`}
            onClick={() => handleColorSelect("brown")}
            aria-label="Brown color"
          />
        </div>

        {/* Ratings */}
        <div className={styles.ratingsContainer}>
          <h3 className={styles.ratingsTitle}>Ratings:</h3>
          <StarRating rating={4} />
        </div>
      </div>
    </section>
  );
}

export default ProductDetails;
