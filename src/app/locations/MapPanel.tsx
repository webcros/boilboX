'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { KioskLocation } from '@/lib/types';

interface MapPanelProps {
  apiKey: string;
  center: { lat: number; lng: number };
  locations: KioskLocation[];
  selectedId: string | null;
  onMapLoad: (map: google.maps.Map | null) => void;
  onMarkerClick: (location: KioskLocation) => void;
  onLoadError: () => void;
  onInfoClose: () => void;
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const GOOGLE_MAPS_SCRIPT_ID = 'boilobox-google-maps';

function loadGoogleMaps(apiKey: string): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Window not available'));
  if (window.google?.maps) return Promise.resolve();

  const existingPromise = (window as typeof window & { __boiloboxGoogleMapsPromise?: Promise<void> })
    .__boiloboxGoogleMapsPromise;
  if (existingPromise) return existingPromise;

  const promise = new Promise<void>((resolve, reject) => {
    const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve());
      existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = GOOGLE_MAPS_SCRIPT_ID;
    script.async = true;
    script.defer = true;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&v=weekly`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Maps failed to load'));
    document.head.appendChild(script);
  });

  (window as typeof window & { __boiloboxGoogleMapsPromise?: Promise<void> }).__boiloboxGoogleMapsPromise =
    promise;

  return promise;
}

export default function MapPanel({
  apiKey,
  center,
  locations,
  selectedId,
  onMapLoad,
  onMarkerClick,
  onLoadError,
  onInfoClose,
}: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const infoWindowRef = useRef<google.maps.InfoWindow | null>(null);
  const hasFitBounds = useRef(false);
  const hasWarnedHidden = useRef(false);
  const centerRef = useRef(center);
  const mapStylesRef = useRef<google.maps.MapTypeStyle[]>([]);
  const onMapLoadRef = useRef(onMapLoad);
  const onLoadErrorRef = useRef(onLoadError);

  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState(false);

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

  useEffect(() => {
    centerRef.current = center;
  }, [center]);

  useEffect(() => {
    mapStylesRef.current = mapStyles;
  }, [mapStyles]);

  useEffect(() => {
    onMapLoadRef.current = onMapLoad;
  }, [onMapLoad]);

  useEffect(() => {
    onLoadErrorRef.current = onLoadError;
  }, [onLoadError]);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    if (!containerRef.current || !window.google) return undefined;

    // eslint-disable-next-line no-console
    console.log('[MapPanel] Map container found', containerRef.current);

    const initMap = () => {
      if (cancelled) return;
      if (!containerRef.current || !window.google?.maps) return;
      if (mapRef.current) return;

      const container = containerRef.current;
      const isVisible =
        container.offsetWidth > 0 &&
        container.offsetHeight > 0 &&
        container.getClientRects().length > 0;

      if (!isVisible) {
        if (!hasWarnedHidden.current) {
          // eslint-disable-next-line no-console
          console.warn('[MapPanel] Container not visible; delaying map initialization.');
          hasWarnedHidden.current = true;
        }
        return;
      }

      try {
        const mapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
        const map = new google.maps.Map(container, {
          center: centerRef.current,
          zoom: 12,
          clickableIcons: false,
          gestureHandling: 'greedy',
          ...(mapId ? { mapId } : {}),
        });

        map.setOptions({
          disableDefaultUI: true,
          styles: mapStylesRef.current,
          draggable: true,
          scrollwheel: true,
        });

        mapRef.current = map;
        setIsLoaded(true);
        onMapLoadRef.current(map);

        // eslint-disable-next-line no-console
        console.log('[MapPanel] Map created');

        google.maps.event.addListenerOnce(map, 'idle', () => {
          // eslint-disable-next-line no-console
          console.log('[MapPanel] Map tiles idle');
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize Google Map:', error);
        setLoadError(true);
        onLoadErrorRef.current();
      }
    };

    loadGoogleMaps(apiKey)
      .then(() => {
        if (cancelled) return;
        initMap();
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error('Google Maps failed to load:', error);
        setLoadError(true);
        onLoadErrorRef.current();
      });

    if (!mapRef.current && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        initMap();
        if (mapRef.current && resizeObserver) {
          resizeObserver.disconnect();
        }
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (mapRef.current) {
        onMapLoadRef.current(null);
        mapRef.current = null;
      }
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
        infoWindowRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || locations.length === 0 || hasFitBounds.current) return;
    if (locations.length === 1) {
      map.setCenter({ lat: locations[0].lat, lng: locations[0].lng });
      map.setZoom(14);
      hasFitBounds.current = true;
      return;
    }

    const bounds = new google.maps.LatLngBounds();
    locations.forEach((loc) => bounds.extend({ lat: loc.lat, lng: loc.lng }));
    map.fitBounds(bounds, 64);
    hasFitBounds.current = true;
  }, [locations, isLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    map.setOptions({ styles: mapStyles });
  }, [mapStyles]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    locations.forEach((loc) => {
      const marker = new google.maps.Marker({
        position: { lat: loc.lat, lng: loc.lng },
        map,
      });

      marker.addListener('click', () => onMarkerClick(loc));
      markersRef.current.push(marker);
    });
  }, [locations, onMarkerClick, isLoaded]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const selectedLocation = selectedId
      ? locations.find((loc) => loc.id === selectedId) || null
      : null;

    if (!selectedLocation) {
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
      return;
    }

    if (!infoWindowRef.current) {
      infoWindowRef.current = new google.maps.InfoWindow();
    }

    const content = `<div style="font-size:12px;line-height:1.4">
        <div style="font-weight:700;color:#111">${selectedLocation.name}</div>
        <div style="color:#6b7280">${selectedLocation.address}</div>
      </div>`;

    infoWindowRef.current.setContent(content);
    infoWindowRef.current.setPosition({ lat: selectedLocation.lat, lng: selectedLocation.lng });
    infoWindowRef.current.open({ map });
    infoWindowRef.current.addListener('closeclick', onInfoClose);
    map.panTo({ lat: selectedLocation.lat, lng: selectedLocation.lng });
  }, [locations, onInfoClose, selectedId, isLoaded]);

  if (loadError) {
    return null;
  }

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} style={mapContainerStyle} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 w-full h-full bg-gray-100 dark:bg-bg-dark/40 flex items-center justify-center text-gray-400 text-sm">
          Loading map...
        </div>
      )}
    </div>
  );
}
