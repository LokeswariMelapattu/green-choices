import React, { useState } from 'react';
import useRoutes from '../../../hooks/useRoutes';
import { AgGauge } from 'ag-charts-react';
import "ag-charts-enterprise";

const Comparision = ({ maxValue }) => {
    const [options, setOptions] = useState({
        type: 'linear-gauge',
        direction: 'horizontal',
        background: { fill: 'transparent' },
        scale: {
            min: 0,
            max: maxValue,
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

    const { totalEmissions, route } = useRoutes();

    const getEmissionColor = (value) => {
        const percentage = (value / maxValue) * 100;
        
        if (percentage <= 15) return 'bg-green-500';
        if (percentage <= 35) return 'bg-lime-500';
        if (percentage <= 57) return 'bg-yellow-500';
        if (percentage <= 78) return 'bg-orange-500';
        return 'bg-red-500';
    };

    return (
        <div>
            {totalEmissions.map((item, index) => (
                <div key={index} className="">
                    <div className="flex justify-between">
                        <span>Option {index + 1}</span>
                        <span>{item.minTotalEmissions.toFixed(2)} kgCO₂</span>
                    </div>

                    <AgGauge
                        options={{
                            ...options,
                            value: item.minTotalEmissions, // Set the normalized emissions value
                            color: getEmissionColor(item.minTotalEmissions), // Dynamically set color
                        }}
                        style={{ height: "60px", width: "100%", marginTop: -10, padding: 0 }}
                    />
                </div>
            ))}
        </div>
    );
};

export default Comparision;
