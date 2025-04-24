import React from 'react';
import { render, screen, waitFor, within, fireEvent, cleanup, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach} from "vitest";
import "@testing-library/jest-dom/vitest";
import Login from '../Login'; 
import { Provider } from "react-redux"; 
import { store } from "../../../redux/store"; 
import { Router } from "react-router-dom"; 
import { createMemoryHistory } from 'history';

const testCreds = {
    trueEmail: 'john.doe@example.com',
    falseEmail: 'hello world',
    truePassw: 'password123',
    falsePassw: 'incorrect'
}
const history = createMemoryHistory({ initialEntries: ['/login'] });


function renderLogin() { 
      return render(
        <Provider store={store}> 
          <Router location={history.location} navigator={history}>
            <Login />
          </Router >
        </Provider>
      );
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
    renderLogin();

    beforeEach(async () => {
        const useUser = (await import('@/hooks/useUser')).default();
        cleanup();
        useUser.checkCredentials.mockClear();       
        window.history.pushState({}, "", "/login");
    });
    
    //TC-012
    it("Should render Login page", async () => {

        renderLogin();

        await waitFor(() => {
            expect(screen.getByRole('button', {name: /Login/})).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Email', {selector: 'input'})).toBeInTheDocument();
            expect(screen.getByPlaceholderText('Password', {selector: 'input'})).toBeInTheDocument();
        });
    });
    
    //TC-013
    it("Should disable login button if no credentials are entered", async () => {

        renderLogin();

        await waitFor(() => {
            expect(screen.getByRole('button', {name: /Login/})).toHaveProperty('disabled', true);
        });
    });
    
    //TC-014
    it("Should redirect to /home when correct credentials are entered", async () => {
        //const checkCredentials = vi.spyOn( (await import('@/hooks/useUser')).default(), 'checkCredentials');        
        
        renderLogin();

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
           expect(history.location.pathname).toBe('/home');
        });
    });
    
    //TC-015
    it("Should display error on incorrect username and password", async () => {     
        
        renderLogin();

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
    it("Should display error on incorrect password", async () => {     
        
        renderLogin();

        let usernamePrompt = await screen.getByPlaceholderText('Email', {selector: 'input'});
        let passwordPrompt = await screen.getByPlaceholderText('Password', {selector: 'input'});
        await act(async () => {
            await fireEvent.change(usernamePrompt, {target:{value: testCreds.trueEmail}});
            await fireEvent.change(passwordPrompt, {target:{value: testCreds.falsePassw}});
            expect(await fireEvent.click(screen.getByRole('button', {name: /Login/}))).toBeTruthy();
        });
        await waitFor(() => {
            expect(screen.getByText('Incorrect Email or Password')).toBeInTheDocument();
            expect(window.location.href).toContain('/login');
        });
    });
    it("Should display error on incorrect username", async () => {     
        
        renderLogin();

        let usernamePrompt = await screen.getByPlaceholderText('Email', {selector: 'input'});
        let passwordPrompt = await screen.getByPlaceholderText('Password', {selector: 'input'});
        await act(async () => {
            await fireEvent.change(usernamePrompt, {target:{value: testCreds.falseEmail}});
            await fireEvent.change(passwordPrompt, {target:{value: testCreds.truePassw}});
            expect(await fireEvent.click(screen.getByRole('button', {name: /Login/}))).toBeTruthy();
        });
        await waitFor(() => {
            expect(screen.getByText('Incorrect Email or Password')).toBeInTheDocument();
            expect(window.location.href).toContain('/login');
        });
    });
    
    //TC-016
    it("Should have a functional 'Forgot password' -link", async () => {
    
        renderLogin();
        let linkToClick = await screen.getByRole('link', {name: 'Forgot Password?'});
        await act(async () => {
            await fireEvent.click(linkToClick);
        });
        await waitFor(() => { 
            expect(history.location.pathname).toBe('/forgot-password')
        });
    });
    
    //TC-017
    it("Should have a functional 'Signup' -link", async () => {
    
        renderLogin();
        let linkToClick = await screen.getByRole('link', {name: 'Sign up'});
        await act(async () => {
            await fireEvent.click(linkToClick);
        });
        await waitFor(() => {
            expect(history.location.pathname).toBe('/signup'); 
        });
    });
    
    //TC-018
    it("Should mask text in password field", async () => {
    
        renderLogin();
        
        await waitFor(() => {
            expect(screen.getByPlaceholderText('Password', {selector: 'input'}))
                .toHaveProperty('type', 'password');
        });
        
    });
    
    //TC-019
    it("Should display error when no username is entered", async () => {     
        
        renderLogin();

        let usernamePrompt = await screen.getByPlaceholderText('Email', {selector: 'input'});
        let passwordPrompt = await screen.getByPlaceholderText('Password', {selector: 'input'});
        await act(async () => {
            await fireEvent.change(passwordPrompt, {target:{value: testCreds.truePassw}});
            expect(await fireEvent.click(screen.getByRole('button', {name: /Login/}))).toBeTruthy();
        });
        await waitFor(() => {
            expect(screen.getByText('Incorrect Email or Password')).toBeInTheDocument();
            expect(window.location.href).toContain('/login');
        });
    });
    
    //TC-020
    it("Should display error when no password is entered", async () => {     
        
        renderLogin();

        let usernamePrompt = await screen.getByPlaceholderText('Email', {selector: 'input'});
        let passwordPrompt = await screen.getByPlaceholderText('Password', {selector: 'input'});
        await act(async () => {
            await fireEvent.change(usernamePrompt, {target:{value: testCreds.trueEmail}});
            expect(await fireEvent.click(screen.getByRole('button', {name: /Login/}))).toBeTruthy();
        });
        await waitFor(() => {
            expect(screen.getByText('Incorrect Email or Password')).toBeInTheDocument();
            expect(window.location.href).toContain('/login');
        });
    });
})
