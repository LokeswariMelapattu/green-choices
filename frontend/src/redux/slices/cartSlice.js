import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            // If item already exists in cart then increase quantity
            const existingItem = state.items.find(item => item.product_id === action.payload.product_id);
            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },
        removeItem: (state, action) => {
            state.items = state.items.filter((item, index) => index !== action.payload);
        },
        updateQuantity: (state, action) => {
            const { index, quantity } = action.payload;
            if (quantity > 0) {
                state.items[index].quantity = quantity;
            }
        },
    },
});

export const { addItem, removeItem, updateQuantity } = cartSlice.actions;

export default cartSlice.reducer;
