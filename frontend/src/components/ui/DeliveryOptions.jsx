import React from 'react';
import boxIcon from "../../icons/box.svg";
import timeIcon from "../../icons/time.svg";
import leafIcon from "../../icons/leaf.svg";
import { Grid } from '@mui/material';
import "../../styles/checkout.css";
//import { route } from '../../../../backend/routes/routes';

const deliveryOptions1 = [
    { name: "Option A", price: "$20.00", time: "2 days", emissions: "2000 Kg CO2" },
    { name: "Option B", price: "$15.00", time: "5 days", emissions: "1500 Kg CO2" },
    { name: "Option C", price: "$10.00", time: "8 days", emissions: "1000 Kg CO2" },
];
const DeliveryOptions = ({ routes, selectedOption, setSelectedOption, setSelectedRoute }) => {
    let optionIndex = 0; // Counter for valid options
 
    return (
        <div className='deliveryOptionsSection'>
            <h3 className='subHeading'>Delivery Options</h3>

            <Grid container className="deliveryContainer" spacing={2}>
                {routes.routes.map((option, index) => {
                    // Render only for valid indices
                    if (index === 0 || index === 2 || index === 3) {
                        optionIndex++; // Increment the counter for valid options

                        return (
                            <Grid
                                key={index}
                                item md={4} xs={12}
                                className={`deliveryOption ${selectedOption === index ? 'selectedDelivery' : ''}`}
                                onClick={() => {
                                    setSelectedOption(index);
                                    setSelectedRoute(option);
                                    console.log('Selected Option:', index);
                                    console.log('Selected Route:', option);
                                }}
                            >
                                <div className="option-left">
                                    <p>Option {optionIndex}</p> {/* Use counter here */}
                                    <img src={boxIcon} alt="Box Icon" />
                                </div>
                                <div className="option-right">
                                    <p className="option-price">${option.metrics.cost.minimum}</p>
                                    <p className="option-details">
                                        <span><img src={timeIcon} alt="Time Icon" className='deliveryIcon' /></span>{option.metrics.duration.minimum} days
                                    </p>
                                    <p className="option-details">
                                        <span><img src={leafIcon} alt="CO2 Icon" className='deliveryIcon' /></span>{option.metrics.carbonEmissions.minimum} Kg CO2
                                    </p>
                                </div>
                            </Grid>
                        );
                    }

                    // Return null for invalid indices
                    return null;
                })}
            </Grid>
        </div>
    );
};

export default DeliveryOptions;
