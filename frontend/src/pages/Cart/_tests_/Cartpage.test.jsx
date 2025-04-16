import React from 'react';
import { render, screen, waitFor, fireEvent} from "@testing-library/react";
import { describe, it, expect} from "vitest";
import cartReducer from "../../../redux/slices/cartSlice";
import "@testing-library/jest-dom/vitest";
import App from "../../../App.jsx";
import Cart from "@/pages/Cart/Cart";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";

const mockStore = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState: {
    cart: {
      items: [
        { name: "Hat", price: 25, quantity: 1, img: "/hat.jpg", size: 2 },
      ],
    },
  },
});

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

const mockCartItems1 = [
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

const mockCartItems2 = [
  {
    name: "Cooler Hat",
    price: 29.99,
    quantity: 3,
    img: "/hat.jpg",
    size: 3
  },
  {
    name: "Regular Shoes",
    price: 35.50,
    quantity: 2,
    img: "/shoes.jpg",
    size: 3
  },
];

describe("Cartpage", () => {

  //TC-052
  it("Should render Cart page", async () => {
    window.history.pushState({}, "", "/cart");
    render(<App/>);
    await waitFor(() => {
        expect(screen.getByRole('link', {name: /Green Logistics/})).toBeInTheDocument();
    });
  })

  //TC-053
  it("Should render cart items correctly", () => {
    // 1st test items
    renderWithCart(mockCartItems1);

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

    // 2nd test items
    renderWithCart(mockCartItems2);

    // Product name check
    expect(screen.getByText("Cooler Hat")).toBeInTheDocument();
    expect(screen.getByText("Regular Shoes")).toBeInTheDocument();

    // Base Price check
    expect(screen.getAllByRole("cell").find((cell) =>
        cell.textContent?.replace(/\s+/g, "") === "$29.99"
    )).toBeInTheDocument();
    expect(screen.getAllByRole("cell").find((cell) =>
        cell.textContent?.replace(/\s+/g, "") === "$35.5"
    )).toBeInTheDocument();
  });

  //TC-054
  it("Should calculate product totals correctly", () => {
    renderWithCart(mockCartItems1);

    // Total Price check for each product
    expect(screen.getByText("$25.00")).toBeInTheDocument();
    expect(screen.getByText("$100.00")).toBeInTheDocument(); // 2*50=100

    renderWithCart(mockCartItems2);

    // Total Price check for each product
    expect(screen.getByText("$89.97")).toBeInTheDocument();
    expect(screen.getByText("$71.00")).toBeInTheDocument(); // 2*35.50=71
  });

  //TC-055
  it("Should calculate sub-total and total correctly", () => {
    renderWithCart(mockCartItems1);

    expect(screen.getByText("$125.00")).toBeInTheDocument();
    expect(screen.getByText("$157.00")).toBeInTheDocument();

    renderWithCart(mockCartItems2);

    expect(screen.getByText("$160.97")).toBeInTheDocument();
    expect(screen.getByText("$192.97")).toBeInTheDocument();
  });

  //TC-056
  it("Should handle no items in the cart", () => {
    renderWithCart([]);

    const tbody = document.querySelector('tbody');

    expect(tbody).toBeInTheDocument();
    expect(tbody?.children.length).toBe(0);


  });

  //TC-057
  it("Should proceed to checkout page", async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter initialEntries={["/cart"]}>
          <Routes>
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<div>Checkout Page</div>} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );
  
    const button = screen.getByText(/Proceed to Checkout/i);
    fireEvent.click(button);
  
    expect(screen.getByText("Checkout Page")).toBeInTheDocument();
  });

})