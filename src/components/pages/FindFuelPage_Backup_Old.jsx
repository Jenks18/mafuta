import React, { useState, useRef, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useStore } from '../../store';
import StationDetailPage from './StationDetailPage';

// Set your Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoieWF6enlqZW5rcyIsImEiOiJjbWU2b2o0eXkxNDFmMm1vbGY3dWt5aXViIn0.8hEu3t-bv3R3kGsBb_PIcw';

const FindFuelPage = () => {
  const { fuelStations } = useStore();
  const [selectedStationIndex, setSelectedStationIndex] = useState(0);
  const [scrollState, setScrollState] = useState('initial'); // 'initial', 'middle', 'full'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Gas');
  const [showStationDetail, setShowStationDetail] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showSidebar, setShowSidebar] = useState(true); // State for sidebar visibility
  const drawerRef = useRef(null);
  const stationScrollRef = useRef(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

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

  // Handle horizontal station scrolling with snap behavior
  const handleStationScroll = (e) => {
    if (scrollState !== 'initial') return;
    
    const scrollLeft = e.target.scrollLeft;
    const cardWidth = e.target.offsetWidth; // Full width snapping
    const newIndex = Math.round(scrollLeft / cardWidth);
    
    if (newIndex !== selectedStationIndex && newIndex >= 0 && newIndex < fuelStations.length) {
      setSelectedStationIndex(newIndex);
      updateMapMarker(newIndex);
    }
  };

  // Update map to highlight selected station
  const updateMapMarker = (index) => {
    if (map.current && fuelStations[index]) {
      map.current.flyTo({
        center: fuelStations[index].coordinates,
        zoom: 14,
        speed: 1.2,
        curve: 1
      });
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

  // Handle mouse interactions for desktop
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartY(e.clientY);
    setCurrentY(e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setCurrentY(e.clientY);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const deltaY = startY - currentY;
    const threshold = 50;
    
    if (deltaY > threshold) {
      if (scrollState === 'initial') setScrollState('middle');
      else if (scrollState === 'middle') setScrollState('full');
    } else if (deltaY < -threshold) {
      if (scrollState === 'full') setScrollState('middle');
      else if (scrollState === 'middle') setScrollState('initial');
    }
  };

  // Initialize Mapbox map
  useEffect(() => {
    if (map.current) return; // Initialize map only once
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [36.8219, -1.2921], // Nairobi coordinates
      zoom: 12
    });

    // Add user location marker
    new mapboxgl.Marker({ color: '#059669' })
      .setLngLat([36.8219, -1.2921])
      .addTo(map.current);

    // Add station markers
    fuelStations.forEach((station, index) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <div class="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 cursor-pointer transition-all hover:bg-emerald-700">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          ${station.cashback}¢/gal
        </div>
      `;

      markerEl.addEventListener('click', () => handleStationChange(index));

      const marker = new mapboxgl.Marker(markerEl)
        .setLngLat(station.coordinates)
        .setPopup(
          new mapboxgl.Popup({ offset: 25 }).setHTML(`
            <div class="font-semibold text-gray-800">${station.name}</div>
            <div class="text-emerald-600 font-bold">$${station.price}</div>
          `)
        )
        .addTo(map.current);

      markers.current.push(marker);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Add mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e) => handleMouseMove(e);
    const handleGlobalMouseUp = () => handleMouseUp();

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, startY, currentY]);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClaim = () => {
    setShowClaimSuccess(true);
    setTimeout(() => setShowClaimSuccess(false), 3000);
  };

  const handleStationSelect = (index) => {
    setSelectedStationIndex(index);
    updateMapMarker(index);
    
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

  const handleMoreInfo = (stationId) => {
    setSelectedStationId(stationId);
    setShowStationDetail(true);
  };

  const handleBackToMap = () => {
    setShowStationDetail(false);
    setSelectedStationId(null);
  };

  const handleRecenterLocation = () => {
    if (map.current) {
      map.current.flyTo({
        center: [36.8219, -1.2921],
        zoom: 12,
        speed: 1.2,
        curve: 1
      });
    }
  };

  const handleSearchArea = () => {
    if (map.current) {
      const bounds = map.current.getBounds();
      console.log('Searching area:', bounds);
    }
  };

  // Handle programmatic station changes (from map clicks)
  const handleStationChange = (index) => {
    setSelectedStationIndex(index);
    if (scrollState === 'initial' && stationScrollRef.current) {
      stationScrollRef.current.scrollTo({
        left: index * stationScrollRef.current.offsetWidth,
        behavior: 'smooth'
      });
    }
  };

  // If showing station detail, render that instead
  if (showStationDetail && selectedStationId) {
    return <StationDetailPage stationId={selectedStationId} onBack={handleBackToMap} />;
  }

  const selectedStation = fuelStations[selectedStationIndex];

  // DESKTOP LAYOUT
  if (isDesktop) {
    return (
      <div className="flex-1 flex relative overflow-hidden bg-gray-50">
        {/* Full Screen Map */}
        <div className="flex-1 relative">
          <div ref={mapContainer} className="w-full h-full" />
          
          {/* Top Left Overlay - Search and Filter */}
          <div className="absolute top-6 left-6 z-20 flex items-center gap-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by zip code"
                className="w-64 pl-9 pr-3 py-2 bg-white border border-gray-300 rounded-lg text-sm shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            
            {/* Category Filter Dropdown */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer appearance-none bg-no-repeat bg-right pr-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236B7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                backgroundPosition: 'right 0.5rem center',
                backgroundSize: '1.5em 1.5em'
              }}
            >
              {filters.map((filter) => (
                <option key={filter.id} value={filter.id} disabled={!filter.enabled}>
                  {filter.label}
                </option>
              ))}
            </select>

            {/* Chevron Toggle Button for Sidebar */}
            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="bg-white p-2 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
              title={showSidebar ? "Hide station list" : "Show station list"}
            >
              {showSidebar ? (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </button>
          </div>

          {/* Top Right Overlay - Balance/Rewards */}
          <div className="absolute top-6 right-6 z-20">
            <div className="bg-emerald-50 border border-emerald-200 rounded-full px-6 py-3 shadow-lg">
              <span className="text-emerald-700 font-semibold text-sm">$0.00</span>
            </div>
          </div>

          {/* Search this area button - Centered horizontally, positioned at top */}
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10">
            <button 
              onClick={handleSearchArea}
              className="bg-white px-6 py-3 rounded-full shadow-lg text-sm font-medium text-emerald-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
              Search this area
            </button>
          </div>

          {/* Location control - Bottom Right Overlay */}
          <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2">
            <button 
              onClick={handleRecenterLocation}
              className="bg-white p-3 rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
              title="Center map on your location"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>

          {/* Left Sidebar Overlay - Station List (Collapsible) */}
          {showSidebar && (
            <div className="absolute left-6 top-24 bottom-6 w-96 bg-white rounded-2xl flex flex-col shadow-2xl overflow-hidden z-10">
              {/* Sidebar Header */}
              <div className="px-5 py-4 border-b border-gray-200 bg-gray-50 flex-shrink-0">
                <h2 className="text-lg font-bold text-gray-800 mb-1">Nearby Stations</h2>
                <p className="text-sm text-gray-600">{fuelStations.length} stations found</p>
              </div>

            {/* Station List */}
            <div className="flex-1 overflow-y-auto overscroll-contain"  style={{ maxHeight: 'calc(100vh - 120px)' }}>
              <div className="p-4 space-y-3">
                {fuelStations.map((station, index) => (
                  <div 
                    key={station.id}
                    onClick={() => handleStationSelect(index)}
                    className={`bg-white rounded-xl p-4 border cursor-pointer transition-all hover:shadow-md ${
                      index === selectedStationIndex 
                        ? 'border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200' 
                        : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        <img 
                          src={`/logos/${station.brand.toLowerCase()}.png`} 
                          alt={station.brand} 
                          className="w-10 h-10 rounded-lg" 
                          onError={(e) => e.target.style.display = 'none'} 
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-gray-800 text-base truncate">{station.name}</h3>
                          <p className="text-xs text-gray-600 truncate">{station.address}</p>
                          <p className="text-xs text-gray-600 mt-0.5">
                            {station.distance} • <span className="text-emerald-600 font-medium">Open</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="flex flex-col items-end">
                          <span className="text-xs text-gray-400 line-through">${station.originalPrice}</span>
                          <span className="text-xl font-bold text-gray-800">${station.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
                      <div className="text-emerald-700 font-semibold text-sm">
                        {station.cashback}¢/gal cash back on Regular
                      </div>
                      {station.extraOffer && (
                        <div className="text-emerald-700 font-semibold text-xs mt-0.5">
                          {station.extraOffer}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreInfo(station.id);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
                      >
                        More info
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaim();
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </div>
          )}
        </div>

        {/* Claim Success Toast */}
        {showClaimSuccess && (
          <div className="fixed top-24 right-6 z-50 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-slide-in-right">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Offer claimed successfully!</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // MOBILE LAYOUT (existing three-state drawer system)
  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
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
            <span className="text-white font-medium text-sm">$0.00</span>
          </div>

          {/* Profile */}
          <button className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center border border-emerald-400">
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* Filters - Show when not in initial state or when in full state */}
      {(scrollState === 'full') && (
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
      <div className="relative flex-1">
        {/* Mapbox container */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* Search this area button - Positioned near top center */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
          <button 
            onClick={handleSearchArea}
            className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-emerald-600 hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Search this area
          </button>
        </div>

        {/* Location controls - Bottom Right */}
        <div className="absolute bottom-32 right-4 flex flex-col gap-2 z-10">
          <button 
            onClick={handleRecenterLocation}
            className="bg-white p-3 rounded-full shadow-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
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
        onMouseDown={handleMouseDown}
      >
        {/* Drawer handle */}
        <div className="flex justify-center py-3 cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full transition-colors hover:bg-gray-400" />
        </div>

        {/* STATE 1: INITIAL - Single station cards with horizontal scroll */}
        {scrollState === 'initial' && (
          <div className="h-full overflow-hidden">
            {/* Horizontal scrolling station container */}
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
                  onClick={() => handleStationSelect(index)}
                >
                  <div className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                    index === selectedStationIndex ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`/logos/${station.brand.toLowerCase()}.png`} 
                          alt={station.brand} 
                          className="w-8 h-8" 
                          onError={(e) => e.target.style.display = 'none'} 
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{station.name}</h3>
                          <p className="text-sm text-gray-600">{station.address}</p>
                          <p className="text-sm text-gray-600">
                            {station.distance} • <span className="text-emerald-600 font-medium">Open</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-lg text-gray-400 line-through">${station.originalPrice}</span>
                          <span className="text-2xl font-bold text-gray-800">${station.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-emerald-600 font-semibold mb-3">
                      {station.cashback}¢/gal cash back on Regular
                    </div>

                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreInfo(station.id);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
                      >
                        More info
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaim();
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
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
            
            <div className="px-4 pb-4">
              <div className="space-y-3 pt-4">
                {fuelStations.slice(0, 6).map((station, index) => (
                  <div 
                    key={station.id}
                    onClick={() => handleStationSelect(index)}
                    className={`bg-gray-50 rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-md ${
                      index === selectedStationIndex ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`/logos/${station.brand.toLowerCase()}.png`} 
                          alt={station.brand} 
                          className="w-8 h-8" 
                          onError={(e) => e.target.style.display = 'none'} 
                        />
                        <div>
                          <h3 className="font-bold text-gray-800">{station.name}</h3>
                          <p className="text-sm text-gray-600">{station.address}</p>
                          <p className="text-sm text-gray-600">
                            {station.distance} • <span className="text-emerald-600 font-medium">Open</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">${station.originalPrice}</span>
                          <span className="text-lg font-bold text-gray-800">${station.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-emerald-600 font-semibold text-sm">
                        {station.cashback}¢/gal cash back on Regular
                      </div>
                      {station.extraOffer && (
                        <div className="text-emerald-600 font-semibold text-sm">
                          {station.extraOffer}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreInfo(station.id);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
                      >
                        More info
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaim();
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                ))}
                
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
              
              <div className="space-y-3 pt-4">
                {fuelStations.map((station, index) => (
                  <div 
                    key={station.id}
                    onClick={() => handleStationSelect(index)}
                    className={`bg-white rounded-2xl p-4 border shadow-sm cursor-pointer transition-all hover:shadow-md ${
                      index === selectedStationIndex ? 'border-emerald-500 bg-emerald-50 shadow-md' : 'border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <img 
                          src={`/logos/${station.brand.toLowerCase()}.png`} 
                          alt={station.brand} 
                          className="w-10 h-10" 
                          onError={(e) => e.target.style.display = 'none'} 
                        />
                        <div>
                          <h3 className="font-bold text-gray-800 text-lg">{station.name}</h3>
                          <p className="text-sm text-gray-600">{station.address}</p>
                          <p className="text-sm text-gray-600">
                            {station.distance} • <span className="text-emerald-600 font-medium">Open</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-base text-gray-400 line-through">${station.originalPrice}</span>
                          <span className="text-xl font-bold text-gray-800">${station.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <div className="text-emerald-600 font-semibold text-sm">
                        {station.cashback}¢/gal cash back on Regular
                      </div>
                      {station.extraOffer && (
                        <div className="text-emerald-600 font-semibold text-sm">
                          {station.extraOffer}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-3">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreInfo(station.id);
                        }}
                        className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
                      >
                        More info
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleClaim();
                        }}
                        className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 rounded-xl transition-colors"
                      >
                        Claim
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>      {/* Claim Success Toast */}
      {showClaimSuccess && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-lg shadow-lg animate-bounce">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Offer claimed successfully!</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default FindFuelPage;
