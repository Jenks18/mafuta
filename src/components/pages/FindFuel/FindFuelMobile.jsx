import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '../../../store';
import StationCard from './StationCard';
import StationList from './StationList';
import MapControls from './MapControls';
import { useMapbox } from './useMapbox';

const FindFuelMobile = ({ onStationDetail, onClaim }) => {
  const { fuelStations } = useStore();
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const [scrollState, setScrollState] = useState('initial'); // 'initial', 'middle', 'full'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Gas');
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  
  const drawerRef = useRef(null);
  const stationScrollRef = useRef(null);

  const filters = [
    { id: 'All', label: 'All', icon: '⚏', enabled: true },
    { id: 'Gas', label: 'Gas', icon: '⛽', enabled: true },
    { id: 'Restaurant', label: 'Restaurant', icon: '🍽️', enabled: false },
    { id: 'Convenience', label: 'Convenience', icon: '🏪', enabled: false },
    { id: 'Grocery', label: 'Grocery', icon: '🛒', enabled: false },
  ];

  // Get drawer height based on scroll state
  const getDrawerHeight = () => {
    const windowHeight = window.innerHeight;
    switch (scrollState) {
      case 'initial': return Math.max(200, windowHeight * 0.28);
      case 'middle': return windowHeight * 0.65;
      case 'full': return windowHeight * 0.9;
      default: return Math.max(200, windowHeight * 0.28);
    }
  };

  const handleStationSelect = (index) => {
    setSelectedStationIndex(index);
    flyToStation(index);
    
    // Scroll to the selected station smoothly in initial state
    if (scrollState === 'initial' && stationScrollRef.current) {
      stationScrollRef.current.scrollTo({
        left: index * stationScrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
    
    // Collapse to initial state when selecting from list
    if (scrollState !== 'initial') {
      setScrollState('initial');
    }
  };

  const handleStationClick = (index) => {
  setSelectedStationIndex(index);
  if (scrollState === 'initial' && stationScrollRef.current) {
      stationScrollRef.current.scrollTo({
        left: index * stationScrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  // Fly when the user taps a marker
  flyToStation(index);
  };

  // Handle horizontal station scrolling with snap behavior
  const handleStationScroll = (e) => {
    if (scrollState !== 'initial') return;
    
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = e.target.offsetWidth;
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== selectedStationIndex && newIndex >= 0 && newIndex < fuelStations.length) {
      setSelectedStationIndex(newIndex);
      // Don't auto-fly here; user will see card selection. Fly on explicit select tap.
    }
  };

  // Handle drawer drag interactions
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartY(e.touches[0].clientY);
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    setCurrentY(e.touches[0].clientY);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const deltaY = startY - currentY;
    const threshold = 50;
    
    if (deltaY > threshold) {
      // Swipe up
      if (scrollState === 'initial') setScrollState('middle');
      else if (scrollState === 'middle') setScrollState('full');
    } else if (deltaY < -threshold) {
      // Swipe down  
      if (scrollState === 'full') setScrollState('middle');
      else if (scrollState === 'middle') setScrollState('initial');
    }
  };

  const { mapContainer, flyToStation, recenterMap, searchArea } = useMapbox(
    fuelStations,
    handleStationClick
  );

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden min-h-0">
      {/* Header with search, balance, and profile */}
      <div className="relative z-20 bg-emerald-600 px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3 max-w-6xl mx-auto">
          {/* Search bar */}
          <div className="flex-1 relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-3 bg-white border border-emerald-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
            />
          </div>

          {/* Balance */}
          <div className="bg-emerald-500 border border-emerald-400 rounded-full px-4 py-3">
            <span className="text-white font-medium text-sm">KES 0</span>
          </div>

          {/* Profile */}
          <button className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border border-emerald-400">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters - Show when in full state */}
      {scrollState === 'full' && (
        <div className="relative z-20 bg-white px-4 py-3 border-b border-gray-100">
          <div className="flex gap-4 max-w-6xl mx-auto justify-center lg:justify-start">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => filter.enabled && setSelectedFilter(filter.id)}
                disabled={!filter.enabled}
                className={`flex flex-col items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                  selectedFilter === filter.id && filter.enabled
                    ? 'text-emerald-600'
                    : filter.enabled 
                      ? 'text-gray-700 hover:text-emerald-600'
                      : 'text-gray-300'
                }`}
              >
                <div className={`text-2xl ${!filter.enabled ? 'grayscale opacity-50' : ''}`}>
                  {filter.icon}
                </div>
                <span className="text-xs font-medium">{filter.label}</span>
                {selectedFilter === filter.id && filter.enabled && (
                  <div className="w-6 h-0.5 bg-emerald-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

  {/* Map */}
  <div className="relative flex-1 h-full min-h-0">
        {/* Map container fills parent via width/height */}
        <div ref={mapContainer} className="w-full h-full" />
        
        <MapControls 
          onRecenterLocation={recenterMap}
          onSearchArea={searchArea}
          position="mobile"
        />
      </div>

      {/* Three-State Drawer System */}
      <div 
        ref={drawerRef}
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 ease-out"
        style={{ 
          height: `${getDrawerHeight()}px`,
          zIndex: 30 
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drawer handle */}
        <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full transition-colors hover:bg-gray-400" />
        </div>

        {/* STATE 1: INITIAL - Single station cards with horizontal scroll */}
        {scrollState === 'initial' && (
          <div className="h-full overflow-hidden">
            <div 
              ref={stationScrollRef}
              className="flex overflow-x-auto scrollbar-hide snap-x snap-mandatory"
              style={{ 
                scrollBehavior: 'smooth',
                scrollSnapType: 'x mandatory'
              }}
              onScroll={handleStationScroll}
            >
              {fuelStations.map((station, index) => (
                <div 
                  key={station.id}
                  className="flex-shrink-0 w-full px-4 snap-center"
                >
                  <StationCard
                    station={station}
                    isSelected={index === selectedStationIndex}
                    onSelect={() => handleStationSelect(index)}
                    onMoreInfo={onStationDetail}
                    onClaim={onClaim}
                    variant="compact"
                  />
                </div>
              ))}
            </div>
            
            {/* Station navigation indicators */}
            <div className="px-4 py-4 space-y-3">
              <div className="flex justify-center space-x-2">
                {fuelStations.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleStationSelect(index)}
                    className={`h-2 transition-all duration-200 rounded-full ${
                      index === selectedStationIndex 
                        ? 'bg-emerald-600 w-8' 
                        : 'bg-gray-300 w-2 hover:bg-gray-400'
                    }`} 
                  />
                ))}
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">← Swipe for more stations →</p>
                <p className="text-xs text-gray-400 mt-1">Swipe up to see all stations</p>
              </div>
            </div>
          </div>
        )}

        {/* STATE 2: MIDDLE - List view with some stations */}
        {scrollState === 'middle' && (
          <div className="h-full overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">
                  Nearby Stations ({fuelStations.length})
                </h2>
                <button 
                  onClick={() => setScrollState('initial')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Back to map
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">Swipe up for full view with search</p>
            </div>
            
            <div className="px-4 pb-4 pt-4">
              <StationList
                stations={fuelStations.slice(0, 6)}
                selectedIndex={selectedStationIndex}
                onStationSelect={handleStationSelect}
                onMoreInfo={onStationDetail}
                onClaim={onClaim}
              />
              
              {fuelStations.length > 6 && (
                <div className="text-center py-4">
                  <button 
                    onClick={() => setScrollState('full')}
                    className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                  >
                    View all {fuelStations.length} stations
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STATE 3: FULL - Full screen with search and filters */}
        {scrollState === 'full' && (
          <div className="h-full overflow-y-auto">
            <div className="px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Find Fuel Stations</h2>
                <button 
                  onClick={() => setScrollState('initial')}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Back to map
                </button>
              </div>
              
              {/* Search bar in full state */}
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search stations..."
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                />
              </div>
              
              {/* Filters in full state */}
              <div className="flex gap-4 overflow-x-auto pb-2">
                {filters.map((filter) => (
                  <button
                    key={filter.id}
                    onClick={() => filter.enabled && setSelectedFilter(filter.id)}
                    disabled={!filter.enabled}
                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors flex-shrink-0 ${
                      selectedFilter === filter.id && filter.enabled
                        ? 'text-emerald-600 bg-emerald-50'
                        : filter.enabled 
                          ? 'text-gray-700 hover:text-emerald-600'
                          : 'text-gray-300'
                    }`}
                  >
                    <div className={`text-2xl ${!filter.enabled ? 'grayscale opacity-50' : ''}`}>
                      {filter.icon}
                    </div>
                    <span className="text-xs font-medium">{filter.label}</span>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="px-4 pb-4">
              <div className="py-2">
                <p className="text-sm text-gray-600">{fuelStations.length} stations found near you</p>
              </div>
              
              <div className="pt-4">
                <StationList
                  stations={fuelStations}
                  selectedIndex={selectedStationIndex}
                  onStationSelect={handleStationSelect}
                  onMoreInfo={onStationDetail}
                  onClaim={onClaim}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FindFuelMobile;
