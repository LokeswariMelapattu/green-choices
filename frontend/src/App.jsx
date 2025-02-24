import { useState } from 'react'
import './App.css'
import CheckOut from './components/CheckOut';
import "@fontsource/public-sans/300.css";
import "@fontsource/public-sans/400.css";
import "@fontsource/public-sans/500.css";
import "@fontsource/public-sans/700.css";
import "@fontsource/public-sans/800.css";


export default function App() {

  // Sample delivery details
  const deliveryDetails = {
    name: "Mikael Andersson",
    phone: "+358 44 9324367",
    address: "Tutkijankatu 5 B 23",
    city: "Tampere",
    postalCode: "33720",
    country: "Finland"
};

// Sample order summary
const orderSummary = {
    itemsTotal: "12,18",
    shippingCost: 0,
    total: "12,18",
    itemCount: 2
};

// Sample delivery routes (mock data for now)
const deliveryRoutes = [
    { id: 1, from: [61.498419, 23.775704], to: [60.170054, 24.941279], type: "Marine" },
    { id: 2, from: [61.498419, 23.775704], to: [59.3293, 18.0686], type: "Air" }
];

return (
  <div className="app-container">
    <CheckOut />
  </div>
)
}