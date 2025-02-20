import React, { useState } from 'react'
import { AgGauge } from "ag-charts-react";
import leafIcon from "../../icons/leaf.svg";
import "ag-charts-enterprise";

const deliveryOptions = [
    { name: "Option A", price: "$10.00", time: "8 days", emissions: "1000 Kg CO2" },
    { name: "Option B", price: "$15.00", time: "5 days", emissions: "1500 Kg CO2" },
    { name: "Option C", price: "$20.00", time: "2 days", emissions: "2000 Kg CO2" }
];

const ComparisonGauge = () => {
    const [options, setOptions] = useState({
        type: "linear-gauge",
        direction: "horizontal",
        background: { fill: 'transparent' },
        value: 100,
        scale: {
            min: 0,
            max: 100,
            label: { enabled: false }
        },
        cornerRadius: 99,
        cornerMode: "container",
        segmentation: {
            enabled: false,
            interval: {
                count: 10,
            },
            spacing: 2,
        },
    });
    return (
        <div className='linearGaugeContainer'>
            {deliveryOptions.map((option, index) => (

                <div key={index} className="linearGaugeItem">
                    <div className="linearGauge">
                        <p>{option.name}</p>
                        <p>
                            <img src={leafIcon} className="deliveryIcon" alt="CO2 Icon" />
                            <span> {option.emissions}</span>
                        </p>
                    </div>

                    <AgGauge
                        options={options}
                        style={{ height: "60px", width: "100%" }}
                    />
                </div>
            ))}
        </div>
    )
}

export default ComparisonGauge
