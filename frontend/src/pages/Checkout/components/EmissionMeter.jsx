

import React, { useEffect, useState } from 'react';
import Gauge from './Gauge';  
import { useTransport } from '@/context/transport-context';
import styles from "./EmissionMeter.module.css";
const EmissionMeter = ({ currentValue, maxValue, onEmissionsClick,setLowSustainable,  className = ""  }) => {
     
    // Normalize emissions for the gauge (200–1000 scale to 0–100 scale)
    const normalizedValue1 = Math.min(Math.max(((currentValue) / 600) * 100, 0), 100);
    const normalizedValue = (currentValue / (maxValue)) * 70;
    
    const [currentEmissionValue, setCurrentEmissionValue] = useState("");
    const [isLowSustainable, setIsLowSustainable] = useState("");
    const [label, setLabel] = useState("");
    const [color, setColor] = useState("");
    const [showModal, setShowModal] = useState(false);
    const { routeTotals } = useTransport(); 
      
    useEffect(() => {
        // Use emissions from routeTotals if available
        if (routeTotals && routeTotals.emissions != null) {
            setCurrentEmissionValue(routeTotals.emissions);
        } else {
            setCurrentEmissionValue(currentValue);
        }
    }, [routeTotals, currentValue]
);
    useEffect(() => {  
    
        const percentage = (currentEmissionValue / maxValue) * 100;
        if(percentage > 35)
        {
            setIsLowSustainable(true);
            setLowSustainable(true);
        }
        else
        { 
            setIsLowSustainable(false);
            setLowSustainable(false);
        }
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
    }, [currentEmissionValue, maxValue]
);

    return (
        <div className={styles.meterContainer}>
            <div>
                 <h2 className={styles.meterHeading}>
                    Carbon Emission
                </h2>
                <Gauge value={currentEmissionValue} maxValue={maxValue}  />
                <p><span  style={{ backgroundColor: color }}>{label}: {currentEmissionValue} Kg</span> </p>
                <p>High: {maxValue} KgCO2</p>
                
            { isLowSustainable && (
            <div className={styles.imgDiv}>
                
              <img src="/imgs/earth.png" className={styles.reasonImg} />
              
              <p style={{ color: color }} className={styles.reasonLink}
                  onClick={onEmissionsClick}>
                A Little More CO₂ Than We'd Like … But <span
                  className="font-bold "
                >
                  Here's Why
                </span>
              </p>
            </div>
          )}
            </div>
        </div>
         
    );
};

export default EmissionMeter;
