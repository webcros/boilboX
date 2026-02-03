'use client';

import { Loader } from '@googlemaps/js-api-loader';
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
  minHeight: '320px',
};

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
  const hasLoggedContainer = useRef(false);
  const isInitializingRef = useRef(false);
  const centerRef = useRef(center);
  const mapStylesRef = useRef<google.maps.MapTypeStyle[]>([]);
  const onMapLoadRef = useRef(onMapLoad);
  const onLoadErrorRef = useRef(onLoadError);
  const apiKeyRef = useRef(apiKey);

  const [isDark, setIsDark] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
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
    apiKeyRef.current = apiKey;
  }, [apiKey]);

  useEffect(() => {
    let cancelled = false;
    let resizeObserver: ResizeObserver | null = null;

    const isContainerVisible = (container: HTMLDivElement) => {
      const rect = container.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return false;
      if (container.offsetWidth <= 0 || container.offsetHeight <= 0) return false;
      if (container.getClientRects().length === 0) return false;
      const styles = window.getComputedStyle(container);
      if (styles.display === 'none' || styles.visibility === 'hidden') return false;
      return true;
    };

    const initMap = () => {
      if (cancelled) return;
      if (!containerRef.current || !window.google?.maps) return;
      if (mapRef.current || isInitializingRef.current) return;

      const container = containerRef.current;
      if (!isContainerVisible(container)) {
        if (!hasWarnedHidden.current) {
          // eslint-disable-next-line no-console
          console.warn('[MapPanel] Container not visible; delaying map initialization.');
          hasWarnedHidden.current = true;
        }
        return;
      }

      try {
        isInitializingRef.current = true;
        const rawMapId = process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID;
        const mapId = typeof rawMapId === 'string' && rawMapId.trim().length > 0 ? rawMapId.trim() : undefined;
        const map = new google.maps.Map(container, {
          center: centerRef.current,
          zoom: 12,
          clickableIcons: false,
          gestureHandling: 'greedy',
          ...(mapId ? { mapId } : {}),
        });

        // Disable UI only after the map instance exists.
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
          setIsReady(true);
          // eslint-disable-next-line no-console
          console.log('[MapPanel] Map tiles idle');
        });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to initialize Google Map:', error);
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
        }
        setLoadError(true);
        onLoadErrorRef.current();
      } finally {
        isInitializingRef.current = false;
      }
    };

    const run = async () => {
      const key = apiKeyRef.current?.trim();
      if (!key) {
        const error = new Error('Google Maps API key is missing (NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).');
        // eslint-disable-next-line no-console
        console.error(error);
        setLoadError(true);
        onLoadErrorRef.current();
        throw error;
      }

      if (!containerRef.current) return;

      if (!hasLoggedContainer.current) {
        // eslint-disable-next-line no-console
        console.log('[MapPanel] Map container found', containerRef.current);
        hasLoggedContainer.current = true;
      }

      if (!window.google?.maps) {
        const loader = new Loader({
          apiKey: key,
          version: 'weekly',
          libraries: ['marker'],
        });

        const googleMaps = await loader.load();
        // eslint-disable-next-line no-console
        console.log('[MapPanel] Google Maps script loaded');

        if (!googleMaps?.maps || !window.google?.maps) {
          const error = new Error('Google Maps failed to initialize.');
          // eslint-disable-next-line no-console
          console.error(error);
          setLoadError(true);
          onLoadErrorRef.current();
          throw error;
        }
      }

      // Guard required: only initialize when container and API are ready.
      if (!containerRef.current || !window.google?.maps) return;

      // eslint-disable-next-line no-console
      console.log('[MapPanel] google.maps.version', window.google.maps.version);

      initMap();

      if (!mapRef.current && containerRef.current) {
        resizeObserver = new ResizeObserver(() => {
          initMap();
          if (mapRef.current && resizeObserver) {
            resizeObserver.disconnect();
          }
        });
        resizeObserver.observe(containerRef.current);
      }
    };

    run().catch((error) => {
      if (cancelled) return;
      // eslint-disable-next-line no-console
      console.error('Google Maps failed to load:', error);
    });

    return () => {
      cancelled = true;
      resizeObserver?.disconnect();
      if (mapRef.current) {
        onMapLoadRef.current(null);
        mapRef.current = null;
      }
      setIsReady(false);
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
  }, [locations, isReady]);

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
  }, [locations, onMarkerClick, isReady]);

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
  }, [locations, onInfoClose, selectedId, isReady]);

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
