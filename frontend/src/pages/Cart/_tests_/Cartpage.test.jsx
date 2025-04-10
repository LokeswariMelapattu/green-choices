import React from 'react';
import { render, screen, waitFor, within, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach} from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "../../../redux/slices/cartSlice";
import "@testing-library/jest-dom/vitest";
import App from "../../../App.jsx";
import Cart from "@/pages/Cart/Cart";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

function renderWithCart(cartItems) {
    const store = configureStore({
      reducer: {
        cart: cartReducer, // use your real reducer
      },
      preloadedState: {
        cart: {
          items: cartItems,
        },
      },
    });
  
    return render(
      <Provider store={store}>
        <BrowserRouter>
          <Cart />
        </BrowserRouter>
      </Provider>
    );
}

const mockCartItems = [
    {
      name: "Cool Hat",
      price: 25.00,
      quantity: 1,
      img: "/hat.jpg",
      size: 3
    },
    {
      name: "Fancy Shoes",
      price: 50.00,
      quantity: 2,
      img: "/shoes.jpg",
      size: 3
    },
];

describe("Cartpage", () => {

    beforeEach(async () => {
        window.history.pushState({}, "", "/cart");
    })

    //TC-XXX NO numbers currently existing, fill these in once numbering is set
    it("Should render Cart page", async () => {
        render(<App/>);
        await waitFor(() => {
            expect(screen.getByRole('link', {name: /Green Logistics/})).toBeInTheDocument();
        });
    })

    //TC-XXX+1
    it("Should render cart items correctly", () => {
        renderWithCart(mockCartItems);

        // Product name check
        expect(screen.getByText("Cool Hat")).toBeInTheDocument();
        expect(screen.getByText("Fancy Shoes")).toBeInTheDocument();

        // Base Price check
        expect(screen.getAllByRole("cell").find((cell) =>
            cell.textContent?.replace(/\s+/g, "") === "$25"
        )).toBeInTheDocument();
        expect(screen.getAllByRole("cell").find((cell) =>
            cell.textContent?.replace(/\s+/g, "") === "$50"
        )).toBeInTheDocument();
    });

    //TC-XXX+2
    it("Should calculate product totals correctly", () => {
        renderWithCart(mockCartItems);

        // Total Price check for each product
        expect(screen.getByText("$25.00")).toBeInTheDocument();
        expect(screen.getByText("$100.00")).toBeInTheDocument(); // 2*50=100
    });

    //TC-XXX+3
    it("Should calculate product totals correctly", () => {
        renderWithCart(mockCartItems);

        // Total Price check for each product
        expect(screen.getByText("$25.00")).toBeInTheDocument();
        expect(screen.getByText("$100.00")).toBeInTheDocument(); // 2*50=100
    });

    //TC-XXX+4
    it("Should calculate sub-total and total correctly", () => {
        renderWithCart(mockCartItems);

        expect(screen.getByText("$125.00")).toBeInTheDocument();
        expect(screen.getByText("$157.00")).toBeInTheDocument();
    })

})