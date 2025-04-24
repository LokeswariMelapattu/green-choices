import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiUser, FiShoppingCart } from "react-icons/fi";
import Badge from '@mui/material/Badge';
import { useSelector } from "react-redux";
import useUser from '../hooks/useUser';

const Header = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const cartItemCount = useSelector((state) => state.cart.cartItemCount);
  const {logout} = useUser();
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
            <Link to="/orders" className="text-gray-700 hover:text-green-600">Order History</Link>
          </nav>

          {/* Icons */}
          <div className="flex items-center space-x-4 relative">
            {/* Profile with Dropdown */}
            <div
              className="relative"
              data-testid="user-menu-container"
              onMouseEnter={() => setIsDropdownVisible(true)}
              onMouseLeave={() => setIsDropdownVisible(false)}
            >
              <FiUser size={20} className="text-gray-700 hover:text-green-600 cursor-pointer" />
              {isDropdownVisible && (
                <div
                  className="absolute -right-12 mt-0 w-32 bg-white shadow-md rounded-md border border-gray-200 z-10"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                  >
                    User Profile
                  </Link>
                  <Link
                    to="/"
                    className="block px-4 py-2 text-gray-700 hover:bg-green-100"
                    onClick={logout}
                  >
                    Sign Out
                  </Link>
                </div>
              )}
            </div>
            <Link to="/cart" className="text-gray-700 hover:text-green-600">
              <Badge badgeContent={cartItemCount} color="success">
                <FiShoppingCart size={20} />
              </Badge>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
