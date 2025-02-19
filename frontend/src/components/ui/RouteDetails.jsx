import React from 'react'
import pinIcon from "../../icons/pin.svg"
import shipIcon from "../../icons/ship.svg"
import leafIcon from "../../icons/leaf.svg"
import timeIcon from "../../icons/time.svg"

const RouteDetails = () => {
    return (
        <div className='routeSection'>
            <p>Route Details</p>
            <div className='routeContainer'>
                <div>
                    <div className='route'>
                        <img src={pinIcon} />
                        <span>China - Beijing</span>
                    </div>
                    <div className='routeDetails'>
                        <div>
                            <img src={shipIcon} />
                            <span>1200km</span>
                        </div>
                        <div>
                            <span></span>
                        </div>
                        <div>
                            <img src={timeIcon} />
                            <span>2 days</span>
                        </div>
                        <div>-</div>

                        <div>
                            <img src={leafIcon} />
                            <span>400 kg C02</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default RouteDetails
