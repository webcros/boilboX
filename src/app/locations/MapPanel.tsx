'use client';

import { useEffect, useRef, useState } from 'react';
import type { KioskLocation } from '@/lib/types';

/* ---- Leaflet types only (no runtime import at module level) ---- */
type LMap = import('leaflet').Map;
type LMarker = import('leaflet').Marker;
type LPopup = import('leaflet').Popup;
type LeafletModule = typeof import('leaflet');

const DEFAULT_CENTER: [number, number] = [37.7749, -122.4194];
const DEFAULT_ZOOM = 12;

interface MapPanelProps {
  center: { lat: number; lng: number };
  locations: KioskLocation[];
  selectedId: string | null;
  onMapLoad: (map: LMap | null) => void;
  onMarkerClick: (location: KioskLocation) => void;
  onLoadError: () => void;
  onInfoClose: () => void;
}

const mapContainerStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  minHeight: '320px',
};

export default function MapPanel({
  center,
  locations,
  selectedId,
  onMapLoad,
  onMarkerClick,
  onLoadError,
  onInfoClose,
}: MapPanelProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<LMap | null>(null);
  const markersRef = useRef<LMarker[]>([]);
  const popupRef = useRef<LPopup | null>(null);
  const userMarkerRef = useRef<LMarker | null>(null);
  const leafletRef = useRef<LeafletModule | null>(null);

  const hasFitBoundsRef = useRef(false);
  const initInProgressRef = useRef(false);
  const hasInitializedRef = useRef(false);
  const hasCenteredOnUserRef = useRef(false);

  const onMapLoadRef = useRef(onMapLoad);
  const onLoadErrorRef = useRef(onLoadError);
  const onMarkerClickRef = useRef(onMarkerClick);
  const onInfoCloseRef = useRef(onInfoClose);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => { onMapLoadRef.current = onMapLoad; }, [onMapLoad]);
  useEffect(() => { onLoadErrorRef.current = onLoadError; }, [onLoadError]);
  useEffect(() => { onMarkerClickRef.current = onMarkerClick; }, [onMarkerClick]);
  useEffect(() => { onInfoCloseRef.current = onInfoClose; }, [onInfoClose]);

  /* pan when center prop changes */
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.setView([center.lat, center.lng], mapRef.current.getZoom(), { animate: true });
    }
  }, [center]);

  /* ===================== initialise map ===================== */
  useEffect(() => {
    let cancelled = false;

    const waitForContainer = () =>
      new Promise<HTMLDivElement>((resolve) => {
        const check = () => {
          if (cancelled) return;
          if (containerRef.current) { resolve(containerRef.current); return; }
          requestAnimationFrame(check);
        };
        check();
      });

    const initMap = async () => {
      /* dynamic import – never executed on the server */
      const L = await import('leaflet');
      leafletRef.current = L;

      /* fix default marker icon paths broken by webpack */
      // biome-ignore lint/suspicious/noExplicitAny: leaflet internals
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      });

      const container = await waitForContainer();
      if (cancelled) return;
      if (mapRef.current || initInProgressRef.current || hasInitializedRef.current) return;

      initInProgressRef.current = true;

      try {
        const map = L.map(container, {
          center: DEFAULT_CENTER,
          zoom: DEFAULT_ZOOM,
          zoomControl: false,
          scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap contributors',
          className: 'boilox-tiles',
        }).addTo(map);

        mapRef.current = map;
        hasInitializedRef.current = true;
        setIsLoaded(true);
        onMapLoadRef.current(map);

        map.whenReady(() => {
          if (!cancelled) setIsReady(true);
        });
      } catch (error) {
        console.error('[MapPanel] Failed to initialise map:', error);
        setLoadError(true);
        onLoadErrorRef.current();
      } finally {
        initInProgressRef.current = false;
      }
    };

    initMap().catch((error) => {
      if (cancelled) return;
      console.error('[MapPanel] Map failed to load:', error);
      setLoadError(true);
      onLoadErrorRef.current();
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        onMapLoadRef.current(null);
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      popupRef.current = null;
      userMarkerRef.current?.remove();
      userMarkerRef.current = null;
      setIsLoaded(false);
      setIsReady(false);
    };
  }, []);

  /* ===================== fit bounds once ===================== */
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || locations.length === 0 || hasFitBoundsRef.current || !isReady) return;

    if (locations.length === 1) {
      map.setView([locations[0].lat, locations[0].lng], 14, { animate: true });
    } else {
      const bounds = L.latLngBounds(locations.map((loc) => [loc.lat, loc.lng] as [number, number]));
      map.fitBounds(bounds, { padding: [64, 64] });
    }
    hasFitBoundsRef.current = true;
  }, [locations, isReady]);

  /* ===================== markers ===================== */
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !isReady) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    locations.forEach((loc) => {
      const marker = L.marker([loc.lat, loc.lng]).addTo(map);
      marker.on('click', () => onMarkerClickRef.current(loc));
      markersRef.current.push(marker);
    });
  }, [locations, isReady]);

  /* ===================== selected popup ===================== */
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !isReady) return;

    const selectedLocation = selectedId ? locations.find((loc) => loc.id === selectedId) ?? null : null;

    if (!selectedLocation) {
      popupRef.current?.remove();
      return;
    }

    const popup = L.popup({ closeButton: true, autoPan: true })
      .setLatLng([selectedLocation.lat, selectedLocation.lng])
      .setContent(
        `<div style="font-size:12px;line-height:1.4">
          <div style="font-weight:700;color:#0f172a">${selectedLocation.name}</div>
          <div style="color:#475569">${selectedLocation.address}</div>
        </div>`,
      )
      .openOn(map);

    popup.on('remove', () => onInfoCloseRef.current());
    popupRef.current = popup;

    map.panTo([selectedLocation.lat, selectedLocation.lng], { animate: true });
  }, [selectedId, locations, isReady]);

  /* ===================== live user location ===================== */
  useEffect(() => {
    const L = leafletRef.current;
    const map = mapRef.current;
    if (!L || !map || !isReady) return;
    if (!navigator.geolocation) return;

    const icon = L.divIcon({
      className: 'boilox-user-location',
      html: '<span class="boilox-user-dot"></span><span class="boilox-user-ring"></span>',
      iconSize: [18, 18],
      iconAnchor: [9, 9],
    });

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const coords: [number, number] = [pos.coords.latitude, pos.coords.longitude];
        if (!userMarkerRef.current) {
          userMarkerRef.current = L.marker(coords, { icon }).addTo(map);
        } else {
          userMarkerRef.current.setLatLng(coords);
        }
        if (!hasCenteredOnUserRef.current && locations.length === 0) {
          map.setView(coords, Math.max(map.getZoom(), 13), { animate: true });
          hasCenteredOnUserRef.current = true;
        }
      },
      () => { /* silently ignore permission denied */ },
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isReady, locations.length]);

  if (loadError) return null;

  return (
    <div className="w-full h-full relative">
      <div
        ref={containerRef}
        style={mapContainerStyle}
        className="w-full h-full locations-leaflet-map"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-bg-dark/40 text-gray-400 text-sm">
          Loading map…
        </div>
      )}
    </div>
  );
}
