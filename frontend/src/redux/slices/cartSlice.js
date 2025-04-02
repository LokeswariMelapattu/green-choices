import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: JSON.parse(localStorage.getItem('cartItems')) || [],
    // Count number of cart items + their quantities
    cartItemCount: JSON.parse(localStorage.getItem('cartItems'))?.reduce((total, item) => total + item.quantity, 0) || 0
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            // If item already exists in cart then increase quantity
            const existingItem = state.items.find(item => item.productId === action.payload.productId);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
            state.cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        removeItem: (state, action) => {
            state.items = state.items.filter((item, index) => index !== action.payload);
            state.cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        updateQuantity: (state, action) => {
            const { index, quantity } = action.payload;
            if (quantity > 0) {
                state.items[index].quantity = quantity;
            }
            state.cartItemCount = state.items.reduce((total, item) => total + item.quantity, 0);
            localStorage.setItem('cartItems', JSON.stringify(state.items));
        },
        clearCart: (state) => {
            state.items = [];
            state.cartItemCount = 0;
            localStorage.removeItem("cartItems"); // Clear localStorage
        },
    },
});

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
