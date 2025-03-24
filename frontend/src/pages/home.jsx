import React from "react";
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import Header from "../components/Header";
import { ToastContainer, toast } from "react-toastify";
import { FaGifts } from "react-icons/fa";
import ProductQuickView from "../components/ProductQuickView";
import { useDispatch } from "react-redux";
import { addItem } from "../redux/slices/cartSlice";
import "react-toastify/dist/ReactToastify.css";

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
          className="px-1 text-blue-500 underline cursor-pointer"
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
      <main className="flex min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center gap-4 
          bg-gradient-to-br from-[#1FAE5B] via-[#1DA154] to-[#0D4826]
          text-white w-full h-[330px] p-6 md:p-10
          rounded-lg shadow-md">
            <h1 className="text-5xl md:text-6xl font-bold font-quantico">FLASH SALE!!</h1>
            <FaGifts className="text-7xl md:text-8xl" />
          </div>

          <div className="py-6">
            <h2 className="py-4 text-2xl font-semibold">Trending Now</h2>
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {products.map(product => (
                <div key={product.product_id} onClick={() => handleProductClick(product)}>
                  <img src={product.img} alt={product.name} className="h-[200px] w-[200px] rounded-xl cursor-pointer" />
                  <h3 className="py-2">{product.name}</h3>
                  <p>${product.price}</p>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h2 className="py-4 text-2xl font-semibold">Best Deals</h2>
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {products.map(product => (
                <div key={product.product_id} onClick={() => handleProductClick(product)}>
                  <img src={product.img} alt={product.name} className="h-[200px] w-[200px] rounded-xl cursor-pointer" />
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Modal Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={handleCloseQuickView}
          ></div>

          {/* Modal Content */}
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-auto">
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 z-20 bg-white rounded-full p-2 shadow-md"
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