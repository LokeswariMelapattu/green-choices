import React, { useState } from 'react';
import boxIcon from "../../icons/box.svg";
import timeIcon from "../../icons/time.svg";
import leafIcon from "../../icons/leaf.svg";
import { Grid } from '@mui/material';
import "../../styles/checkout.css"

const deliveryOptions = [
    { name: "Option A", price: "$20.00", time: "2 days", emissions: "2000 Kg CO2" },
    { name: "Option B", price: "$15.00", time: "5 days", emissions: "1500 Kg CO2" },
    { name: "Option C", price: "$10.00", time: "8 days", emissions: "1000 Kg CO2" },
];

const DeliveryOptions = ({ selectedOption, setSelectedOption }) => {
    //const [selectedOption, setSelectedOption] = useState(2);
    return (
        <div className='deliveryOptionsSection'>
            <h3 className='subHeading'>Delivery Options</h3>

            <Grid container className="deliveryContainer" spacing={2}>
                {deliveryOptions.map((option, index) => (
                    <Grid
                        key={index}
                        item md={4} xs={12}
                        className={`deliveryOption ${selectedOption === index ? 'selectedDelivery' : ''}`}
                        onClick={() => setSelectedOption(index)}>
                        <div className="option-left">
                            <p>{option.name}</p>
                            <img src={boxIcon} alt="Box Icon" />
                        </div>
                        <div className="option-right">
                            <p className="option-price">{option.price}</p>
                            <p className="option-details">
                                <span><img src={timeIcon} alt="Time Icon" className='deliveryIcon' /></span>{option.time}
                            </p>
                            <p className="option-details">
                                <span><img src={leafIcon} alt="CO2 Icon" className='deliveryIcon' /></span>{option.emissions}
                            </p>
                        </div>
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default DeliveryOptions;
