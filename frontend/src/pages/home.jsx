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
                <div key={product.product_id}>
                  <img src={product.img} alt={product.name} className="min-h-[200px] min-w-[200px] rounded-xl" />
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
                <div key={product.product_id}>
                  <img src={product.img} alt={product.name} className="min-h-[200px] min-w-[200px] rounded-xl" />
                  <h3 className="py-2">{product.name}</h3>
                  <p>${product.price}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>

  );
};

export default Home;