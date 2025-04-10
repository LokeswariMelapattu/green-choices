import { useCallback, useState } from 'react';
import { VITE_APP_API_URL } from '../data/constants'

const useOrder = () => {
  const [order, setOrder] = useState(null); // Stores order data
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(null); // To track any errors during request

  // Function to create or update an order
  const saveOrder = async (orderData, orderId = null) => {
    setLoading(true);
    setError(null);
    console.log(orderData);
    try {
      let response;

      if (orderId) {
        // Update existing order
        response = await fetch(`${VITE_APP_API_URL}orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      } else {
        // Create a new order
        response = await fetch(`${VITE_APP_API_URL}orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      }

      if (!response.ok) {
        throw new Error(`Error saving/updating order: ${response.statusText}`);
      }

      const data = await response.json();
      setOrder(data.data); // Set the order data to state
      setLoading(false);
      return data.data; // Return the order data
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw new Error('Error saving/updating order: ' + err.message);
    }
  };

  // Function to retrieve order by ID
  const getOrderById = async (orderId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${VITE_APP_API_URL}orders/${orderId}`);

      if (!response.ok) {
        throw new Error(`Error fetching order: ${response.statusText}`);
      }

      const data = await response.json();
      setOrder(data.data); // Set the order data to state
      setLoading(false);
      return data.data; // Return the order data
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw new Error('Error retrieving order: ' + err.message);
    }
  };

  const getAllUserOrders = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${VITE_APP_API_URL}orders/user/${userId}`);

      if (!response.ok) {
        throw new Error(`Error fetching user orders: ${response.statusText}`);
      }

      const data = await response.json();
      setOrders(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw new Error(`Error retrieving user orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getActiveOrders = async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${VITE_APP_API_URL}orders/user/${userId}/active-with-route`);

      if (!response.ok) {
        throw new Error(`Error fetching active orders: ${response.statusText}`);
      }

      const data = await response.json();
      setOrders(data.data);
      return data.data;
    } catch (err) {
      setError(err.message);
      throw new Error(`Error retrieving active orders: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderRoute = async (routeInfo) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_APP_API_URL}update-route`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(routeInfo),
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to update route: ${response.statusText}`);
      }

      const updatedRoute = await response.json();
      return updatedRoute;
    } catch (err) {
      console.error('Error updating route:', err);
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    order,
    saveOrder,
    getOrderById,
    getAllUserOrders,
    getActiveOrders,
    updateOrderRoute,
    loading,
    error,
  };
};

export default useOrder;
