# Quick Reference Card - Shell Stations Integration

## 📍 Files Created/Modified

```
src/
├── data/
│   ├── shellStations.json       ← ADD YOUR SHELL DATA HERE
│   └── README.md                 (Data format guide)
├── utils/
│   └── locationUtils.js          (Distance calculations)
└── store/
    └── index.js                  (Enhanced with Shell integration)

Docs:
├── SHELL_INTEGRATION.md          (How-to guide)
├── INTEGRATION_SUMMARY.md        (What was done)
└── FEATURES_ROADMAP.md           (Rewards & Fleet plans)
```

## ⚡ Quick Actions

### Add Shell Stations
```bash
# Edit this file with your data:
open src/data/shellStations.json
```

### Use Store Actions
```javascript
import { useStore } from './store';

const {
  fuelStations,              // All stations (auto-sorted)
  userLocation,              // { lat, lon }
  setUserLocation,           // (lat, lon) => void
  addShellStations,          // (stations[]) => void
  sortStationsByProximity,   // () => void
  refreshStations            // () => void
} = useStore();
```

### Calculate Distance
```javascript
import { 
  calculateDistance,
  formatDistance,
  getUserLocation 
} from './utils/locationUtils';

// Get distance in km
const distKm = calculateDistance(lat1, lon1, lat2, lon2);

// Format for display
const formatted = formatDistance(distKm); // "2.5 mi"

// Get user location
const location = await getUserLocation(); // { lat, lon }
```

## 📋 Minimal Shell Station Format

```json
{
  "name": "Shell Station Name",
  "address": "Full Address",
  "latitude": -1.2674,
  "longitude": 36.8108
}
```

## 📋 Complete Shell Station Format

```json
{
  "name": "Shell Westlands",
  "address": "Waiyaki Way, Westlands, Nairobi",
  "latitude": -1.2674,
  "longitude": 36.8108,
  "price": 2.85,
  "originalPrice": 3.15,
  "cashback": 27,
  "isOpen": true,
  "hours": "24/7",
  "facilities": ["ATM", "Car Wash", "Shop"],
  "amenities": ["Restrooms", "WiFi"],
  "extraOffer": "9% cash back inside the store"
}
```

## 🎯 Current Status

✅ Shell stations automatically loaded  
✅ Distance-based sorting active  
✅ Desktop & mobile views working  
✅ Map markers showing all stations  
✅ 8 total stations (5 mock + 3 Shell samples)  

## 🚀 To-Do

1. [ ] Add your actual Shell stations data
2. [ ] Test distance calculations
3. [ ] Review Rewards system plan
4. [ ] Review Fleet management plan
5. [ ] Decide on backend/database

## 📚 Documentation

- **Shell Integration**: `SHELL_INTEGRATION.md`
- **Summary**: `INTEGRATION_SUMMARY.md`
- **Future Features**: `FEATURES_ROADMAP.md`
- **Data Format**: `src/data/README.md`

## 🐛 Troubleshooting

**Stations not showing?**
→ Check console, verify JSON format

**Wrong distances?**
→ Verify lat/lon are numbers, not strings

**Need to refresh?**
```javascript
useStore.getState().refreshStations();
```

---

**You're all set!** Add your Shell stations data and you're ready to go! 🎉
