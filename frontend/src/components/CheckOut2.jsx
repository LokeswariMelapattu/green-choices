import React from 'react'
import { Grid2, Box, Grid } from "@mui/material";
import "../styles/checkout.css";
import MapComponent from './MapComponent';
import boxIcon from "../icons/box.svg"
import timeIcon from "../icons/time.svg"
import leafIcon from "../icons/leaf.svg"
import RouteDetails from './ui/RouteDetails';

const CheckOut2 = () => {
    return (
        <Box className="headingSection">
            <Grid container spacing={2}>
                <Grid item md={9}>
                    <h2 className="checkoutHeading">Checkout</h2>
                    {/* <MapComponent source={"Toronto, Canada"} destination={"Sydney, Australia"} /> */}
                    <div className="dummyMap"></div>
                    <Box className="deliveryOptionsSection">
                        <h3>Delivery Options</h3>

                        <Grid container className="deliveryContainer" spacing={2}>
                            <Grid item md={4} xs={12} className="deliveryOption">
                                <div className="option-left">
                                    <p>Option A</p>
                                    <img src={boxIcon} />
                                </div>
                                <div className="option-right">
                                    <p className="option-price">$10.00</p>
                                    <p className="option-details">
                                        <span><img src={timeIcon} /></span>8 days
                                    </p>
                                    <p className="option-details">
                                        <span><img src={leafIcon} /></span>1000 Kg C02
                                    </p>
                                </div>
                            </Grid>

                            <Grid item md={4} xs={12} className="deliveryOption">
                                <div className="option-left">
                                    <p>Option B</p>
                                    <img src={boxIcon} />
                                </div>
                                <div className="option-right">
                                    <p className="option-price">$10.00</p>
                                    <p className="option-details">
                                        <span><img src={timeIcon} /></span>8 days
                                    </p>
                                    <p className="option-details">
                                        <span><img src={leafIcon} /></span>1000 Kg C02
                                    </p>
                                </div>
                            </Grid>

                            <Grid item md={4} xs={12} className="deliveryOption">
                                <div className="option-left">
                                    <p>Option C</p>
                                    <img src={boxIcon} />
                                </div>
                                <div className="option-right">
                                    <p className="option-price">$10.00</p>
                                    <p className="option-details">
                                        <span><img src={timeIcon} /></span>8 days
                                    </p>
                                    <p className="option-details">
                                        <span><img src={leafIcon} /></span>1000 Kg C02
                                    </p>
                                </div>
                            </Grid>
                        </Grid>
                        <RouteDetails />
                    </Box>
                </Grid>
                <Grid item md={3}>
                    <h2>Comparison</h2>
                </Grid>
            </Grid>
        </Box>
    )
}

export default CheckOut2
