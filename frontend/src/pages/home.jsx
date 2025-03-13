import React from "react";
import { useNavigate } from "react-router-dom";
import useProducts from "../hooks/useProducts";
import Header from "../components/Header";
import { FaGifts } from "react-icons/fa";

const Home = () => {
  const navigate = useNavigate();

  const handleViewCart = (e) => {
    e.preventDefault();
    console.log("View cart button clicked");
    navigate("/cart");
  };

  const { products, loading, error } = useProducts();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;


  return (
    <>
      <Header />
      <main className="flex min-h-screen bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col justify-center gap-2 
          bg-gradient-to-br from-[#1FAE5B] via-[#1DA154] to-[#0D4826]
          text-white w-full h-[350px] p-6 md:p-10
          rounded-lg shadow-md">
            <h1 className="text-5xl md:text-6xl font-bold font-quantico">FLASH SALE!!</h1>
            <FaGifts className="text-7xl md:text-8xl" />
          </div>
        </div>
      </main>
    </>

  );
};

export default Home;