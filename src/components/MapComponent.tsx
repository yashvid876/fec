import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapComponentProps {
    latitude?: number;
    longitude?: number;
    height?: string;
    clickable?: boolean;
    onLocationChange?: (lat: number, lng: number) => void;
    markers?: Array<{ id: number; latitude: number; longitude: number; name: string }>;
}

const LocationMarker = ({ onLocationChange }: { onLocationChange?: (lat: number, lng: number) => void }) => {
    const map = useMapEvents({
        click(e) {
            if (onLocationChange) {
                onLocationChange(e.latlng.lat, e.latlng.lng);
                map.flyTo(e.latlng, map.getZoom());
            }
        },
    });

    return null;
};

const ChangeView = ({ center }: { center: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(center);
    }, [center, map]);
    return null;
};

const MapComponent = ({
    latitude = 20.5937, // Default to India center
    longitude = 78.9629,
    height = '400px',
    clickable = false,
    onLocationChange,
    markers = [],
}: MapComponentProps) => {
    const center: [number, number] = [latitude, longitude];

    return (
        <MapContainer
            center={center}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: height, width: '100%', borderRadius: '0.5rem', zIndex: 0 }}
        >
            <ChangeView center={center} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {clickable && <LocationMarker onLocationChange={onLocationChange} />}

            {clickable && latitude && longitude && (
                <Marker position={[latitude, longitude]}>
                    <Popup>Selected Location</Popup>
                </Marker>
            )}

            {markers.map((marker) => (
                <Marker key={marker.id} position={[marker.latitude, marker.longitude]}>
                    <Popup>{marker.name}</Popup>
                </Marker>
            ))}
        </MapContainer>
    );
};

export default MapComponent;
