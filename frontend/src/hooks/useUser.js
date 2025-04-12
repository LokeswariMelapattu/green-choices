import { useState, useEffect } from 'react';
import { VITE_APP_API_URL } from '../data/constants'
import { clearCart } from '../redux/slices/cartSlice';
import { useDispatch } from 'react-redux';

const useUser = () => {
    const [user, setUser] = useState(() => {
        // Load user from localStorage when the hook initializes
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : { success: false };
    }); // Stores user data
    const [loading, setLoading] = useState(false); // To track loading state
    const [error, setError] = useState(null); // To track any errors during request
    const dispatch = useDispatch();

    const checkCredentials = async (email, password) => {
        setLoading(true);
        setError(null);
        console.log(email);

        try {
            const response = await fetch(`${VITE_APP_API_URL}user/check/credentials?email=${email}&password=${password}`);
            const user = await response.json();
            if (user.success) {
                user.data.username = user.data.firstname + " " + user.data.lastname;
            }
            setUser(user);
            localStorage.setItem("user", JSON.stringify(user));
            return user;

        } catch (error) {
            console.error('Error checking user credentials: ', error);
        }
        finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        setError(null);

        try {
            setUser(null);
            localStorage.setItem("user", null);
            localStorage.setItem("cartItems", null);
            dispatch(clearCart());
        } catch (error) {
            console.error('Error logout user: ', error);
        } finally {
            setLoading(false);
        }
    };

    return { user, loading, error, checkCredentials, logout };

};

export default useUser;