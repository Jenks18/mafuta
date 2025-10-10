import React, { useEffect, useRef, useState } from 'react';
import { useStore } from '../../store';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const StationDetailPage = ({ stationId, onBack }) => {
  const { fuelStations } = useStore();
  const [selectedFuelType, setSelectedFuelType] = useState('Regular');
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const [showHowToEarn, setShowHowToEarn] = useState(true);
  
  // Find the station by ID
  const station = fuelStations.find(s => `${s.id}` === `${stationId}`) || fuelStations[0];

  const mapRef = useRef(null);
  const mapEl = useRef(null);

  const [distanceKm, setDistanceKm] = useState(null);
  const userPosRef = useRef(null);

  useEffect(() => {
    if (!station || mapRef.current || !mapEl.current) return;
    mapboxgl.accessToken = 'pk.eyJ1IjoieWF6enlqZW5rcyIsImEiOiJjbWU2b2o0eXkxNDFmMm1vbGY3dWt5aXViIn0.8hEu3t-bv3R3kGsBb_PIcw';
    const [lng, lat] = station.coordinates || [36.8219, -1.2921];
    const map = new mapboxgl.Map({
      container: mapEl.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [lng, lat],
      zoom: 14,
      interactive: false
    });
    new mapboxgl.Marker({ color: '#059669' }).setLngLat([lng, lat]).addTo(map);
    mapRef.current = map;
    // Try to compute distance from user to station in KM using geolocation and draw a dashed route
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const R = 6371; // km
        const toRad = (d) => (d * Math.PI) / 180;
        const lat1 = pos.coords.latitude;
        const lon1 = pos.coords.longitude;
        const lat2 = lat;
        const lon2 = lng;
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat/2)**2 + Math.cos(toRad(lat1))*Math.cos(toRad(lat2))*Math.sin(dLon/2)**2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        const dist = R * c;
        setDistanceKm(dist);
        userPosRef.current = [lon1, lat1];

        try {
          map.addSource('route-line', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: { type: 'LineString', coordinates: [[lon1, lat1], [lon2, lat2]] }
            }
          });
          map.addLayer({
            id: 'route-line-layer',
            type: 'line',
            source: 'route-line',
            layout: { 'line-cap': 'round', 'line-join': 'round' },
            paint: {
              'line-color': '#2563eb',
              'line-width': 3,
              'line-dasharray': [2, 2]
            }
          });
        } catch {}
      }, undefined, { enableHighAccuracy: true, timeout: 4000 });
    }
    return () => {
      try { map.remove(); } catch {}
      mapRef.current = null;
    };
  }, [station]);

  const handleClaim = () => {
    setShowClaimSuccess(true);
    setTimeout(() => {
      setShowClaimSuccess(false);
      // Navigate back after showing success
      setTimeout(() => onBack(), 500);
    }, 2000);
  };
  
  return (
  <div className="flex-1 flex flex-col bg-white overflow-y-auto">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-2">{station.name}</h1>
        <p className="text-gray-600 mb-2">{station.address}</p>
        <p className="text-gray-600">
          {station.distance} • <span className="text-emerald-600 font-medium">Open</span>
        </p>

        <div className="mt-4">
          <button
            onClick={() => {
              const [lng, lat] = station.coordinates || [36.8219, -1.2921];
              const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
              window.open(url, '_blank');
            }}
            className="inline-flex items-center bg-black text-white px-5 py-2.5 rounded-2xl font-medium"
          >
            Directions
          </button>
        </div>
      </div>

      {/* Map Section - Real map */}
      <div className="h-64 relative">
        <div ref={mapEl} className="absolute inset-0 rounded-xl overflow-hidden" />
        {distanceKm != null && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur rounded-full px-3 py-1 text-sm font-medium text-gray-800 shadow">
            {distanceKm.toFixed(1)} km
          </div>
        )}
      </div>

  {/* Fuel Offers + Details Section */}
  <div className="flex-1 p-4 pb-28">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your gas offers</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* Fuel type cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {station.offers?.map((offer, index) => (
            <div 
              key={offer.type}
              onClick={() => setSelectedFuelType(offer.type)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedFuelType === offer.type 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{offer.type}</h3>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-gray-800">KES {Math.round((offer.price ?? 0) * 130)}</span>
                <span className="text-sm text-gray-400 line-through">KES {Math.round((offer.originalPrice ?? 0) * 130)}</span>
              </div>
              <div className="text-emerald-600 font-semibold text-sm mt-1">
                {offer.cashback}¢/L
              </div>
            </div>
          ))}
        </div>

        {/* Convenience store offer */}
        <div className="mb-6">
          <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-3">Convenience store offer</h3>
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="text-lg font-bold text-gray-900">10% cash back inside the store</div>
            <div className="text-gray-600">up to $10</div>
            <div className="text-xs text-gray-500 mt-2">Excludes tobacco, alcohol, gift cards, phone cards, and lottery.</div>
          </div>
        </div>

        {/* How to earn cash back (collapsible) */}
        <div className="mb-6">
          <button
            onClick={() => setShowHowToEarn((v) => !v)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="text-2xl font-extrabold tracking-tight text-gray-900">How to earn cash back</h3>
            <svg
              className={`w-6 h-6 text-gray-600 transition-transform ${showHowToEarn ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showHowToEarn && (
            <div className="mt-3 space-y-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="rounded-2xl bg-gray-50 border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">{n}</div>
                    <div className="flex-1">
                      {n === 1 && (
                        <>
                          <div className="font-semibold text-gray-900">Claim an offer</div>
                          <div className="text-sm text-gray-600">Offer valid at this location only</div>
                        </>
                      )}
                      {n === 2 && (
                        <>
                          <div className="font-semibold text-gray-900">Choose how to earn</div>
                          <div className="text-sm text-gray-600">Select how to earn cash back and make your purchase</div>
                        </>
                      )}
                      {n === 3 && (
                        <>
                          <div className="font-semibold text-gray-900">Receive cash back</div>
                          <div className="text-sm text-gray-600">We'll notify you when you get cash back</div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Fine Print */}
        <div className="mt-2">
          <h3 className="text-2xl font-extrabold tracking-tight text-gray-900 mb-2">Fine Print</h3>
          <p className="text-gray-700 leading-relaxed">
            Valid only for purchases using a credit or debit card. Offer must be claimed before purchase and
            purchase made within 4 hours of claiming offer. Offer good at this location only. Offer valid for first
            50 liters of fuel purchased. If combined with other discounts, cash back offer may be reduced by up to
            5 cents per liter. Cash back amount determined by number of liters and the offer for grade of fuel purchased.
            If receipt doesn't include grade of fuel, you will receive the cash back applicable for Regular-grade fuel.
            Posted pump prices shown may not always be current or accurate due to limitations in data reporting.
          </p>
        </div>
      </div>

      {/* Fixed bottom claim bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/85 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-t border-gray-200 px-4 py-3">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={handleClaim}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-full text-lg transition-colors shadow-lg"
          >
            Claim
          </button>
        </div>
      </div>

      {/* Claim Success Modal/Toast */}
      {showClaimSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Offer Claimed!</h3>
            <p className="text-gray-600 mb-4">
              You've successfully claimed {station.offers?.find(o => o.type === selectedFuelType)?.cashback || station.cashback}¢/L cash back on {selectedFuelType} at {station.name}.
            </p>
            <p className="text-sm text-gray-500">Returning to map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationDetailPage;