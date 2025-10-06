import React, { useState, useEffect } from 'react';
import { Search, MapPin, Navigation, Clock, Phone, Star, Fuel, Filter } from 'lucide-react';
import { useStore } from '../../store';
import FindFuelPageMobile from './FindFuelPageMobile';

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

const FindFuelPageDesktop = () => {
  const { fuelStations } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedStation, setSelectedStation] = useState(null);

  const filters = [
    { id: 'all', label: 'All', icon: Filter },
    { id: 'shell', label: 'Shell', icon: Fuel },
    { id: 'total', label: 'Total', icon: Fuel },
    { id: 'oryx', label: 'Oryx', icon: Fuel },
    { id: 'rubis', label: 'Rubis', icon: Fuel }
  ];

  // Filter stations based on active filter and search
  const filteredStations = fuelStations.filter(station => {
    const matchesFilter = activeFilter === 'all' || 
      station.brand.toLowerCase().includes(activeFilter);
    const matchesSearch = station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Find Fuel Stations</h1>
            
            {/* Search Bar */}
            <div className="flex items-center space-x-4 max-w-md flex-1 mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search stations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="text-green-600 font-semibold">
              Total Saved: $0.00
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex space-x-1 pb-4">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-green-100 text-green-700 border border-green-200'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <filter.icon size={18} />
                <span className="font-medium">{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Stations List */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Nearby Stations ({filteredStations.length})
            </h2>
            
            {filteredStations.map((station) => (
              <StationCardDesktop
                key={station.id}
                station={station}
                isSelected={selectedStation?.id === station.id}
                onSelect={() => setSelectedStation(station)}
              />
            ))}
          </div>

          {/* Map Placeholder */}
          <div className="bg-white rounded-lg shadow-sm border h-96 lg:h-auto">
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-4 text-green-500" />
                <p>Interactive map coming soon</p>
                <p className="text-sm">Desktop map integration in progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StationCardDesktop = ({ station, isSelected, onSelect }) => {
  return (
    <div 
      className={`bg-white rounded-lg border-2 p-6 cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-900">{station.brand}</h3>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              {station.cashbackRate}¢/gal cashback
            </span>
          </div>
          <h4 className="text-lg text-gray-700 mb-1">{station.name}</h4>
          <p className="text-gray-600 mb-3">{station.address}</p>
          
          <div className="flex items-center space-x-6 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock size={16} />
              <span>{station.hours}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Navigation size={16} />
              <span>{station.distance}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Phone size={16} />
              <span>{station.phone}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-900 mb-1">
            KSh {station.fuelPrices.regular}
          </div>
          <div className="text-sm text-gray-500">Regular</div>
          <div className="text-sm text-gray-500">per liter</div>
        </div>
      </div>

      {/* Fuel Prices Grid */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-900">KSh {station.fuelPrices.regular}</div>
          <div className="text-xs text-gray-500">Regular</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-900">KSh {station.fuelPrices.premium}</div>
          <div className="text-xs text-gray-500">Premium</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="font-semibold text-gray-900">KSh {station.fuelPrices.diesel}</div>
          <div className="text-xs text-gray-500">Diesel</div>
        </div>
      </div>

      {/* Amenities */}
      {station.amenities && station.amenities.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {station.amenities.map((amenity, index) => (
              <span 
                key={index}
                className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex space-x-3">
        <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors">
          Get Directions
        </button>
        <button className="flex-1 border border-green-600 text-green-600 py-2 px-4 rounded-lg font-medium hover:bg-green-50 transition-colors">
          Claim Cashback
        </button>
      </div>
    </div>
  );
};

export default FindFuelPage; 
              top: `${30 + (station.id * 10)}%` 
            }}
          >
            <div className="bg-white rounded-lg shadow-lg px-2 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
              {station.cashbackRegular}¢/gal
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
              <h3 className="font-bold text-gray-800">{fuelStations[0]?.name || 'Shell Westlands'}</h3>
              <p className="text-sm text-gray-600">{fuelStations[0]?.distance || '0.8 mi away'}</p>
              <p className="text-xs text-green-600 font-medium">OFFER AVAILABLE</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-emerald-700">KSh {fuelStations[0]?.regularPrice || '152.50'}</p>
              <p className="text-xs text-gray-500">REGULAR</p>
            </div>
          </div>
          <button className="w-full bg-emerald-600 text-white font-semibold py-3 rounded-xl hover:bg-emerald-700 transition-colors">
            Get fuel at this station
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
