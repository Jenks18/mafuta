import React from 'react';

const MapView = ({ stations = [] }) => {
  return (
    <div className="flex-1 flex flex-col relative bg-gradient-to-br from-green-100 via-emerald-50 to-green-200"
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
      {stations.map((station) => (
        <div
          key={station.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer hover:scale-110 transition-transform"
          style={{ left: station.mapX, top: station.mapY }}
          title={`${station.name} - $${station.price}/gal`}
        >
          <div className="bg-white rounded-lg shadow-lg px-3 py-2 text-sm font-semibold text-emerald-700 border-2 border-emerald-200 hover:border-emerald-400">
            ${station.price}
          </div>
        </div>
      ))}

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Location marker (current position) */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>
      </div>

      {/* Map legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
          <span className="text-gray-600">Your Location</span>
        </div>
        <div className="flex items-center gap-2 text-sm mt-1">
          <div className="w-3 h-3 bg-emerald-600 rounded"></div>
          <span className="text-gray-600">Fuel Stations</span>
        </div>
      </div>
    </div>
  );
};

export default MapView;
