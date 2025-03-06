

import React, { useEffect, useState } from 'react';
import Gauge from './Gauge';  
import { useTransport } from '@/context/transport-context';
 
const EmissionMeter = ({ currentValue, maxValue, className = ""  }) => {
     
    // Normalize emissions for the gauge (200–1000 scale to 0–100 scale)
    const normalizedValue1 = Math.min(Math.max(((currentValue) / 600) * 100, 0), 100);
    const normalizedValue = (currentValue / (maxValue)) * 70;
    
    const [currentEmissionValue, setCurrentEmissionValue] = useState("");
    const [label, setLabel] = useState("");
    const [color, setColor] = useState("");
    const { routeTotals } = useTransport(); 
      
    useEffect(() => {
        // Use emissions from routeTotals if available
        if (routeTotals && routeTotals.emissions != null) {
            setCurrentEmissionValue(routeTotals.emissions);
        } else {
            setCurrentEmissionValue(currentValue);
        }
    }, [routeTotals, currentValue]);
useEffect(() => {  
   
    const percentage = (currentEmissionValue / maxValue) * 100;
    console.log(percentage);
    console.log('percentage')
// Determine label and color based on percentage
if (percentage <= 15) {
 setLabel("Low");
 setColor("#22c55e"); // Green
} else if (percentage <= 35) {
 setLabel("Moderate");
 setColor("#84cc16"); // Light green
} else if (percentage <= 57) {
 setLabel("Medium");
 setColor("#fbbf24"); // Yellow
} else if (percentage <= 78) {
 setLabel("High");
 setColor("#f97316"); // Orange
} else {
 setLabel("Critical");
 setColor("#ef4444"); // Red
}
}, [currentEmissionValue, maxValue]);

    return (
        <div className='flex items-center text-center justify-center'>
            <div>
                 <h2 className="text-2xl font-semibold text-center text-gray-800">
                    Carbon Emission
                </h2>
                <Gauge value={currentEmissionValue} maxValue={maxValue}  />
                <p><span  style={{ backgroundColor: color }}>{label}: {currentEmissionValue} Kg</span> </p>
                <p>High: {maxValue} KgCO2</p>
            </div>
        </div>
    );
};

export default EmissionMeter;