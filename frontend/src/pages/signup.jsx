import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";  

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    dob: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    agreeTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!formData.agreeTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    console.log("Registering with:", formData);
    navigate("/home");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <>
      <Header /> {/* Include Header */}
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-3xl p-6 bg-white rounded-lg shadow-md mt-4">
          <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>
          <form onSubmit={handleRegister} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Full Name</label>
              <input
                type="text"
                name="fullName"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">Email Address</label>
              <input
                type="email"
                name="email"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="phone"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="dob"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-gray-700">Shipping Address</label>
              <input
                type="text"
                name="address"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="Shipping Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                name="city"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">State</label>
              <input
                type="text"
                name="state"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <label className="block text-gray-700">Zip Code</label>
              <input
                type="text"
                name="zipCode"
                className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
            <div className="col-span-2 flex items-center">
              <input
                type="checkbox"
                name="agreeTerms"
                className="mr-2"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label className="text-gray-700">I agree to the terms and conditions</label>
            </div>
            <div className="col-span-2 flex justify-center text-center">
              <button
                type="submit"
                className="w-2/5 px-4 py-2 text-white bg-green-600 rounded-full hover:bg-green-700"
              >
                Register
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={handleLoginRedirect}
              >
                Login
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
