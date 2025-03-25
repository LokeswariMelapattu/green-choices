import React from "react";
import { Link } from "react-router-dom";
import { FiUser, FiShoppingCart } from "react-icons/fi";

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        {/* Logo */}
        <Link to="/home" className="text-2xl font-bold text-gray-900">
          <span className="text-green-600">Green</span> Logistics
        </Link>

        {/* Right-aligned Menu and Icons */}
        <div className="flex items-center space-x-6 ml-auto">
          {/* Navigation Menu */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/home" className="text-gray-700 hover:text-green-600">Home</Link>
            <Link to="/home" className="text-gray-700 hover:text-green-600">Shop</Link>
            <Link to="/deals" className="text-gray-700 hover:text-green-600">Deals</Link>
            <Link to="/contact" className="text-gray-700 hover:text-green-600">Contact Us</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4">
            <Link to="/profile" className="text-gray-700 hover:text-green-600">
              <FiUser size={20} />
            </Link>
            <Link to="/cart" className="text-gray-700 hover:text-green-600">
              <FiShoppingCart size={20} />
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
