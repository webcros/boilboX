'use client';

import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import type { KioskLocation } from '@/lib/types';

interface MapPanelProps {
  apiKey: string;
  center: { lat: number; lng: number };
  locations: KioskLocation[];
  selectedId: string | null;
  onMapLoad: (map: google.maps.Map) => void;
  onMarkerClick: (location: KioskLocation) => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

export default function MapPanel({
  apiKey,
  center,
  locations,
  selectedId,
  onMapLoad,
  onMarkerClick,
}: MapPanelProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'boilobox-map',
    googleMapsApiKey: apiKey,
  });

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-bg-dark/40 flex items-center justify-center text-gray-400 text-sm">
        Loading map…
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={12}
      options={{
        disableDefaultUI: true,
        styles: [
          {
            featureType: 'all',
            elementType: 'labels.text.fill',
            stylers: [{ color: '#6b7280' }],
          },
          {
            featureType: 'poi',
            elementType: 'labels.text',
            stylers: [{ visibility: 'off' }],
          },
        ],
      }}
      onLoad={onMapLoad}
    >
      {locations.map((loc) => (
        <Marker
          key={loc.id}
          position={{ lat: loc.lat, lng: loc.lng }}
          onClick={() => onMarkerClick(loc)}
          icon={selectedId === loc.id ? undefined : undefined}
        />
      ))}
    </GoogleMap>
  );
}
