import React, {useState} from 'react'
import useRoutes from '../hooks/useRoutes'
import { AgGauge } from 'ag-charts-react';
import "ag-charts-enterprise"; 

const Comparision = ({ maxValue }) => {
    const [options, setOptions] = useState({
        type: 'linear-gauge',
        direction: 'horizontal',
        background: { fill: 'transparent' },
        scale: {
            min: 0, // Set minimum value to 200
            max: {maxValue}, // Set maximum value to 1000
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
    const {totalEmissions, route} = useRoutes();
    let percentage=0;
    const getEmissionColor = (value) => {
          percentage = (value / maxValue) * 100; 
            // Determine label and color based on percentage
            if (percentage <= 15) {
                return 'bg-green-500';
            } else if (percentage <= 35) {
                return 'bg-lime-500';
            } else if (percentage <= 57) {
                return 'bg-yellow-500';
            } else if (percentage <= 78) {
                return 'bg-orange-500';
            } else {
                return 'bg-red-500';
            } 
    };

    return (
        <div>
            {totalEmissions.map((item, index) => (
                <div key={index} className="mb-4">
                    <div className="flex justify-between mb-6">
                        <span>Option {index+1}</span>
                        <span>{item.minTotalEmissions.toFixed(2)} kgCO₂</span>
                    </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`${getEmissionColor(item.minTotalEmissions)} h-2 rounded-full`}
                            style={{
                                width: `${percentage}%`
                            }}
                        />
                    </div>  
                </div>
            ))}
        </div>
    )
}

export default Comparision