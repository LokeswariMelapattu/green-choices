import React from 'react';
import { render, screen, waitFor, within, fireEvent, cleanup, act } from "@testing-library/react";
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

// Mock for TC-014...015
vi.mock('@/hooks/useUser', () => ({
    default: () => ({
        user: null,
        loading: false,
        error: null,
        checkCredentials: vi.fn(async (e, p) => {
            if (e == 'john.doe@example.com' && p == 'password123') {
                return {"success":true,
                    "data":{
                        "userid":1,
                        "firstname":"John",
                        "lastname":"Doe",
                        "address":"1234 Elm Street",
                        "email":"john.doe@example.com",
                        "createdat":"2025-04-17T12:44:21.747Z",
                        "updatedat":"2025-04-17T12:44:21.747Z",
                        "username":"John Doe"
                    }
                }
            }
            else {
                return {"success":false,"error":"User not found"}
            }
        })
    }),
    
}));

describe('Loginpage', () => {
    
    beforeEach(async () => {
        const useUser = (await import('@/hooks/useUser')).default();
        cleanup();
        useUser.checkCredentials.mockClear();       
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
        //const checkCredentials = vi.spyOn( (await import('@/hooks/useUser')).default(), 'checkCredentials');        
        
        render(<App/>);

        let usernamePrompt = await screen.getByPlaceholderText('Email', {selector: 'input'});
        let passwordPrompt = await screen.getByPlaceholderText('Password', {selector: 'input'});
        await act(async () => {
            await fireEvent.change(usernamePrompt, {target:{value: testCreds.trueEmail}});
            await fireEvent.change(passwordPrompt, {target:{value: testCreds.truePassw}});
            //usernamePrompt.value = testCreds.trueEmail;
            //passwordPrompt.value = testCreds.truePassw;
            expect(await fireEvent.click(screen.getByRole('button', {name: /Login/}))).toBeTruthy();
        });
        await waitFor(() => {
            //expect(checkCredentials).toHaveBeenCalledWith(testCreds.trueEmail, testCreds.truePassw);
            expect(window.location.href).toContain('/home');
        });
    });
    
    //TC-015 TODO extra?
    it.skip("Should display error on incorrect username or password", async () => {     
        
        render(<App/>);

        let usernamePrompt = await screen.getByPlaceholderText('Email', {selector: 'input'});
        let passwordPrompt = await screen.getByPlaceholderText('Password', {selector: 'input'});
        await act(async () => {
            await fireEvent.change(usernamePrompt, {target:{value: testCreds.falseEmail}});
            await fireEvent.change(passwordPrompt, {target:{value: testCreds.falsePassw}});
            expect(await fireEvent.click(screen.getByRole('button', {name: /Login/}))).toBeTruthy();
        });
        await waitFor(() => {
            expect(screen.getByText('Incorrect Email or Password')).toBeInTheDocument();
            expect(window.location.href).toContain('/login');
        });
    });
    
    //TC-016
    it("Should have a functional 'Forgot password' -link", async () => {
    
        render(<App/>);
        let linkToClick = await screen.getByRole('link', {name: 'Forgot Password?'});
        await act(async () => {
            await fireEvent.click(linkToClick);
        });
        await waitFor(() => {
            expect(window.location.href).toContain('/forgot-password');
        });
    });
    
    //TC-017
    it("Should have a functional 'Signup' -link", async () => {
    
        render(<App/>);
        let linkToClick = await screen.getByRole('link', {name: 'Sign up'});
        await act(async () => {
            await fireEvent.click(linkToClick);
        });
        await waitFor(() => {
            expect(window.location.href).toContain('/signup');
        });
    });
    
    //TC-018
    it("Should mask text in password field", async () => {
    
        render(<App/>);
        
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Password', {selector: 'input'}))
                .toHaveProperty('type', 'password');
        });
        
    });
    
})
