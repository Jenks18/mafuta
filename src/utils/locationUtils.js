/**
 * Location and Distance Utilities
 * Handles geolocation calculations and station sorting
 */

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} Radians
 */
const toRadians = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (distanceKm) => {
  if (distanceKm < 1) {
    return `${Math.round(distanceKm * 1000)} m`;
  }
  
  // Convert to miles for display (matching your current data)
  const distanceMiles = distanceKm * 0.621371;
  return `${distanceMiles.toFixed(1)} mi`;
};

/**
 * Sort stations by distance from user location
 * @param {Array} stations - Array of station objects
 * @param {number} userLat - User's latitude
 * @param {number} userLon - User's longitude
 * @returns {Array} Sorted array of stations with distance calculated
 */
export const sortStationsByDistance = (stations, userLat, userLon) => {
  return stations
    .map(station => {
      const [stationLon, stationLat] = station.coordinates;
      const distanceKm = calculateDistance(userLat, userLon, stationLat, stationLon);
      
      return {
        ...station,
        distanceKm,
        distance: formatDistance(distanceKm)
      };
    })
    .sort((a, b) => a.distanceKm - b.distanceKm);
};

/**
 * Transform Shell API data to app format
 * @param {Object} shellStation - Raw Shell station data
 * @param {number} index - Station index for ID
 * @returns {Object} Formatted station object
 */
export const transformShellStation = (shellStation, index) => {
  // Extract coordinates from Shell data
  const coordinates = [
    shellStation.longitude || 0,
    shellStation.latitude || 0
  ];

  // Extract facilities from description
  const description = shellStation.description || '';
  const facilities = [];
  if (description.includes('Shop') || description.includes('C-Store')) facilities.push('Shop');
  if (description.includes('Car Wash')) facilities.push('Car Wash');
  if (description.includes('Toilet')) facilities.push('Restrooms');
  if (description.includes('ATM')) facilities.push('ATM');
  
  // Extract food offerings
  const amenities = [];
  if (description.includes('KFC')) amenities.push('KFC');
  if (description.includes('Burger')) amenities.push('Burger');
  if (description.includes('Restaurant')) amenities.push('Restaurant');
  if (description.includes('Hot Food')) amenities.push('Hot Food');
  if (description.includes('Pizza')) amenities.push('Pizza');

  // Determine fuel types
  const hasPremium = description.includes('V-Power');
  const extraOffer = hasPremium ? '10% cash back on Shell V-Power' : '9% cash back inside the store';

  return {
    id: shellStation.id || `shell-${index + 1}`,
    name: shellStation.name || 'Shell Station',
    brand: 'Shell',
    address: shellStation.address ? shellStation.address.split('\n')[0] : 'Address not available',
    fullAddress: shellStation.address || '',
    region: shellStation.region || 'Nairobi',
    distance: '0.0 mi', // Will be calculated
    price: 2.85, // Default Shell price
    originalPrice: 3.15,
    cashback: 27,
    isOpen: true,
    coordinates,
    offers: [
      { 
        type: 'Regular', 
        price: 2.85, 
        originalPrice: 3.15, 
        cashback: 27 
      }
    ],
    extraOffer,
    // Shell-specific data
    description: shellStation.description || '',
    url: shellStation.url || '',
    facilities,
    amenities,
    hours: '24/7', // Default, can be updated if available
    fuelTypes: {
      vPower: description.includes('V-Power'),
      diesel: description.includes('Diesel'),
      unleaded: description.includes('Unleaded'),
      truckDiesel: description.includes('Truck Diesel')
    }
  };
};

/**
 * Get user's current location
 * @returns {Promise<{lat: number, lon: number}>} User's coordinates
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        });
      },
      (error) => {
        // Fallback to Nairobi coordinates
        console.warn('Location access denied, using default location:', error);
        resolve({
          lat: -1.2921,
          lon: 36.8219
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};
