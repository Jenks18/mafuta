# Station Data

This directory contains fuel station data for the Mafuta app.

## Shell Stations Data

The `shellStations.json` file should contain an array of Shell station objects.

### Expected Format

```json
[
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
]
```

### Required Fields

- `name`: String - Station name
- `address`: String - Full address
- `latitude`: Number - Latitude coordinate
- `longitude`: Number - Longitude coordinate

### Optional Fields (will use defaults if not provided)

- `price`: Number - Current fuel price (default: 2.85)
- `originalPrice`: Number - Original price before discount (default: price + 0.30)
- `cashback`: Number - Cashback amount in cents (default: 27)
- `isOpen`: Boolean - Whether station is currently open (default: true)
- `hours`: String - Operating hours (default: "24/7")
- `facilities`: Array - List of available facilities
- `amenities`: Array - List of available amenities
- `extraOffer`: String - Additional promotional offer

## How to Add Shell Stations

1. Copy your Shell stations JSON data
2. Paste it into `shellStations.json` (replace the empty array `[]`)
3. Ensure the data matches the format above
4. The app will automatically:
   - Transform the data to the app format
   - Calculate distances from user location
   - Sort stations by proximity
   - Display them on the map and in the list

## Coordinate System

- Latitude: North/South position (-90 to 90)
- Longitude: East/West position (-180 to 180)
- Nairobi approximate center: -1.2921, 36.8219

## Future Enhancements

- Fleet management integration
- Rewards tracking per station
- Real-time price updates
- Station availability status
- User reviews and ratings
