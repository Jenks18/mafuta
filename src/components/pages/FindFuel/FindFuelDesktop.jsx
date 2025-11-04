import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../../../store';
import StationList from './StationList';
import MapControls from './MapControls';
import { useMapbox } from './useMapbox';
import SearchOverlay from './SearchOverlay';

const FindFuelDesktop = ({ onStationDetail, onClaim }) => {
  const { fuelStations } = useStore();
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Gas');
  const [showSidebar, setShowSidebar] = useState(true);
  
  // Debug logging
  useEffect(() => {
    console.log('[FindFuelDesktop] Fuel stations count:', fuelStations?.length || 0);
  }, [fuelStations]);

  const filters = [
    { id: 'All', label: 'All', icon: '⚏', enabled: true },
    { id: 'Gas', label: 'Gas', icon: '⛽', enabled: true },
    { id: 'Restaurant', label: 'Restaurant', icon: '🍽️', enabled: false },
    { id: 'Convenience', label: 'Convenience', icon: '🏪', enabled: false },
    { id: 'Grocery', label: 'Grocery', icon: '🛒', enabled: false },
  ];

  const handleStationSelect = (index) => {
    setSelectedStationIndex(index);
    flyToStation(index);
  };

  const handleStationClick = (index) => {
    setSelectedStationIndex(index);
  };

  const { mapContainer, flyToStation, recenterMap, searchArea, visibleStations } = useMapbox(
    fuelStations,
    handleStationClick
  );

  // Remove auto-fly on selection index change; fly only on explicit user actions

  return (
    <div className="h-full w-full flex overflow-hidden bg-gray-50 min-h-0">
      {/* Map area grows to fill remaining space */}
      <div className="flex-grow relative min-h-0">
        {/* Map container fills parent via width/height */}
        <div ref={mapContainer} className="w-full h-full" />
        
        <SearchOverlay
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilter={selectedFilter}
          onFilterChange={setSelectedFilter}
          showSidebar={showSidebar}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          filters={filters}
        />

        {/* Top Right Overlay - Balance/Rewards */}
        <div className="absolute top-6 right-6 z-20 pointer-events-none">
          <div className="bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3 shadow-lg pointer-events-auto">
            <span className="text-emerald-700 font-semibold text-sm">KES 0</span>
          </div>
        </div>

        {/* Map Controls */}
        <MapControls 
          onRecenterLocation={recenterMap}
          onSearchArea={searchArea}
          position="desktop"
        />

        {/* Left Sidebar Overlay - Station List (Collapsible) */}
        <div 
          className={`absolute left-6 top-24 bottom-6 w-96 bg-white rounded-2xl flex flex-col shadow-2xl overflow-hidden z-10 transition-transform duration-300 ease-in-out ${
            showSidebar ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
          }`}
        >
          {/* Sidebar Header */}
          <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
            <h2 className="text-lg font-bold text-gray-800 mb-1">Nearby Stations</h2>
            <p className="text-sm text-gray-600">{visibleStations.length} stations found</p>
          </div>

          {/* Station List */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            <div className="p-4 space-y-3">
              {!fuelStations || fuelStations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">Loading stations...</h3>
                  <p className="text-xs text-gray-500">Finding fuel stations near you</p>
                </div>
              ) : visibleStations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">No stations in view</h3>
                  <p className="text-xs text-gray-500 mb-3">Try moving the map or zooming out</p>
                  <button 
                    onClick={searchArea}
                    className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                  >
                    Search this area
                  </button>
                </div>
              ) : (
                <StationList
                  stations={visibleStations.map(v => v.station)}
                  selectedIndex={visibleStations.findIndex(v => v.index === selectedStationIndex)}
                  onStationSelect={(idxInVisible) => {
                    const globalIdx = visibleStations[idxInVisible]?.index ?? 0;
                    handleStationSelect(globalIdx);
                  }}
                  onMoreInfo={onStationDetail}
                  onClaim={onClaim}
                  variant="sidebar"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindFuelDesktop;
