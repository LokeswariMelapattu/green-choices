import React from 'react';
import Gauge from './Gauge';
import "../../styles/checkout.css";
import { LOW_EMISSION, HIGH_EMISSION } from '../../data/constants';

const CarbonEmissionMeter = ({ selectedRoute }) => {
    // Extract carbon emissions from the selected route
    const carbonEmissions = selectedRoute ? selectedRoute.metrics.carbonEmissions.minimum : 200;

    // Normalize emissions for the gauge (200–1000 scale to 0–100 scale)
    const normalizedValue = Math.min(Math.max(((carbonEmissions - 100) / HIGH_EMISSION) * 100, 0), 100);

    return (
        <div className='carbonMeterSection'>
            <div>
                <h3 className='subHeading'>Carbon Emission</h3>
                {/* Pass normalized value to the Gauge */}
                <Gauge value={normalizedValue} />
                <p>Emissions: {carbonEmissions} Kg CO2</p>
                <p>Low: {LOW_EMISSION} Kg — High: {HIGH_EMISSION} Kg</p>
            </div>
        </div>
    );
};

export default CarbonEmissionMeter;
