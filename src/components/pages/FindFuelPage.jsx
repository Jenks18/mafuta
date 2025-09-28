import React from 'react';
import { useStore } from '../../store';

const FindFuelPage = () => {
  const { fuelStations } = useStore();

  return (
    <div className="flex-1 flex flex-col relative">
      <div className="relative flex-1 bg-gradient-to-br from-green-100 via-emerald-50 to-green-200"
           style={{
             backgroundImage: `
               linear-gradient(45deg, transparent 40%, rgba(34, 197, 94, 0.1) 50%, transparent 60%),
               linear-gradient(-45deg, transparent 40%, rgba(16, 185, 129, 0.1) 50%, transparent 60%),
               radial-gradient(circle at 20% 80%, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
               radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 50%)
             `
           }}>
        {/* Simulated roads/paths */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-300 opacity-60"></div>
          <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-300 opacity-60"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-60"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-0.5 bg-gray-300 opacity-60"></div>
        </div>

        {/* Fuel station markers on the "map" */}
        {fuelStations.map((station) => (
          <div
            key={station.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{ left: station.mapX, top: station.mapY }}
          >
            <div className="bg-white rounded-lg shadow-lg px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              ${station.price}
            </div>
          </div>
        ))}

        {/* Map controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <button className="bg-white p-2 rounded-lg shadow">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="bg-white p-2 rounded-lg shadow">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Bottom panel with station details */}
      <div className="bg-white p-4 border-t">
        {/* Featured station */}
        <div className="mb-4 p-4 bg-gray-50 rounded-2xl">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-800">EVgo</h3>
              <p className="text-sm text-gray-600">0.6 mi away</p>
              <p className="text-xs text-green-600 font-medium">OFFER AVAILABLE</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-700">$0.25/kWh</p>
              <p className="text-xs text-gray-500">CHARGING</p>
            </div>
          </div>
          <button className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            Charge at this station
          </button>
          <button className="w-full text-gray-600 font-medium py-2 text-sm hover:text-gray-800 transition-colors">
            See other options
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindFuelPage;
