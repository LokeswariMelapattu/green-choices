import React from 'react';
import { render, screen, waitFor, within, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach} from "vitest";
import "@testing-library/jest-dom/vitest";
import Home from "../Home.jsx";
import styles from "../Home.module.css";
import { store } from "../../../redux/store";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";


const mockProducts = [
    {
      productId: '1',
      name: 'Cool Shoes',
      img: '/shoes.jpg',
      price: 99.99,
    },
    {
      productId: '2',
      name: 'Trendy Hat',
      img: '/hat.jpg',
      price: 49.99,
    },
];

function renderHome() { 
      return render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/home']}>
            <Home />
          </MemoryRouter >
        </Provider>
      );
}
vi.mock('@/hooks/useProducts', async (importOriginal) => {
    const mod = await importOriginal();
    return {
        ...mod,
        default: vi.fn(() => ({
            products: [],
            loading: false,
            error: null,
        })),
    };
});

// doesn't need any complexities
vi.mock('@/hooks/useUser', () => ({
    default: () => ({
      user: null,
      loading: false,
      error: null
    }),
}));

vi.mock('@/hooks/useOrder', () => ({
    default: () => ({
      order: null,
      loading: false,
      error: null
    }),
}));

describe("Homepage", () => {

    beforeEach(async () => {
        
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockClear();
        cleanup();
        
        window.history.pushState({}, "", "/home");
    });

    //TC-029
    it("Should render Home page", async () => {

        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
            products: mockProducts
        }));

        renderHome();

        await waitFor(() => {
            expect(screen.getByRole('link', {name: /Green Logistics/})).toBeInTheDocument();
        });
    });

    //TC-030
    it("Should display top section", async () => {
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
            products: mockProducts
        }));
        renderHome();

        await waitFor(() => {
            expect(screen.getByRole('heading', {level: 1, name: /FLASH SALE!!/})).toBeInTheDocument();
        });
    });

    //TC-031
    it("Should display products and categories", async () => {
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
            products: mockProducts
        }));
        renderHome();

        await waitFor(async () => {
            const trendingHeading = await screen.findByRole('heading', { name: /Trending Now/ });
            const bestDealsHeading = await screen.findByRole('heading', { name: /Best Deals/ });

            expect(trendingHeading).toBeInTheDocument();
            const trendingGrid = trendingHeading.nextElementSibling;
            expect(trendingGrid.children.length).toBeGreaterThan(0);

            expect(bestDealsHeading).toBeInTheDocument();
            const bestDealsGrid = bestDealsHeading.nextElementSibling;
            expect(bestDealsGrid.children.length).toBeGreaterThan(0);
        });
    })

    // TC-032
    it("Should contain product details", async () => {
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
            products: mockProducts
        }));
        renderHome();

        await waitFor(async () => {
            const trendingHeading = await screen.findByRole('heading', { name: /Trending Now/ });
            const bestDealsHeading = await screen.findByRole('heading', { name: /Best Deals/ });

            const trendingGrid = trendingHeading.nextElementSibling;
            const trendingArray = Array.from(trendingGrid.children);

            trendingArray.forEach((product, index) => {
                const utils = within(product);
                expect(utils.getByRole('img')).toHaveAttribute('src', mockProducts[index].img);
                expect(utils.getByRole('heading', { level: 3 })).toHaveTextContent(mockProducts[index].name);
                expect(utils.getByRole('paragraph')).toHaveTextContent('$' + mockProducts[index].price);
            });

            const bestDealsGrid = bestDealsHeading.nextElementSibling;
            const bestDealsArray = Array.from(bestDealsGrid.children);

            bestDealsArray.forEach((product, index) => {
                const utils = within(product);
                expect(utils.getByRole('img')).toHaveAttribute('src', mockProducts[index].img);
                expect(utils.getByRole('heading', { level: 3 })).toHaveTextContent(mockProducts[index].name); 
                expect(utils.getByRole('paragraph')).toHaveTextContent('$' + mockProducts[index].price);
            });
        });
    });

    //TC-033
    it("Should open up product modal", async () => {
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
            products: mockProducts
        }));
        renderHome();

        await waitFor(async () => {
            const trendingHeading = await screen.findByRole('heading', { name: /Trending Now/ });
            const trendingGrid = trendingHeading.nextElementSibling;
            const trendingArray = Array.from(trendingGrid.children);

            const product = trendingArray[0];

            fireEvent.click(product);

            const modal = document.querySelector(`.${styles.modalContainer}`)

            expect(modal).toBeInTheDocument();
            expect(within(modal).getByAltText("Caliber Canvas Suede Shoes")).toHaveAttribute('src', mockProducts[0].img);
            expect(within(modal).getByRole('heading', { level: 1 })).toHaveTextContent(mockProducts[0].name); 
            expect(within(modal).getByText(`$ ${mockProducts[0].price}`)).toBeInTheDocument();

        });
    })

    //TC-034
    it("Should close modal when X is pressed", async () => {
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
            products: mockProducts
        }));
        renderHome();

        await waitFor(async () => {
            const trendingHeading = await screen.findByRole('heading', { name: /Trending Now/ });
            const trendingGrid = trendingHeading.nextElementSibling;
            const trendingArray = Array.from(trendingGrid.children);

            const product = trendingArray[0];

            fireEvent.click(product);

            const modal = document.querySelector(`.${styles.modalContainer}`)

            expect(modal).toBeInTheDocument();
            
            const button = within(modal).getByRole('button', {name: /close product quick view/i});

            fireEvent.click(button);

            const modal2 = document.querySelector(`.${styles.modalContainer}`)

            expect(modal2).toBeNull();

        });
    })

    //TC-035
    it("Should close modal and add to cart when add cart is pressed", async () => {
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
            products: mockProducts
        }));
        renderHome();

        await waitFor(async () => {
            const trendingHeading = await screen.findByRole('heading', { name: /Trending Now/ });
            const trendingGrid = trendingHeading.nextElementSibling;
            const trendingArray = Array.from(trendingGrid.children);

            const product = trendingArray[0];

            fireEvent.click(product);

            const modal = document.querySelector(`.${styles.modalContainer}`)
            
            const button = within(modal).getByText("Add to Cart");

            fireEvent.click(button);

            const modal2 = document.querySelector(`.${styles.modalContainer}`)
            expect(modal2).toBeNull();

            expect(screen.getByText("Product added to cart!")).toBeInTheDocument();
            expect(screen.getByText("Go to Cart")).toBeInTheDocument();

        });
    })

    //TC-036
    it("Should be able to redirect to other correct pages", async () => {
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
          products: mockProducts
        }));
        renderHome();
      
        // Click on Home link and check the route change
        fireEvent.click(screen.getByText("Home"));
        await screen.findByText("FLASH SALE!!"); // Ensure that the content updates after navigation
      
        // Repeat for other links
        fireEvent.click(screen.getByText("Shop"));
        await screen.findByText("FLASH SALE!!");
      
        fireEvent.click(screen.getByText("Order History"));
        // await screen.findByText((content, element) => {
        //     return element.textContent.includes('Active Orders');
        //   });
      });

    //TC-037
    it("Should show fallback message when backend has no products", async () => {
        const useProducts = (await import('@/hooks/useProducts')).default;
        useProducts.mockImplementationOnce(() => ({
            products: [],
            loading: false,
            error: "Error:",
        }));
        
        window.history.pushState({}, "", "/home");
        renderHome();

        await waitFor(async () => {
            expect(screen.getByText(/Error:/i)).toBeInTheDocument();
        });
        

    })
})