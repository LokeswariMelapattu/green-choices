import React from 'react'
import Gauge from './Gauge'
import "../../styles/checkout.css"

const CarbonEmissionMeter = () => {
    return (
        <div className='carbonMeterSection'>
            <div >
                <h3 className='subHeading'>Carbon Emission</h3>
                <Gauge />
                <p>Low: 1000 kg</p>
            </div>
        </div>
    )
}

export default CarbonEmissionMeter
