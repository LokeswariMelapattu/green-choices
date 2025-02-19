import React from 'react'
import '../../styles/checkout.css'
import pinIcon from "../../icons/pin.svg"
import shipIcon from "../../icons/ship.svg"
import planeIcon from "../../icons/aeroplane.svg"
import carIcon from "../../icons/truck.svg"
import leafIcon from "../../icons/leaf.svg"
import timeIcon from "../../icons/time.svg"


const RouteDetails = () => {
    const transportIcons = {
        marine: shipIcon,
        aeroplane: planeIcon,
        car: carIcon,
    };

    const destinations = [
        { location: "China - Beijing", transport: "marine", distance: "1200km", time: "2 days", carbon: "400 kg CO2" },
        { location: "India - Odisha", transport: "aeroplane", distance: "1200km", time: "1 day", carbon: "400 kg CO2" },
        { location: "Turkey - Istanbul", transport: "car", distance: "1200km", time: "2 days", carbon: "200 kg CO2" },
        { location: "Finland - Helsinki", transport: null, distance: "", time: "", carbon: "" },
    ];
    return (
        <div className="routeSection">
            <h3 className='subHeading'>Route Details </h3>
            <div className="routeContainer">
                {destinations.map((destination, index) => (
                    <div key={index} className="routeItem">
                        <div className="route">
                            <img src={pinIcon} className="routeIcon" alt="location" />
                            <span>{destination.location}</span>
                        </div>

                        {/* Show transport details only if available */}
                        {destination.transport && (
                            <div className="routeDetails">
                                <div className="mode">
                                    <img src={transportIcons[destination.transport]} className="routeIcon" alt={destination.transport} />
                                    <span>{destination.distance}</span>
                                </div>
                                <div className="horizontal-line" />
                                <div className="time">
                                    <img src={timeIcon} className="routeIcon" alt="time" />
                                    <span>{destination.time}</span>
                                </div>
                                <div className="horizontal-line" />
                                <div className="carbon">
                                    <img src={leafIcon} className="routeIcon" alt="carbon" />
                                    <span>{destination.carbon}</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default RouteDetails
