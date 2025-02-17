import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import MapRouting from "./MapRouting";
import { useEffect } from "react";
import { USA, China, mockMarineRouteToUSA, mockAirRouteToUSA } from "../data/routes"
//const Routing = ({ markers, routeType }) => {


const MapComponent = ({ destination }) => {

    const markers = [
        {
            geocode: [61.498419, 23.775704],
            popUp: "Hello I am Helsinki"
        },
        {
            geocode: [37.553091, -77.476253],
            popUp: "Hello I am Home"
        },
    ];
    

    // const helsinki = [60.170054, 24.941279];
    // const newYork = [40.712776, -74.005974];
    // const shanghai = [31.2304, 121.4737];

    return (
        <MapContainer
            center={[49.525255, -26.850275]} // Center the map on Tampere
            zoom={10}
            style={{ height: "60vh", width: "96%" }}
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={marker.geocode}
                    icon={L.icon({
                        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                        shadowSize: [41, 41]
                    })}
                >
                    <Popup>{marker.popUp}</Popup>
                </Marker>
            ))}
            <MapRouting waypoints={[[61.498419, 23.775704], [60.170054, 24.941279]]} />
        </MapContainer>
    );
};

export default MapComponent;
