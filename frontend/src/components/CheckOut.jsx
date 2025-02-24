import React, { useState, useEffect } from 'react'
import { Grid2, Box, Grid } from "@mui/material";
import "../styles/checkout.css";
import MapComponent from './MapComponent';
import RouteDetails from './ui/RouteDetails';
import DeliveryOptions from './ui/DeliveryOptions';
import CarbonEmissionMeter from './ui/CarbonEmissionMeter';
import ComparisonGauge from './ui/ComparisonGauge';
import OrderSummary from './ui/OrderSummary'; 

import { SOURCE, DESTINATION, BACKEND_API_URL } from '../data/constants';
const CheckOut2 = () => {
    const [selectedOption, setSelectedOption] = useState(2); // Track selected delivery option
    const [selectedRoute, setSelectedRoute] = useState(null); 
    const [routes, setRoutes] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
   
    useEffect(() => { 
        fetchRoutes(); 
    }, []);
 
    const fetchRoutes = async () => {
        try {
            const response = await fetch(`${BACKEND_API_URL}find-routes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    source: SOURCE,
                    destination: DESTINATION
                })
            });

            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }

            const data = await response.json();
            console.log(data);
            setRoutes(data);
            setSelectedRoute(data.routes[2]);
            //setSourceGeoLocation(data.routes[0].segments[0].fromGeoLocation);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p>Loading routes...</p>;
    if (error) return <p>Error: {error}</p>;
    return (
        <Box className="headingSection">
            <Grid container>
                <Grid item md={9}>
                    <h2 className="checkoutHeading">Checkout</h2>
                    <MapComponent routes={routes} loading={loading} setSelectedOption={setSelectedOption} />
                    <DeliveryOptions  routes={routes} selectedOption={selectedOption} 
                        setSelectedOption={setSelectedOption} setSelectedRoute={setSelectedRoute} />

                    <Grid container className='routeOuterContainer'>
                        <Grid item md={7}>
                            <RouteDetails key={selectedRoute?.routeNumber || 'default'} selectedRoute={selectedRoute} />
                        </Grid>
                        <Grid item md={4} className='carbonMeterContainer'>
                            <CarbonEmissionMeter  routes={routes} selectedRoute={selectedRoute} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={3} >
                    <h2 style={{ fontSize: "20px" }}>Comparison</h2>
                    <ComparisonGauge routes={routes} />
                    <OrderSummary />
                </Grid>
            </Grid>
        </Box>
    )
}

export default CheckOut2
