import React from 'react';
import { render, screen, waitFor, within, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach} from "vitest";
import "@testing-library/jest-dom/vitest";
import App from "../../../App.jsx";
import styles from "../Login.module.css";

const testCreds = {
    trueEmail: 'john.doe@example.com',
    falseEmail: 'hello world',
    truePassw: 'password123',
    falsePassw: 'incorrect'
}

// TODO make mock for TC-014

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
            expect(screen.getByPlaceholderText('Email', {selector: 'input'})).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Password', {selector: 'input'})).toBeInTheDocument();
        });
    });
    
    //TC-013
    it.skip("Should disable login button if no credentials are entered", async () => {

        render(<App/>);

        await waitFor(() => {
            expect(screen.getByRole('button', {name: /Login/})).toHaveProperty('disabled', true);
        });
    });
    
    //TC-014
    it("Should redirect to /home when correct credentials are entered", async () => {

        render(<App/>);

        await waitFor(() => {
            let usernamePrompt = screen.getByPlaceholderText('Email', {selector: 'input'});
            let passwordPrompt = screen.getByPlaceholderText('Password', {selector: 'input'});
            usernamePrompt.value = testCreds.trueEmail;
            passwordPrompt.value = testCreds.truePassw;
            console.log(window.location.href);
            expect(fireEvent.click(screen.getByRole('button', {name: /Login/}))).toBeTruthy();
            expect(window.location.href).toContain('/home');
            console.log(window.location.href);
        });
    });
    
})
