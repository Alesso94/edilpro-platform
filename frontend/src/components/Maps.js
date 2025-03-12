import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { GOOGLE_MAPS_API_KEY } from '../config/keys';

const Maps = ({ professional }) => {
    const mapStyles = {
        height: "300px",
        width: "100%"
    };

    const defaultCenter = {
        lat: 41.9028, // Roma centro
        lng: 12.4964
    };

    return (
        <div className="map-container">
            <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={13}
                    center={defaultCenter}
                >
                    <Marker position={defaultCenter} />
                </GoogleMap>
            </LoadScript>
        </div>
    );
};

export default Maps;