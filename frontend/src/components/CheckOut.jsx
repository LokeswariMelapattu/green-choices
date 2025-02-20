import React, { useState } from 'react'
import { Grid2, Box, Grid } from "@mui/material";
import "../styles/checkout.css";
import MapComponent from './MapComponent';
import RouteDetails from './ui/RouteDetails';
import DeliveryOptions from './ui/DeliveryOptions';
import CarbonEmissionMeter from './ui/CarbonEmissionMeter';
import ComparisonGauge from './ui/ComparisonGauge';
import OrderSummary from './ui/OrderSummary';

const CheckOut2 = () => {
    const [selectedOption, setSelectedOption] = useState(2); // Track selected delivery option

    return (
        <Box className="headingSection">
            <Grid container>
                <Grid item md={9}>
                    <h2 className="checkoutHeading">Checkout</h2>
                    <MapComponent source={"Singapore, Singapore"} destination={"London, UK"} setSelectedOption={setSelectedOption} />
                    <DeliveryOptions selectedOption={selectedOption} 
                        setSelectedOption={setSelectedOption} />

                    <Grid container className='routeOuterContainer'>
                        <Grid item md={7}>
                            <RouteDetails />
                        </Grid>
                        <Grid item md={4} className='carbonMeterContainer'>
                            <CarbonEmissionMeter />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item md={3} >
                    <h2 style={{ fontSize: "20px" }}>Comparison</h2>
                    <ComparisonGauge />
                    <OrderSummary />
                </Grid>
            </Grid>
        </Box>
    )
}

export default CheckOut2
