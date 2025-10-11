import React, { useMemo } from 'react';
import DigitalCard from '../common/DigitalCard';
import { useStore } from '../../store';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n || 0)));

const StationDetailMobile = ({ stationId, onBack, onClaim }) => {
  const { fuelStations, cards } = useStore();
  const station = useMemo(() => fuelStations.find(s => `${s.id}` === `${stationId}`) || fuelStations[0], [fuelStations, stationId]);
  const card = cards?.[0];

  if (!station) return null;

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
        <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100">
          <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
        </button>
        <div className="mt-1 text-xl font-bold text-gray-900">{station.name}</div>
        <div className="text-sm text-gray-600">{station.address}</div>
      </div>

      {/* Map preview slot: we'll reuse the desktop StationDetailPage's real map that's already rendered there for route */}
      <div className="h-48 bg-gray-100" />

      {/* Offers */}
      <div className="p-4 space-y-4">
        <div>
          <div className="text-base font-semibold text-gray-900 mb-2">Your gas offers</div>
          <div className="grid grid-cols-3 gap-3">
            {station.offers?.map(o => (
              <div key={o.type} className="rounded-xl border border-gray-200 p-3">
                <div className="text-sm font-semibold text-gray-800">{o.type}</div>
                <div className="text-sm text-gray-900">{currencyKES((o.price||0)*130/130)}</div>
                <div className="text-xs text-emerald-600 font-semibold">{o.cashback}¢/L</div>
              </div>
            ))}
          </div>
        </div>

        {/* Convenience store offer */}
        <div className="rounded-xl border border-gray-200 p-3 bg-gray-50">
          <div className="font-semibold text-gray-900">10% cash back inside the store</div>
          <div className="text-sm text-gray-600">up to $10</div>
          <div className="text-xs text-gray-500">Excludes tobacco, alcohol, gift cards, phone cards, and lottery.</div>
        </div>

        {/* Card twin */}
  <DigitalCard card={card} size="real" />
      </div>

      {/* Sticky claim */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-3">
        <button onClick={onClaim} className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-full">Claim</button>
      </div>
    </div>
  );
};

export default StationDetailMobile;
