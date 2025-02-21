import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import MapRouting from "./MapRouting";
import { useState, useEffect } from "react";
import { USA, China, mockMarineRouteToUSA, mockAirRouteToUSA } from "../data/routes"
//const Routing = ({ markers, routeType }) => {


const MapComponent = ({ routes, loading, setSelectedOption }) => {
   
    return (
        (!loading &&
            <MapContainer
                zoom={10}
                style={{ height: "60vh", width: "90%" }}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />

                <Marker
                    key={1}
                    position={[51.5074, -0.1278]}
                    icon={L.icon({
                        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                        shadowSize: [41, 41]
                    })}
                >
                    <Popup>{`Source`}</Popup>
                </Marker>

                <Marker
                    key={2}
                    position={[1.3521, 103.8198]}
                    icon={L.icon({
                        iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
                        iconSize: [25, 41],
                        iconAnchor: [12, 41],
                        popupAnchor: [1, -34],
                        shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
                        shadowSize: [41, 41]
                    })}
                >
                    <Popup>{`Destination`}</Popup>
                </Marker>

                <MapRouting routes={routes} setSelectedOption={setSelectedOption}/>
            </MapContainer>
        )
    );
};

export default MapComponent;
