import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: 0,
  shippingAddress: "Default Address",
  totalAmount: 0,
  deliveryCharge: 0,
  orderStatus: 'Pending',
  isSustainableOption: true,
  orderItems: [],
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderData: (state, action) => {
      return { ...state, ...action.payload };
    },
    resetOrder: () => initialState,
  },
});

export const { setOrderData, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;