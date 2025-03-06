import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook for navigation

const Login = () => {
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login button clicked");

    // Redirect to the homepage after successful login
    navigate("/home"); // Change "/home" to the route you want to redirect to
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password clicked");

    // Redirect to forgot password page
    navigate("/forgot-password");
  };

  const handleSignUp = () => {
    console.log("Sign Up clicked");

    // Redirect to sign-up page
    navigate("/signup");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center">
          <span className="text-green-600">Green</span> Logistics
        </h2>
        <form className="mt-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
              placeholder="Username"
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-green-300 focus:outline-none"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 mt-6 font-semibold text-white bg-green-600 rounded-full hover:bg-green-700"
          >
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-blue-600 hover:underline" onClick={handleForgotPassword}>
            Forgot Password?
          </a>
        </div>
        <div className="mt-2 text-center text-gray-600">
          Don’t have an account?{' '}
          <a href="#" className="text-blue-600 hover:underline" onClick={handleSignUp}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
