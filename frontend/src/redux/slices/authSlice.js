import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {
    firstname: "",
    lastname: "",
    username: "",
    userid: null,
    email: "",
    address: ""
  },
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logoutUser: (state) => {
      state.user = {};
      state.isAuthenticated = false;
    },
    setActiveOrders: (state, action) => {
      state.user.activeOrders = action.payload; // Update active orders within the user object
    },
  },
});

export const { setUser, logoutUser, setActiveOrders } = authSlice.actions;
export default authSlice.reducer;