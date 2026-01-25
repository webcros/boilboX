"use client";

import { useMemo, useState } from 'react';
import { KioskLocation } from '@/lib/types';
import MapPanel from './MapPanel';

interface LocationsClientProps {
  locations: KioskLocation[];
}

export function LocationsClient({ locations }: LocationsClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterOpenNow, setFilterOpenNow] = useState(false);
  const [filterWheelchair, setFilterWheelchair] = useState(false);
  const [filterEBT, setFilterEBT] = useState(false);
  const [mapInstance, setMapInstance] = useState<google.maps.Map | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;


  const filteredLocations = useMemo(() => {
    return locations.filter((loc) => {
      const matchesSearch = search
        ? (loc.name + ' ' + loc.address).toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesOpen = filterOpenNow ? loc.status === 'Open Now' : true;
      const matchesWheelchair = filterWheelchair ? loc.wheelchairAccessible === true : true;
      const matchesEBT = filterEBT ? loc.ebtAccepted === true : true;
      return matchesSearch && matchesOpen && matchesWheelchair && matchesEBT;
    });
  }, [locations, search, filterOpenNow, filterWheelchair, filterEBT]);

  const center = useMemo(() => {
    if (filteredLocations.length > 0) {
      const first = filteredLocations[0];
      return { lat: first.lat, lng: first.lng };
    }
    if (locations.length > 0) {
      const first = locations[0];
      return { lat: first.lat, lng: first.lng };
    }
    return { lat: 37.7749, lng: -122.4194 };
  }, [filteredLocations, locations]);

  const handleLocationClick = (loc: KioskLocation) => {
    setSelectedId(loc.id);
    if (mapInstance) {
      mapInstance.panTo({ lat: loc.lat, lng: loc.lng });
      mapInstance.setZoom(14);
    }
  };

  const handleZoom = (direction: 'in' | 'out') => {
    if (!mapInstance) return;
    const currentZoom = mapInstance.getZoom() || 12;
    mapInstance.setZoom(direction === 'in' ? currentZoom + 1 : currentZoom - 1);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation || !mapInstance) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      const userLatLng = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      mapInstance.panTo(userLatLng);
      mapInstance.setZoom(13);
    });
  };

  const openDirections = (loc: KioskLocation) => {
    if (typeof window === 'undefined') return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(loc.address)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden animate-fade-in">
      {/* Sidebar */}
      <div className="w-full lg:w-[480px] xl:w-[540px] flex flex-col h-full bg-white dark:bg-bg-dark border-r border-gray-100 dark:border-white/10 shadow-xl z-10">
        <div className="p-8 pb-4">
          <h1 className="text-4xl font-black mb-2 tracking-tight">Find a BoilboX</h1>
          <p className="text-gray-500 dark:text-gray-300 text-sm mb-8">Fresh, oil-free meals served by our amazing community partners.</p>

          <div className="relative mb-6">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">search</span>
            <input
              type="text"
              placeholder="Enter zip code, city, or state"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-14 pl-12 pr-12 rounded-2xl bg-gray-50 dark:bg-surface-dark border-none focus:ring-2 focus:ring-primary transition-all text-sm font-bold"
            />
            <button
              type="button"
              onClick={handleUseMyLocation}
              className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary cursor-pointer hover:scale-110 transition-transform"
            >
              my_location
            </button>
          </div>

          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            <button
              onClick={() => setFilterOpenNow((v) => !v)}
              className={`shrink-0 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-colors ${
                filterOpenNow ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/10'
              }`}
            >
              Open Now
            </button>
            <button
              onClick={() => setFilterWheelchair((v) => !v)}
              className={`shrink-0 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-colors ${
                filterWheelchair ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/10'
              }`}
            >
              Wheelchair Accessible
            </button>
            <button
              onClick={() => setFilterEBT((v) => !v)}
              className={`shrink-0 px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest hover:border-primary transition-colors ${
                filterEBT ? 'border-primary bg-primary/10' : 'border-gray-200 dark:border-white/10'
              }`}
            >
              EBT Accepted
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto hide-scrollbar px-8 pb-8 space-y-6 mt-4">
          {filteredLocations.map((loc) => (
            <div
              key={loc.id}
              onClick={() => handleLocationClick(loc)}
              className={`p-6 rounded-3xl border bg-white dark:bg-surface-dark hover:shadow-2xl transition-all cursor-pointer group ${
                selectedId === loc.id
                  ? 'border-primary/60 shadow-xl'
                  : 'border-gray-100 dark:border-white/10 hover:border-primary/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-black mb-1 leading-tight">{loc.name}</h3>
                  <p className="text-gray-400 dark:text-gray-300 text-xs font-medium">{loc.address}</p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDirections(loc);
                  }}
                  className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform"
                >
                  <span className="material-symbols-outlined">directions</span>
                </button>
              </div>

              <div className="flex items-center gap-3 mb-6">
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${
                    loc.status === 'Open Now' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                  }`}
                >
                  {loc.status}
                </span>
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-300 uppercase tracking-widest">
                  {loc.status === 'Open Now' && loc.closingTime
                    ? `Closes ${loc.closingTime}`
                    : loc.status}
                </span>
                <span className="text-[10px] font-black text-gray-300 ml-auto">{loc.distance}</span>
              </div>

              {loc.operator && (
                <div className="flex items-start gap-3 bg-gray-50 dark:bg-black/20 p-4 rounded-2xl">
                  <div className="relative shrink-0">
                    <img
                      src={loc.operator.avatar}
                      className="w-10 h-10 rounded-full border-2 border-white dark:border-white/10"
                      alt={loc.operator.name}
                    />
                    <span className="absolute -bottom-1 -right-1 bg-primary text-[8px] font-black px-1 rounded-sm text-bg-dark">
                      OP
                    </span>
                  </div>
                  <div>
                    <p className="text-xs font-black mb-1">{loc.operator.name}</p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-300 italic leading-snug">"{loc.operator.quote}"</p>
                  </div>
                </div>
              )}

              <div className="flex gap-2 mt-6">
                <button
                  className="flex-1 bg-bg-dark dark:bg-white text-white dark:text-bg-dark h-10 rounded-xl font-black text-xs hover:opacity-90 transition-opacity"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDirections(loc);
                  }}
                >
                  Order Here
                </button>
                <button
                  className="flex-1 border border-gray-200 dark:border-white/10 h-10 rounded-xl font-black text-xs hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openDirections(loc);
                  }}
                >
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map Content */}
      <div className="hidden lg:block flex-1 relative bg-gray-100 dark:bg-bg-dark/50">
        <div className="absolute inset-0">
          {apiKey ? (
            <MapPanel
              apiKey={apiKey}
              center={center}
              locations={locations}
              selectedId={selectedId}
              onMapLoad={(map) => setMapInstance(map)}
              onMarkerClick={handleLocationClick}
            />
          ) : (
            <div
              className="w-full h-full bg-cover bg-center grayscale opacity-50 contrast-125 flex items-center justify-center"
              style={{
                backgroundImage:
                  'url("https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=1200")',
              }}
            >
              <div className="bg-white/90 dark:bg-surface-dark/90 border border-gray-100 dark:border-white/10 rounded-2xl px-6 py-4 text-center shadow-xl">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-200">Map preview unavailable</p>
                <p className="text-xs text-gray-400 dark:text-gray-300">
                  Add a Google Maps API key to enable the live map.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-primary/10 mix-blend-multiply"></div>

        {/* Custom Pins (visual only, kept for UI parity) */}
        <div className="absolute top-[40%] left-[45%] flex flex-col items-center animate-bounce-slow">
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center border-4 border-white shadow-2xl">
            <span className="material-symbols-outlined text-bg-dark">soup_kitchen</span>
          </div>
          <div className="mt-2 bg-bg-dark text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl">
            Downtown
          </div>
        </div>

        <div className="absolute top-[60%] left-[35%] flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-white dark:bg-bg-dark flex items-center justify-center border-4 border-primary shadow-2xl">
            <span className="material-symbols-outlined text-primary">restaurant</span>
          </div>
          <div className="mt-2 bg-white dark:bg-surface-dark text-bg-dark dark:text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest shadow-xl border border-gray-100 dark:border-white/10">
            Mission District
          </div>
        </div>

        {/* Map Controls wired to Google Maps */}
        {apiKey && (
          <div className="absolute top-8 right-8 flex flex-col gap-2">
            <button
              className="w-12 h-12 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-2xl hover:bg-gray-50 dark:hover:bg-bg-dark transition-colors"
              type="button"
              onClick={() => handleZoom('in')}
            >
              <span className="material-symbols-outlined">add</span>
            </button>
            <button
              className="w-12 h-12 rounded-xl bg-white dark:bg-surface-dark flex items-center justify-center shadow-2xl hover:bg-gray-50 dark:hover:bg-bg-dark transition-colors"
              type="button"
              onClick={() => handleZoom('out')}
            >
              <span className="material-symbols-outlined">remove</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
