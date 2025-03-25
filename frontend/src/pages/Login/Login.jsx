import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Login.module.css"; // Import CSS Module

const Login = () => {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login button clicked");
    navigate("/home");
  };

  const handleForgotPassword = () => {
    console.log("Forgot Password clicked");
    navigate("/forgot-password");
  };

  const handleSignUp = () => {
    console.log("Sign Up clicked");
    navigate("/signup");
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>
          <span className={styles.greenText}>Green</span> Logistics
        </h2>
        <form onSubmit={handleLogin}>
          <div>
            <label>Username</label>
            <input type="text" placeholder="Username" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" placeholder="Password" />
          </div>
          <button type="submit" className={styles.button}>
            Login
          </button>
        </form>
        <div className={styles.alignMiddle}>
          <a href="#" onClick={handleForgotPassword}>
            Forgot Password?
          </a>
        </div>
        <div className={styles.signupLink}>
          Don’t have an account?{" "}
          <a href="#" onClick={handleSignUp}>
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
