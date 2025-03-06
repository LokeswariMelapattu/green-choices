import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate(); 

  const handleViewCart = (e) => {
    e.preventDefault();
    console.log("View cart button clicked"); 
    navigate("/cart");  
  };
 

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-green-600">Green</span> Logistics
        </h2>
         
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline" onClick={handleViewCart}>
           Go to Cart
          </a>
        </div>
        
      </div>
    </div>
  );
};

export default Home;