import React from 'react';
import { render, screen, waitFor, within, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach} from "vitest";
import "@testing-library/jest-dom/vitest";
import App from "../../../App.jsx";
import styles from "../Login.module.css";

describe('Loginpage', () => {
    
    beforeEach(async () => {
        cleanup();       
        window.history.pushState({}, "", "/login");
    });
    
    //TC-012
    it("Should render Login page", async () => {

        render(<App/>);

        await waitFor(() => {
            expect(screen.getByRole('button', {name: /Login/})).toBeInTheDocument();
        });
    });
})
