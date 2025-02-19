import React from 'react'
import { Grid2, Box, Grid } from "@mui/material";
import "../styles/checkout.css";
import MapComponent from './MapComponent';
import RouteDetails from './ui/RouteDetails';
import DeliveryOptions from './ui/DeliveryOptions';
import CarbonEmissionMeter from './ui/CarbonEmissionMeter';

const CheckOut2 = () => {
    return (
        <Box className="headingSection">
            <Grid container>
                <Grid item md={9}>
                    <h2 className="checkoutHeading">Checkout</h2>
                    <MapComponent source={"Toronto, Canada"} destination={"Sydney, Australia"} />
                    <DeliveryOptions />

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
                    <h2>Comparison</h2>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CheckOut2
