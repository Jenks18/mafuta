import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Trucks Map: emptied and reworked baseline using fuel map mechanics
mapboxgl.accessToken = 'pk.eyJ1IjoieWF6enlqZW5rcyIsImEiOiJjbWU2b2o0eXkxNDFmMm1vbGY3dWt5aXViIn0.8hEu3t-bv3R3kGsBb_PIcw';

const MapPage = () => {
  const mapEl = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [trucks, setTrucks] = useState([
    { id: 'KDJ 123A', vin: '3AKJGLD56FSGL2824', coords: [36.8219, -1.2821], driver: 'Michael A', speed: 52 },
    { id: 'KBX 456B', vin: '0SCAUDI03CF5013E7', coords: [36.8119, -1.2921], driver: 'Sarah J', speed: 34 },
    { id: 'LA046', vin: '4V4NC9EH8NN302904', coords: [36.8333, -1.305], driver: 'John S', speed: 0 },
  ]);
  const [selectedVin, setSelectedVin] = useState('');

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
      // Render current trucks
      trucks.forEach((t) => {
        const el = document.createElement('div');
        el.className = 'truck-marker';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.gap = '6px';

        const truckIcon = document.createElement('div');
        truckIcon.style.width = '28px';
        truckIcon.style.height = '28px';
        truckIcon.style.borderRadius = '8px';
        truckIcon.style.background = '#10b981';
        truckIcon.style.boxShadow = '0 6px 18px rgba(16,185,129,0.35)';
        truckIcon.style.display = 'flex';
        truckIcon.style.alignItems = 'center';
        truckIcon.style.justifyContent = 'center';
        truckIcon.style.color = 'white';
        truckIcon.style.fontWeight = '700';
        truckIcon.style.fontSize = '12px';
        truckIcon.textContent = '🚛';

        const label = document.createElement('div');
        label.style.background = '#ffffff';
        label.style.border = '2px solid #111827';
        label.style.borderRadius = '8px';
        label.style.color = '#111827';
        label.style.fontSize = '12px';
        label.style.fontWeight = '700';
        label.style.padding = '4px 8px';
        label.style.whiteSpace = 'nowrap';
        label.textContent = `VIN: ${t.vin}`;

        el.appendChild(label);
        el.appendChild(truckIcon);

        const m = new mapboxgl.Marker({ element: el, anchor: 'center' })
          .setLngLat(t.coords)
          .setPopup(
            new mapboxgl.Popup({ offset: 16, closeButton: false }).setHTML(
              `<div class=\"text-sm\"><div class=\"font-semibold\">${t.id}</div><div>Driver: ${t.driver}</div><div>Speed: ${t.speed} km/h</div></div>`
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
    <div className="flex-1 min-h-0 relative">
      <div ref={mapEl} className="w-full h-full" />
      {/* Driver/VIN selector overlay */}
      <div className="absolute top-6 left-8 z-20">
        <div className="bg-white rounded-xl border border-gray-200 shadow-lg w-80">
          <div className="px-4 py-3 border-b border-gray-200 font-semibold text-gray-800">Select a Driver</div>
          <div className="max-h-64 overflow-auto">
            {trucks.map((t)=> (
              <button
                key={t.vin}
                onClick={()=>{
                  setSelectedVin(t.vin);
                  try { mapRef.current?.flyTo({ center: t.coords, zoom: 13, speed: 1.2 }); } catch {}
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${selectedVin===t.vin ? 'bg-emerald-50' : ''}`}
              >
                VIN - {t.vin}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
