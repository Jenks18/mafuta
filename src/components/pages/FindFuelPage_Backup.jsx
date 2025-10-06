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
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Gas');
  const [showStationDetail, setShowStationDetail] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  const sliderRef = useRef(null);
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);

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
    new mapboxgl.Marker({ color: '#3B82F6' })
      .setLngLat([36.8219, -1.2921])
      .addTo(map.current);

    // Add station markers
    fuelStations.forEach((station, index) => {
      // Create custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'custom-marker';
      markerEl.innerHTML = `
        <div class="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 cursor-pointer">
          <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd" />
          </svg>
          ${station.cashback}¢/gal
        </div>
      `;

      // Add click event to marker
      markerEl.addEventListener('click', () => handleStationSelect(index));

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

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Remove fuelStations dependency to avoid recreation

  const handleClaim = () => {
    setShowClaimSuccess(true);
    setTimeout(() => setShowClaimSuccess(false), 3000);
  };

  const filters = [
    { id: 'All', label: 'All', icon: '⚏', enabled: true },
    { id: 'Gas', label: 'Gas', icon: '⛽', enabled: true },
    { id: 'Restaurant', label: 'Restaurant', icon: '🍽️', enabled: false },
    { id: 'Convenience', label: 'Convenience', icon: '🏪', enabled: false },
    { id: 'Grocery', label: 'Grocery', icon: '🛒', enabled: false },
  ];

  const handleStationSlide = (direction) => {
    const newIndex = direction === 'next' 
      ? (selectedStationIndex + 1) % fuelStations.length
      : selectedStationIndex > 0 ? selectedStationIndex - 1 : fuelStations.length - 1;
    setSelectedStationIndex(newIndex);
  };

  const handleStationSelect = (index) => {
    setSelectedStationIndex(index);
    setIsDrawerExpanded(false);
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
    // Get current map bounds for searching
    if (map.current) {
      const bounds = map.current.getBounds();
      console.log('Searching area:', bounds);
      // You could filter stations based on map bounds here
    }
  };

  // If showing station detail, render that instead
  if (showStationDetail && selectedStationId) {
    return <StationDetailPage stationId={selectedStationId} onBack={handleBackToMap} />;
  }

  const selectedStation = fuelStations[selectedStationIndex];

  const dragStart = useRef({ x: 0, isDragging: false });

  const handleTouchStart = (e) => {
    dragStart.current = { x: e.touches[0].clientX, isDragging: true };
  };

  const handleTouchMove = (e) => {
    if (!dragStart.current.isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!dragStart.current.isDragging) return;
    
    const deltaX = e.changedTouches[0].clientX - dragStart.current.x;
    const threshold = 50;

    if (Math.abs(deltaX) > threshold) {
      if (deltaX > 0) {
        handleStationSlide('prev');
      } else {
        handleStationSlide('next');
      }
    }
    
    dragStart.current.isDragging = false;
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row relative overflow-hidden">
      {/* Main Map Content */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header with search, balance, and profile */}
        <div className="relative z-20 bg-white px-4 py-3 shadow-sm">
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
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>

            {/* Balance */}
            <div className="bg-gray-50 border border-gray-200 rounded-full px-4 py-3">
              <span className="text-emerald-600 font-medium text-sm">$0.00</span>
            </div>

            {/* Profile */}
            <button className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center border border-gray-200">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        {/* Filters */}
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

        {/* Map */}
        <div className="relative flex-1">
          {/* Mapbox container */}
          <div ref={mapContainer} className="w-full h-full" />

          {/* Search this area button */}
          <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 z-10 lg:bottom-4">
            <button 
              onClick={handleSearchArea}
              className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-blue-600 hover:bg-gray-50 transition-colors"
            >
              Search this area
            </button>
          </div>

          {/* Location controls */}
          <div className="absolute bottom-20 right-4 flex flex-col gap-2 z-10 lg:bottom-4">
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
      </div>

      {/* Station Details Drawer */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 lg:relative lg:w-96 lg:right-auto lg:bottom-auto lg:h-full lg:rounded-none lg:shadow-lg lg:border-l ${
          isDrawerExpanded ? 'h-4/5 lg:h-full' : 'h-auto lg:h-full'
        }`}
        style={{ 
          transform: isDrawerExpanded ? 'translateY(0)' : 'translateY(0)',
          zIndex: 30 
        }}
      >
        {/* Drawer handle */}
        <div className="flex justify-center py-2">
          <button 
            onClick={() => setIsDrawerExpanded(!isDrawerExpanded)}
            className="w-10 h-1 bg-gray-300 rounded-full"
          />
        </div>

        {!isDrawerExpanded ? (
          /* Collapsed state - Single station card */
          <div 
            className="px-4 pb-4"
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <img src={`/logos/${selectedStation.brand.toLowerCase()}.png`} alt={selectedStation.brand} className="w-6 h-6" onError={(e) => e.target.style.display = 'none'} />
                  <div>
                    <h3 className="font-bold text-gray-800">{selectedStation.name}</h3>
                    <p className="text-sm text-gray-600">{selectedStation.address}</p>
                    <p className="text-sm text-gray-600">{selectedStation.distance} • <span className="text-emerald-600">Open</span></p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <span className="text-lg text-gray-400 line-through">${selectedStation.originalPrice}</span>
                    <span className="text-xl font-bold text-gray-800">${selectedStation.price}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-emerald-600 font-semibold text-sm mb-3">
                {selectedStation.cashback}¢/gal cash back on Regular
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => handleMoreInfo(selectedStation.id)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 rounded-xl transition-colors"
                >
                  More info
                </button>
                <button 
                  onClick={handleClaim}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-xl transition-colors"
                >
                  Claim
                </button>
              </div>
            </div>
            
            {/* Swipe indicator */}
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">Swipe up for offer list</p>
            </div>
          </div>
        ) : (
          /* Expanded state - List of stations */
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="px-4 py-2 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Nearby Stations ({fuelStations.length})</h2>
                <button 
                  onClick={() => setIsDrawerExpanded(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                >
                  Return to map
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="space-y-3 pt-4">
                {fuelStations.map((station, index) => (
                  <div 
                    key={station.id}
                    onClick={() => handleStationSelect(index)}
                    className={`bg-gray-50 rounded-2xl p-4 border cursor-pointer transition-colors ${
                      index === selectedStationIndex ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <img src={`/logos/${station.brand.toLowerCase()}.png`} alt={station.brand} className="w-8 h-8" onError={(e) => e.target.style.display = 'none'} />
                        <div>
                          <h3 className="font-bold text-gray-800">{station.name}</h3>
                          <p className="text-sm text-gray-600">{station.address}</p>
                          <p className="text-sm text-gray-600">{station.distance} • <span className="text-emerald-600">Open</span></p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-400 line-through">${station.originalPrice}</span>
                          <span className="text-lg font-bold text-gray-800">${station.price}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-emerald-600 font-semibold text-sm">
                          {station.cashback}¢/gal cash back on Regular
                        </div>
                        
                        {station.extraOffer && (
                          <div className="text-emerald-600 font-semibold text-sm">
                            {station.extraOffer}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2 ml-4">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMoreInfo(station.id);
                          }}
                          className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          More info
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClaim();
                          }}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-3 py-2 rounded-lg text-sm transition-colors"
                        >
                          Claim
                        </button>
                      </div>
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
