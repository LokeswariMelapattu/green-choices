import { useState } from 'react';

const useOrder = () => {
  const [order, setOrder] = useState(null); // Stores order data
  const [loading, setLoading] = useState(false); // To track loading state
  const [error, setError] = useState(null); // To track any errors during request

  // Function to create or update an order
  const saveOrder = async (orderData, orderId = null) => {
    setLoading(true);
    setError(null);

    try {
      let response;

      if (orderId) {
        // Update existing order
        response = await fetch(`/api/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
      } else {
        // Create a new order
        response = await fetch('/api/orders', {
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
      const response = await fetch(`/api/orders/${orderId}`);

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

  return {
    order,
    saveOrder,
    getOrderById,
    loading,
    error,
  };
};

export default useOrder;
