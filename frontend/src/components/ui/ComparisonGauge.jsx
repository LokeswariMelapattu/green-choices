import React, { useState } from 'react';
import { AgGauge } from 'ag-charts-react';
import leafIcon from "../../icons/leaf.svg";
import "ag-charts-enterprise";
import { LOW_EMISSION, HIGH_EMISSION } from '../../data/constants';

const ComparisonGauge = ({ routes }) => {
    const [options, setOptions] = useState({
        type: 'linear-gauge',
        direction: 'horizontal',
        background: { fill: 'transparent' },
        scale: {
            min: {LOW_EMISSION}, // Set minimum value to 200
            max: 600, // Set maximum value to 1000
            label: { enabled: false },
        },
        cornerRadius: 99,
        cornerMode: 'container',
        segmentation: {
            enabled: false,
            interval: { count: 10 },
            spacing: 2,
        },
    });

    return (
        <div className="linearGaugeContainer">
            {routes.routes.map((option, index) => {
                if (index === 0 || index === 2 || index === 3) { // Displaying certain options
                    const emissions = option.metrics.carbonEmissions.minimum; // Get emissions from the route

                    // Normalize the emissions within the range of 200 - 1000
                    const normalizedEmissions = Math.min(Math.max(emissions, 200), 1000);

                    return (
                        <div key={index} className="linearGaugeItem">
                            <div className="linearGauge">
                                <p>Option {index + 1}</p> {/* Display option number */}
                                <p>
                                    <img src={leafIcon} className="deliveryIcon" alt="CO2 Icon" />
                                    <span>{emissions} Kg CO2</span>
                                </p>
                            </div>

                            <AgGauge
                                options={{
                                    ...options,
                                    value: normalizedEmissions, // Set the normalized emissions value
                                }}
                                style={{ height: "60px", width: "100%" }}
                            />
                        </div>
                    );
                }
                return null; // Skip other options if not the desired ones
            })}
        </div>
    );
};

export default ComparisonGauge;
