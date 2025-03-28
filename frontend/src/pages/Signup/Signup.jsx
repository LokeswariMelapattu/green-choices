import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";  
import styles from './Signup.module.css'
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
      <div className={styles.container}>
        <div className={styles.section}>
          <h2 className={styles.heading}>Create Account</h2>
          <form onSubmit={handleRegister} className={styles.form}>
            <div>
              <label>Full Name</label>
              <input
                type="text"
                name="fullName" 
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Shipping Address</label>
              <input
                type="text"
                name="address"
                placeholder="Shipping Address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Zip Code</label>
              <input
                type="text"
                name="zipCode"
                placeholder="Zip Code"
                value={formData.zipCode}
                onChange={handleChange}
              />
            </div>
            <div>
              <input
                type="checkbox"
                name="agreeTerms"
                className={styles.chkbox}
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label className="exclude-label text-gray-700">I agree to the terms and conditions</label>
            </div>
            <div className={styles.actionDiv}>
              <button
                type="submit"
                className={styles.btn}
              >
                Register
              </button>
            </div>
          </form>
          <div className={styles.loginDiv}>
            <p className={styles.login}>
              Already have an account?{" "}
              <span
                className={styles.spanLogin}
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
