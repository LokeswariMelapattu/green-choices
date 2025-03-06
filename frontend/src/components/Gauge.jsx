import React from 'react';
import { GaugeComponent } from 'react-gauge-component';

const Gauge = ({ value, maxValue }) => {
    // Ensure maxValue is a valid positive number
    const validMaxValue = maxValue > 0 ? maxValue : 600; // Default to 600 if invalid
    
    // Dynamically calculate subArcs based on maxValue
    const subArcs = [
        { limit: validMaxValue * 0.15 },  // First subArc from 0 to 25% of max value
        { limit: validMaxValue * 0.35 },   // Second subArc from 25% to 50% of max value
        { limit: validMaxValue * 0.57 },  // Third subArc from 50% to 75% of max value
        { limit: validMaxValue * 0.78},         // Fourth subArc from 75% to 100% of max value
        { limit: validMaxValue },         // Fourth subArc from 75% to 100% of max value
    ];

    // Correctly adjust limits to always be between minValue (0) and maxValue
    subArcs.forEach(subArc => {
        if (subArc.limit < 0) {
            subArc.limit = 0;  // Set limit to 0 if it's below 0
        }
        if (subArc.limit > validMaxValue) {
            subArc.limit = validMaxValue;  // Set limit to maxValue if it's above maxValue
        }
    });

    return (
        <GaugeComponent
            style={{ width: '100%' }}  // Adjust width for linear gauge
            value={value}  // Current value (carbon emission)
            minValue={0}         // Min value is always 0
            maxValue={validMaxValue}  // Dynamic max value
            type="radial"   // Use radial gauge type
            showLabels={false}
            arc={{
                colorArray: ['#22c55e', '#84cc16', '#fbbf24', '#f97316', '#ef4444'], // ['#5BE12C', '#EA4228'], // Colors based on ranges
                subArcs: subArcs,  // Dynamic subArcs
                padding: 0.02,
                width: 0.3,
                startAngle: 180,  // Set startAngle for radial gauge
                endAngle: 0       // Set endAngle for radial gauge
            }}
            pointer={{
                elastic: true,   // This will create an elastic effect for the pointer (needle)
                animationDelay: 0,
                baseColor: "#fbbf24",  // Change pointer color
                width: 14,        // Change pointer width to make it look like a needle
                height: 80,      // Adjust the height of the needle
                transformOrigin: "bottom center",  // Set transform origin to the bottom for proper rotation
                transform: `rotate(${(value / validMaxValue) * 180}deg)`,  // Dynamically set the rotation
            }}
        />
    );
};

export default Gauge;
