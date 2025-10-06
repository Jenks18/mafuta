import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, User, MapPin, Navigation, Clock, 
  Fuel, UtensilsCrossed, Store, ShoppingCart, Grid
} from 'lucide-react';
import { useStore } from '../../store';
import FindFuelPageMobile from './FindFuelPageMobile';
import StationDetailPage from './StationDetailPage';
import mapboxgl from 'mapbox-gl';

// StationCard Component for Desktop
const StationCard = ({ station, onSelect, onViewDetails, compact = false }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-semibold text-gray-900">{station.name}</h3>
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
              {station.cashbackRate}¢/gal
            </span>
          </div>
          <p className="text-gray-600 text-sm mb-2">{station.address}</p>
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <Clock size={12} />
              <span>{station.hours}</span>
            </span>
            <span className="flex items-center space-x-1">
              <MapPin size={12} />
              <span>{station.distance}</span>
            </span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xl font-bold text-gray-900">
            KSh {station.fuelPrices.regular}
          </div>
          <div className="text-xs text-gray-500">per liter</div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          {station.amenities?.slice(0, 3).map((amenity, index) => (
            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
              {amenity}
            </span>
          ))}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails();
          }}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
};

const FindFuelPageDesktop = () => {
  const navigate = useNavigate();
  const { 
    fuelStations, 
    userLocation, 
    selectedStation, 
    setSelectedStation
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [showStationDetail, setShowStationDetail] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  const filters = [
    { id: 'all', label: 'All', icon: Grid },
    { id: 'gas', label: 'Gas', icon: Fuel },
    { id: 'restaurant', label: 'Restaurant', icon: UtensilsCrossed },
    { id: 'convenience', label: 'Convenience', icon: Store },
    { id: 'grocery', label: 'Grocery', icon: ShoppingCart }
  ];

  // Filter stations based on active filter and search
  const filteredStations = fuelStations.filter(station => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'gas' && station.brand) ||
      (activeFilter === 'restaurant' && station.amenities?.includes('Restaurant')) ||
      (activeFilter === 'convenience' && station.amenities?.includes('Convenience Store')) ||
      (activeFilter === 'grocery' && station.amenities?.includes('Grocery'));
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Use default Nairobi coordinates if user location is not available
    const defaultLocation = { lat: -1.2921, lng: 36.8219 }; // Nairobi CBD
    const mapCenter = userLocation && userLocation.lat && userLocation.lng ? userLocation : defaultLocation;

    mapboxgl.accessToken = 'pk.eyJ1IjoieWF6enlqZW5rcyIsImEiOiJjbWU2b2o0eXkxNDFmMm1vbGY3dWt5aXViIn0.8hEu3t-bv3R3kGsBb_PIcw';

    try {
      const newMap = new mapboxgl.Map({
        container: mapRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [mapCenter.lng, mapCenter.lat],
        zoom: 12
      });

      mapInstanceRef.current = newMap;

      // Add markers for fuel stations
      filteredStations.forEach((station, index) => {
        // Create custom marker element
        const el = document.createElement('div');
        el.innerHTML = `
          <div class="bg-blue-600 text-white px-2 py-1 rounded-lg text-sm font-medium shadow-lg border border-blue-700 cursor-pointer">
            ${station.cashbackRate}¢/gal
          </div>
        `;
        
        // Add marker to map
        new mapboxgl.Marker(el)
          .setLngLat([station.coordinates.lng, station.coordinates.lat])
          .addTo(newMap);

        // Add click handler
        el.addEventListener('click', () => {
          setSelectedStation(station);
        });
      });

      return () => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove();
          mapInstanceRef.current = null;
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
    }
  }, [filteredStations]);

  const handleStationSelect = (station) => {
    setSelectedStation(station);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: [station.coordinates.lng, station.coordinates.lat],
        zoom: 15
      });
    }
  };

  const handleViewDetails = () => {
    setShowStationDetail(true);
  };

  if (showStationDetail && selectedStation) {
    return (
      <StationDetailPage 
        station={selectedStation}
        onBack={() => setShowStationDetail(false)}
      />
    );
  }

  return (
    <div className="h-screen bg-gray-50 flex">
      {/* Left Panel - Station List */}
      <div className="w-1/3 bg-white shadow-lg flex flex-col">
        {/* Header */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 flex-1 bg-gray-100 rounded-full px-4 py-3">
              <Search className="text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 text-lg font-medium bg-transparent outline-none"
              />
            </div>
            <div className="flex items-center space-x-4 ml-4">
              <span className="text-green-600 font-medium text-lg bg-green-100 px-3 py-1 rounded-full">$0.00</span>
              <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                <User className="text-gray-600" size={20} />
              </div>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-2 overflow-x-auto">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-colors whitespace-nowrap min-w-[60px] ${
                  activeFilter === filter.id
                    ? 'text-green-600 bg-white border-b-2 border-green-600'
                    : 'text-gray-600 bg-transparent'
                }`}
              >
                <filter.icon size={18} />
                <span className="text-xs font-medium">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Station List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-4">
            <h3 className="text-lg font-semibold">All Stations ({filteredStations.length})</h3>
          </div>
          
          <div className="space-y-3">
            {filteredStations.map((station, index) => (
              <div
                key={station.id}
                onClick={() => handleStationSelect(station)}
              >
                <StationCard 
                  station={station}
                  onSelect={() => handleStationSelect(station)}
                  onViewDetails={() => {
                    setSelectedStation(station);
                    handleViewDetails();
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Map */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        
        {/* Location FAB */}
        <button className="absolute top-4 right-4 bg-white rounded-full p-3 shadow-lg border">
          <Navigation className="text-gray-600" size={20} />
        </button>

        {/* Search This Area Button */}
        <button className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg">
          Search this area
        </button>
      </div>
    </div>
  );
};

const FindFuelPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (isMobile) {
    return <FindFuelPageMobile />;
  }

  return <FindFuelPageDesktop />;
};

export default FindFuelPage;
