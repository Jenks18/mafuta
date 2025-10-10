import React, { useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Trucks Map: emptied and reworked baseline using fuel map mechanics
mapboxgl.accessToken = 'pk.eyJ1IjoieWF6enlqZW5rcyIsImEiOiJjbWU2b2o0eXkxNDFmMm1vbGY3dWt5aXViIn0.8hEu3t-bv3R3kGsBb_PIcw';

const MapPage = () => {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    if (mapRef.current || !mapEl.current) return;
    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [36.8219, -1.2921],
      zoom: 11,
      dragRotate: false,
      pitchWithRotate: false,
      touchPitch: false,
    });
    map.on('load', () => {
      try { map.resize(); } catch {}
      // placeholder: we will feed trucks from a transponder/phone feed
      const demoTrucks = [
        { id: 'KDJ 123A', coords: [36.8219, -1.2821], driver: 'Michael A', speed: 52 },
        { id: 'KBX 456B', coords: [36.8119, -1.2921], driver: 'Sarah J', speed: 34 },
        { id: 'LA046', coords: [36.8333, -1.305], driver: 'John S', speed: 0 },
      ];

      demoTrucks.forEach((t) => {
        const el = document.createElement('div');
        el.className = 'truck-marker';
        el.style.width = '28px';
        el.style.height = '28px';
        el.style.borderRadius = '8px';
        el.style.background = '#10b981';
        el.style.boxShadow = '0 6px 18px rgba(16,185,129,0.35)';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.color = 'white';
        el.style.fontWeight = '700';
        el.style.fontSize = '12px';
        el.innerText = '🚛';
        const m = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(t.coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 16, closeButton: false }).setHTML(
              `<div class="text-sm"><div class="font-semibold">${t.id}</div><div>Driver: ${t.driver}</div><div>Speed: ${t.speed} km/h</div></div>`
            )
          )
          .addTo(map);
        markersRef.current.push(m);
      });
    });
    mapRef.current = map;
    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      try { map.remove(); } catch {}
      mapRef.current = null;
    };
  }, []);

  return (
    <div className="flex-1 min-h-0">
      <div ref={mapEl} className="w-full h-full" />
    </div>
  );
};

export default MapPage;
