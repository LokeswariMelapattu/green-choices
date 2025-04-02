import { useState, useEffect } from 'react';
import { VITE_APP_API_URL } from '../data/constants'

const useUser = () => {
    const [user, setUser] = useState(null); // Stores user data
    const [loading, setLoading] = useState(false); // To track loading state
    const [error, setError] = useState(null); // To track any errors during request

    const checkCredentials = async (email, password) => {
        setLoading(true);
        setError(null);
        console.log(email);

        try {
            const response = await fetch(`${VITE_APP_API_URL}user/check/credentials?email=${email}&password=${password}`);
            const user = await response.json();
            setUser(user);
            return user;

        } catch (error) {
            console.error('Error fetching user: ', error);
        }
        finally {
            setLoading(false);
        }
    };

    return {user, loading, error, checkCredentials};
    
};

export default useUser;