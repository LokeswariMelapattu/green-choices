import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    id: 1,  // Default user ID
    userName: "Logistics User",  // Default user ID
    shippingAddress: "123 Default St, City, Country" // Default Address
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setActiveOrders: (state, action) => {
      state.user.activeOrders = action.payload; // Update active orders within the user object
    },
  },
});

export const { setUser, setActiveOrders } = authSlice.actions;
export default authSlice.reducer;