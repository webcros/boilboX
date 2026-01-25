'use client';

import { useEffect, useMemo, useState } from 'react';
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
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'boilobox-map',
    googleMapsApiKey: apiKey,
    version: 'weekly',
  });

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      if (typeof document === 'undefined') return;
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    updateTheme();
    if (typeof document === 'undefined') return;

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const mapStyles = useMemo(() => {
    if (isDark) {
      return [
        { elementType: 'geometry', stylers: [{ color: '#0b1120' }] },
        { elementType: 'labels.text.fill', stylers: [{ color: '#9ca3af' }] },
        { elementType: 'labels.text.stroke', stylers: [{ color: '#0b1120' }] },
        { featureType: 'poi', elementType: 'labels.text', stylers: [{ visibility: 'off' }] },
        { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#111827' }] },
        { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#1f2937' }] },
        { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f172a' }] },
      ];
    }

    return [
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
    ];
  }, [isDark]);

  if (loadError) {
    // eslint-disable-next-line no-console
    console.error('Google Maps failed to load:', loadError);
    return (
      <div className="w-full h-full bg-gray-100 dark:bg-bg-dark/40 flex items-center justify-center text-gray-400 text-sm">
        Map unavailable
      </div>
    );
  }

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
        styles: mapStyles,
        clickableIcons: false,
        gestureHandling: 'greedy',
      }}
      onLoad={onMapLoad}
      onUnmount={() => onMapLoad(null as unknown as google.maps.Map)}
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
