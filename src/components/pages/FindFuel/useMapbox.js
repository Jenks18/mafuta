import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoieWF6enlqZW5rcyIsImEiOiJjbWU2b2o0eXkxNDFmMm1vbGY3dWt5aXViIn0.8hEu3t-bv3R3kGsBb_PIcw';

// Haversine distance in meters
const haversineMeters = (a, b) => {
  const toRad = (d) => (d * Math.PI) / 180;
  const [lng1, lat1] = a;
  const [lng2, lat2] = b;
  const R = 6371000; // m
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const s1 = Math.sin(dLat / 2);
  const s2 = Math.sin(dLng / 2);
  const aa = s1 * s1 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * s2 * s2;
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
};

// radius that grows as you zoom out (smaller zoom number -> larger radius)
const radiusForZoom = (zoom) => {
  // tuned values; around ~2km at z12, ~8km at z10, ~500m at z14
  return 500 * Math.pow(2, 14 - zoom);
};

export const useMapbox = (fuelStations, onStationClick) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const resizeObserverRef = useRef(null);
  const [visibleIndices, setVisibleIndices] = useState([]); // indices into fuelStations
  const stationsRef = useRef(fuelStations);

  // Keep a ref of latest stations for event handlers
  useEffect(() => {
    stationsRef.current = fuelStations;
  }, [fuelStations]);

  // 1) Initialize map only once
  useEffect(() => {
    if (map.current || !mapContainer.current) return;

  map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [36.8219, -1.2921], // Nairobi coordinates
      zoom: 12,
      interactive: true,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });

  // Ensure the map resizes to fill its container after load
  map.current.on('load', () => {
    // Explicitly enable common interactions
    try { map.current.keyboard.enable(); } catch {}
    try { map.current.doubleClickZoom.enable(); } catch {}
    try { map.current.scrollZoom.enable(); } catch {}
    try { map.current.boxZoom.enable(); } catch {}
    try { map.current.dragRotate.disable(); } catch {}
    try { map.current.touchZoomRotate.disableRotation(); } catch {}
      try { map.current.resize(); } catch { /* noop */ }
      setMapLoaded(true);
    });

    const handleResize = () => {
      if (map.current) map.current.resize();
    };
    window.addEventListener('resize', handleResize);

  // Do not add a default user location marker to keep the map clean

  // Intentionally do not auto-update visible markers on move/zoom.
  // Users must tap "Search this area" to refresh markers.

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserverRef.current) {
        try { resizeObserverRef.current.disconnect(); } catch { /* noop */ }
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Render markers for the current visibleIndices
  const renderMarkers = (indices) => {
    if (!map.current) return;
    markers.current.forEach((m) => m.remove());
    markers.current = [];

    indices.forEach((origIdx) => {
      const station = fuelStations[origIdx];
      if (!station) return;
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      const priceKES = Math.max(0, Math.round((station.price ?? 0) * 130));
      markerEl.innerHTML = `
        <div class="marker-badge">
          <span class="marker-text">KES ${priceKES}</span>
          <span class="marker-tail"></span>
        </div>
      `;

      markerEl.addEventListener('click', () => {
        if (onStationClick) onStationClick(origIdx);
      });

  const marker = new mapboxgl.Marker({ element: markerEl, anchor: 'bottom' })
        .setLngLat(station.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 18, closeButton: false })
            .setHTML(`
              <div class="font-semibold text-gray-800 text-sm">${station.name}</div>
              <div class="text-emerald-600 font-bold text-sm">KES ${(station.price ?? 0) * 130 | 0}</div>
            `)
        )
        .addTo(map.current);

      markers.current.push(marker);
    });
  };

  // 2) Update markers whenever stations or visibility change
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // If none selected yet, show the 10 closest to current center initially
    if (visibleIndices.length === 0) {
      const center = map.current.getCenter();
      const withDist = fuelStations.map((s, idx) => ({ idx, d: haversineMeters([center.lng, center.lat], s.coordinates) }));
      const top10 = withDist.sort((a,b)=>a.d-b.d).slice(0, 10).map(x=>x.idx);
      setVisibleIndices(top10);
      renderMarkers(top10);
      return;
    }

    renderMarkers(visibleIndices);

    // Watch container size to keep map sized perfectly (handles sidebar collapse)
    if (mapContainer.current && !resizeObserverRef.current) {
      resizeObserverRef.current = new ResizeObserver(() => {
        if (map.current) {
          try { map.current.resize(); } catch { /* noop */ }
        }
      });
      resizeObserverRef.current.observe(mapContainer.current);
    }
  }, [fuelStations, onStationClick, mapLoaded, visibleIndices]);

  // Do not auto-recompute on map movement; only recompute when stations themselves change materially
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    // Keep current selection; if empty, initialize closest 10
    if (visibleIndices.length === 0) {
      const center = map.current.getCenter();
      const withDist = fuelStations.map((s, idx) => ({ idx, d: haversineMeters([center.lng, center.lat], s.coordinates) }));
      const top10 = withDist.sort((a,b)=>a.d-b.d).slice(0, 10).map(x=>x.idx);
      setVisibleIndices(top10);
    }
  }, [fuelStations, mapLoaded]);

  const flyToStation = (stationIndex) => {
    if (map.current && fuelStations[stationIndex]) {
      map.current.flyTo({
        center: fuelStations[stationIndex].coordinates,
        zoom: 14,
        speed: 1.2,
        curve: 1
      });
    }
  };

  const recenterMap = () => {
  // Debug: track recenter usage
  try { console.debug('[Map] recenterMap invoked'); } catch {}
    if (!map.current) return;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 12,
            speed: 1.2,
            curve: 1
          });
        },
        () => {
          // Fallback to Nairobi if geolocation denied/unavailable
          map.current.flyTo({ center: [36.8219, -1.2921], zoom: 12, speed: 1.2, curve: 1 });
        },
        { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
      );
    } else {
      map.current.flyTo({ center: [36.8219, -1.2921], zoom: 12, speed: 1.2, curve: 1 });
    }
  };

  const searchArea = () => {
    // Debug: track search usage and center/zoom
    try {
      const c = map.current?.getCenter();
      const z = map.current?.getZoom();
      console.debug('[Map] searchArea invoked at', { center: c, zoom: z });
    } catch {}
    if (!map.current) return;
    const center = map.current.getCenter();
    const bounds = map.current.getBounds();
    const zoom = map.current.getZoom();
    const radius = radiusForZoom(zoom);

    // Prefer stations currently visible in the viewport bounds
    const inView = fuelStations
      .map((s, idx) => ({ s, idx }))
      .filter(({ s }) => bounds.contains({ lng: s.coordinates[0], lat: s.coordinates[1] }))
      .map(({ s, idx }) => ({ idx, d: haversineMeters([center.lng, center.lat], s.coordinates) }))
      .sort((a, b) => a.d - b.d)
      .map(x => x.idx);

    if (inView.length) {
      setVisibleIndices(inView.slice(0, 250));
      return;
    }

    // Fallback: if nothing visible (extreme zoom), use radius around center
    const withDist = fuelStations
      .map((s, idx) => ({ idx, d: haversineMeters([center.lng, center.lat], s.coordinates) }))
      .filter(x => Number.isFinite(x.d))
      .sort((a, b) => a.d - b.d);
    const withinRadius = withDist.filter(x => x.d <= radius).map(x => x.idx);
    const finalIndices = (withinRadius.length ? withinRadius : withDist.slice(0, 10).map(x => x.idx)).slice(0, 250);
    setVisibleIndices(finalIndices);
  };

  return {
    mapContainer,
    map,
    markers,
    flyToStation,
    recenterMap,
    searchArea,
    // Expose visible stations with their original indices for consumers (lists, selections)
    visibleStations: visibleIndices.map((idx) => ({ station: fuelStations[idx], index: idx }))
  };
};
