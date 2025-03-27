import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import useProducts from "../../hooks/useProducts";
import Header from "../../components/Header";
import { ToastContainer, toast } from "react-toastify";
import { FaGifts } from "react-icons/fa";
import ProductQuickView from "./components/ProductQuickView";
import { useDispatch } from "react-redux";
import { addItem } from "../../redux/slices/cartSlice";
import "react-toastify/dist/ReactToastify.css";
import styles from "./Home.module.css";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showQuickView, setShowQuickView] = useState(false);

  const showToastMessage = () => {
    toast.success(
      <>
        <p>Product added to cart!</p>
        <span
          onClick={() => navigate('/cart')}
          className="toast-success"
        >
          Go to Cart
        </span>
      </>, {
      position: "bottom-right"
    });
  };

  const handleProductClick = (product) => {
    if (!product) return; // Prevents null values
    setSelectedProduct(product);
    setShowQuickView(true);
    document.body.classList.add("overflow-hidden");
  };

  const handleCloseQuickView = () => {
    setShowQuickView(false);
    setSelectedProduct(null);
    // Remove the class to allow scrolling again
    document.body.classList.remove("overflow-hidden");
  };

  const handleAddToCart = () => {
    dispatch(addItem(selectedProduct));
    showToastMessage();
    handleCloseQuickView();
  };

  const { products, loading, error } = useProducts();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <>
      <Header />
      <ToastContainer />
      <main className={styles.mainSection}>
        <div className="container mx-auto px-4 py-8">
        <div className={styles.flashSale}>
          <h1 className={styles.flashSaleHeader}>FLASH SALE!!</h1>
          <FaGifts className={styles.flashSaleIcon} />
        </div>

          <div className="py-6">
            <h2 className={styles.productTitle}>Trending Now</h2>
            <div className={styles.productGrid}>
              {products.map(product => (
                <div key={product.productId} onClick={() => handleProductClick(product)}>
                  <img src={product.img} alt={product.name} className={styles.productImage} />
                  <h3 className="py-2">{product.name}</h3>
                  <p>${product.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className={styles.productTitle}>Best Deals</h2>
            <div className={styles.productGrid}>
              {products.map(product => (
                <div key={product.productId} onClick={() => handleProductClick(product)}>
                  <img src={product.img} alt={product.name} className={styles.productImage}/>
                  <h3 className="py-2">{product.name}</h3>
                  <p>${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Product Quick View Modal */}
      {showQuickView && (
        <div className={styles.modalContainer}>
          {/* Modal Backdrop */}
          <div
            className={styles.modalBackdrop}
            onClick={handleCloseQuickView}
          ></div>

          {/* Modal Content */}
          <div className={styles.modalContent}>
            {/* Close Button */}
            <button
              className={styles.closeButton}
              onClick={handleCloseQuickView}
              aria-label="Close product quick view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <ProductQuickView
              onClose={handleCloseQuickView}
              onAddToCart={handleAddToCart}
              product={selectedProduct}
            />
          </div>
        </div>
      )}
    </>

  );
};

export default Home;