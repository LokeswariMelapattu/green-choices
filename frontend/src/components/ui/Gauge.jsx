import React from 'react'
import "../../styles/checkout.css"
import { GaugeComponent } from 'react-gauge-component';

const Gauge = ({ value }) => {
    return (
        <GaugeComponent
            style={{ width: '210px' }}
            value={value}
            type="radial"
            showLabels={false}
            arc={{
                colorArray: ['#5BE12C', '#EA4228'],
                subArcs: [{ limit: 10 }, { limit: 30 }, {}, {}, {}],
                padding: 0.02,
                width: 0.3
            }}
            pointer={{
                elastic: true,
                animationDelay: 0
            }}
        />
    )
}

export default Gauge
