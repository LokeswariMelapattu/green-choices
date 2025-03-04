import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [
        {
            img: '/imgs/sneakers.png',
            name: "Caliber Canvas - Seude",
            size: "EU 44",
            color: "Beige",
            price: 80.00,
            quantity: 1,
        },
        {
            img: '/imgs/sneakers.png',
            name: "Caliber Canvas - Seude",
            size: "EU 44",
            color: "Beige",
            price: 80.00,
            quantity: 1,
        }
    ],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push(action.payload);
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
