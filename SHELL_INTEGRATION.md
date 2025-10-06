# Shell Stations Integration Guide

## Quick Start

Your Shell stations data is now integrated! Here's what's been set up:

### 1. Data Location
- **File**: `src/data/shellStations.json`
- **Format**: JSON array of station objects
- **Sample data**: 3 Shell stations included as examples

### 2. How to Add Your Shell Stations

Replace the contents of `src/data/shellStations.json` with your Shell stations data. Make sure each station has at minimum:

```json
{
  "name": "Shell Station Name",
  "address": "Full Address",
  "latitude": -1.2674,
  "longitude": 36.8108
}
```

Optional fields (will use defaults if not provided):
- `price`, `originalPrice`, `cashback`
- `isOpen`, `hours`, `facilities`, `amenities`, `extraOffer`

See `src/data/README.md` for complete documentation.

### 3. Features Implemented

✅ **Automatic Integration**
- Shell stations are automatically loaded and merged with existing stations
- All stations are transformed to a common format

✅ **Distance Calculation**
- Haversine formula calculates accurate distances
- Distances shown in miles (matching your current format)

✅ **Proximity Sorting**
- Stations automatically sorted by distance from user location
- Updates when user location changes

✅ **Location Services**
- Uses browser geolocation to get user position
- Falls back to Nairobi coordinates if location access denied

### 4. Store Actions Available

```javascript
import { useStore } from './store';

// In your component:
const { 
  fuelStations,           // All stations (sorted by distance)
  userLocation,           // Current user location
  setUserLocation,        // Update user location
  sortStationsByProximity,// Re-sort by distance
  addShellStations,       // Add more Shell stations
  refreshStations         // Refresh and re-sort
} = useStore();

// Update user location
setUserLocation(-1.2921, 36.8219);

// Manually add Shell stations
addShellStations(newShellStationsArray);

// Refresh sorting
refreshStations();
```

### 5. Testing

1. Add your Shell stations to `shellStations.json`
2. Refresh the app
3. Check the map and station list
4. Verify stations are sorted by distance
5. Click on stations to see details

### 6. Utility Functions

Located in `src/utils/locationUtils.js`:

- `calculateDistance(lat1, lon1, lat2, lon2)` - Get distance in km
- `formatDistance(distanceKm)` - Format for display
- `sortStationsByDistance(stations, userLat, userLon)` - Sort array
- `transformShellStation(shellStation, index)` - Transform data
- `getUserLocation()` - Get browser location

### 7. Next Steps

1. **Add Your Shell Stations Data**
   - Copy your JSON data
   - Paste into `src/data/shellStations.json`
   - Ensure coordinates are correct

2. **Review Features Roadmap**
   - See `FEATURES_ROADMAP.md` for Rewards & Fleet features
   - Decide which features to implement first

3. **Test Integration**
   - Verify all stations appear on map
   - Check distance calculations
   - Test mobile and desktop views

## Example: Adding Bulk Stations

If you have a large CSV or different format, you can convert it:

```javascript
// Example conversion script
const csvData = `name,address,lat,lon,price
Shell A,Address 1,-1.2674,36.8108,2.85
Shell B,Address 2,-1.2901,36.7819,2.83`;

const stations = csvData.split('\n').slice(1).map(line => {
  const [name, address, lat, lon, price] = line.split(',');
  return {
    name,
    address,
    latitude: parseFloat(lat),
    longitude: parseFloat(lon),
    price: parseFloat(price)
  };
});

console.log(JSON.stringify(stations, null, 2));
```

## Troubleshooting

**Stations not appearing?**
- Check console for errors
- Verify JSON format is valid
- Ensure coordinates are numbers, not strings

**Wrong distances?**
- Verify latitude/longitude are correct
- Check coordinate order (latitude, longitude)
- Ensure you're using decimal degrees, not DMS

**Stations not sorted?**
- Call `refreshStations()` after adding data
- Check user location is set correctly

## Support

For questions or issues:
1. Check `src/data/README.md`
2. Review `FEATURES_ROADMAP.md`
3. Inspect browser console for errors
4. Verify data format matches examples
