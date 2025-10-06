# Future Features: Rewards & Fleet Management

## Overview
This document outlines the planned implementation of Rewards tracking and Fleet management features for the Mafuta fuel management app.

---

## 1. Rewards System

### Core Concepts

#### User Rewards Account
- **Points Balance**: Total cashback/rewards points earned
- **Tier System**: Bronze → Silver → Gold → Platinum (based on usage)
- **Expiration Tracking**: Points expire after 12 months
- **Redemption Options**: Cash out, fuel discount, gift cards

#### Rewards Sources
1. **Fuel Purchases**: Cashback per gallon/liter
2. **Station-Specific Offers**: Bonus cashback at participating stations
3. **In-Store Purchases**: Additional points for shop items
4. **Referral Bonuses**: Points for referring new users
5. **Streak Bonuses**: Extra points for consecutive purchases

### Data Structure

```javascript
// User Rewards Profile
const userRewards = {
  userId: "user123",
  currentBalance: 247.50,
  lifetimeEarnings: 1250.00,
  tier: "gold",
  pointsToNextTier: 250,
  expiringPoints: [
    { amount: 50.00, expiresOn: "2025-12-01" }
  ],
  achievements: [
    { id: "first-fill", name: "First Fill-up", pointsEarned: 50, unlockedOn: "2024-01-15" },
    { id: "fuel-master", name: "Fuel Master", pointsEarned: 100, unlockedOn: "2024-03-20" }
  ]
}

// Reward Transaction
const rewardTransaction = {
  id: "reward_001",
  userId: "user123",
  stationId: "shell-1",
  type: "fuel_purchase",
  fuelAmount: 40, // liters or gallons
  fuelType: "Regular",
  basePrice: 2.85,
  discountedPrice: 2.60,
  cashbackRate: 0.27, // per unit
  pointsEarned: 10.80,
  bonusPoints: 2.00,
  totalReward: 12.80,
  timestamp: "2025-01-15T14:30:00Z",
  status: "credited"
}
```

### Implementation Steps

1. **Store Enhancement**
   ```javascript
   // Add to store
   rewards: {
     balance: 0,
     tier: 'bronze',
     transactions: [],
     offers: []
   },
   
   actions: {
     earnRewards(transactionData) {
       // Calculate and credit rewards
     },
     redeemRewards(amount, method) {
       // Process redemption
     },
     checkTierProgress() {
       // Update user tier
     }
   }
   ```

2. **Rewards Dashboard Component**
   - Balance display with animation
   - Recent transactions list
   - Active offers carousel
   - Tier progress indicator
   - Redemption options

3. **Integration Points**
   - Claim button on FindFuelPage
   - Transaction confirmation flow
   - Receipt generation with QR code
   - Real-time balance updates

---

## 2. Fleet Management System

### Core Concepts

#### Fleet Overview
- **Vehicle Management**: Add, track, and manage multiple vehicles
- **Driver Assignment**: Assign drivers to specific vehicles
- **Fuel Cards**: Issue and track fuel cards per vehicle/driver
- **Usage Analytics**: Monitor fuel consumption and costs
- **Compliance**: Track mileage, service schedules, maintenance

#### User Roles
1. **Fleet Manager**: Full access, all vehicles
2. **Driver**: Limited access, assigned vehicle only
3. **Admin**: System configuration, reports

### Data Structure

```javascript
// Vehicle
const vehicle = {
  id: "VEH001",
  fleetId: "FLEET123",
  make: "Toyota",
  model: "Hilux",
  year: 2022,
  vin: "1HGBH41JXMN109186",
  licensePlate: "KAA 123B",
  fuelType: "Diesel",
  tankCapacity: 80, // liters
  currentDriver: "DRV001",
  assignedCard: "****1234",
  odometer: 45230, // km
  fuelEfficiency: 12.5, // km/L
  status: "active",
  lastService: "2024-12-15",
  nextService: "2025-03-15",
  documents: {
    insurance: { expiresOn: "2025-06-30", status: "active" },
    inspection: { expiresOn: "2025-05-15", status: "active" }
  }
}

// Driver
const driver = {
  id: "DRV001",
  fleetId: "FLEET123",
  name: "John Doe",
  licenseNumber: "DL12345678",
  licenseExpiry: "2026-12-31",
  phone: "+254712345678",
  email: "john.doe@company.com",
  assignedVehicles: ["VEH001", "VEH002"],
  status: "active",
  totalFuelPurchases: 150,
  totalFuelCost: 12500.00,
  averageFuelEfficiency: 11.8
}

// Fleet Fuel Transaction
const fleetTransaction = {
  id: "FTX001",
  fleetId: "FLEET123",
  vehicleId: "VEH001",
  driverId: "DRV001",
  cardId: "****1234",
  stationId: "shell-1",
  timestamp: "2025-01-15T10:30:00Z",
  fuelType: "Diesel",
  quantity: 45, // liters
  pricePerUnit: 2.85,
  totalCost: 128.25,
  odometer: 45230,
  location: {
    lat: -1.2921,
    lon: 36.8219,
    address: "Shell Westlands, Nairobi"
  },
  receiptUrl: "https://...",
  approved: true,
  approvedBy: "MGR001"
}
```

### Implementation Steps

1. **Store Extension**
   ```javascript
   fleet: {
     vehicles: [],
     drivers: [],
     cards: [],
     transactions: [],
     alerts: []
   },
   
   actions: {
     addVehicle(vehicleData) {},
     assignDriver(vehicleId, driverId) {},
     recordFuelPurchase(transactionData) {},
     generateFleetReport(startDate, endDate) {},
     setMaintenanceAlert(vehicleId, type, date) {}
   }
   ```

2. **Fleet Dashboard Components**
   - **VehiclesPage**: Grid/list view of all vehicles
   - **DriversPage**: Driver management interface
   - **FleetAnalytics**: Charts and insights
   - **AlertsPanel**: Maintenance, insurance, document expiry alerts
   - **TransactionHistory**: Detailed fuel purchase logs

3. **Vehicle Detail View**
   - Vehicle info card
   - Fuel consumption chart
   - Recent transactions
   - Maintenance history
   - Documents status

4. **Driver Management**
   - Driver profiles
   - Assignment interface
   - Performance metrics
   - Fuel efficiency scores

---

## 3. Integration Strategy

### Phase 1: Foundation (2-3 weeks)
- [x] Shell stations data integration
- [x] Location-based station sorting
- [ ] Basic rewards tracking
- [ ] Simple fleet vehicle registration

### Phase 2: Core Features (4-6 weeks)
- [ ] Rewards dashboard with tier system
- [ ] Transaction-reward linking
- [ ] Fleet management UI
- [ ] Driver assignment system
- [ ] Fuel card issuance

### Phase 3: Analytics & Automation (4-6 weeks)
- [ ] Rewards analytics
- [ ] Fleet consumption reports
- [ ] Automated alerts (maintenance, expiry)
- [ ] Budget tracking and limits
- [ ] Predictive fuel cost analysis

### Phase 4: Advanced Features (6-8 weeks)
- [ ] Mobile app integration
- [ ] Receipt scanning and OCR
- [ ] Route optimization suggestions
- [ ] Carbon footprint tracking
- [ ] Multi-fleet management
- [ ] API for third-party integrations

---

## 4. Database Schema Considerations

### Collections/Tables Needed

1. **users**
   - id, email, name, role, fleetId, createdAt

2. **rewards**
   - userId, balance, tier, lifetimeEarnings, updatedAt

3. **reward_transactions**
   - id, userId, stationId, type, amount, points, timestamp

4. **fleets**
   - id, companyName, adminUserId, settings, createdAt

5. **vehicles**
   - id, fleetId, make, model, vin, plate, status, specs

6. **drivers**
   - id, fleetId, name, license, contact, status

7. **fuel_cards**
   - id, cardNumber, fleetId, assignedTo, status, limits

8. **fleet_transactions**
   - id, fleetId, vehicleId, driverId, cardId, station, fuel, cost, timestamp

9. **alerts**
   - id, fleetId, vehicleId, type, dueDate, status, resolved

10. **stations** (enhanced)
    - id, brand, name, location, prices, rewards, facilities

---

## 5. API Endpoints

### Rewards API
```
GET    /api/rewards/balance/:userId
POST   /api/rewards/earn
POST   /api/rewards/redeem
GET    /api/rewards/history/:userId
GET    /api/rewards/offers
```

### Fleet API
```
GET    /api/fleet/:fleetId/vehicles
POST   /api/fleet/:fleetId/vehicles
PUT    /api/fleet/:fleetId/vehicles/:vehicleId
DELETE /api/fleet/:fleetId/vehicles/:vehicleId

GET    /api/fleet/:fleetId/drivers
POST   /api/fleet/:fleetId/drivers
PUT    /api/fleet/:fleetId/drivers/:driverId

GET    /api/fleet/:fleetId/transactions
POST   /api/fleet/:fleetId/transactions
GET    /api/fleet/:fleetId/reports/fuel-consumption
GET    /api/fleet/:fleetId/reports/cost-analysis

GET    /api/fleet/:fleetId/alerts
PUT    /api/fleet/:fleetId/alerts/:alertId/resolve
```

---

## 6. UI/UX Considerations

### Rewards
- **Visual Design**: Use emerald color scheme for consistency
- **Animations**: Smooth transitions for balance updates
- **Gamification**: Badges, achievements, progress bars
- **Notifications**: Push alerts for points expiry, tier upgrades

### Fleet Management
- **Dashboard**: Cards-based layout with key metrics
- **Data Visualization**: Charts for fuel consumption trends
- **Filters**: Date range, vehicle, driver, station
- **Export**: PDF/CSV reports for accounting

---

## Next Steps

1. **Review and approve** this implementation plan
2. **Set up database** (Firebase, Supabase, or PostgreSQL)
3. **Create API layer** (if using backend) or expand Zustand store
4. **Design UI mockups** for Rewards and Fleet pages
5. **Implement rewards tracking** with existing stations
6. **Build fleet management MVP** with vehicle registration
7. **Test with real Shell stations data**
8. **Iterate based on feedback**

---

## Questions to Resolve

1. Do you have a backend API, or should we use local storage + Zustand?
2. What payment method for rewards redemption? (M-Pesa, bank transfer, etc.)
3. Fleet management scope: Single fleet or multi-tenant?
4. Real-time sync needed, or batch updates acceptable?
5. Mobile app planned, or web-only for now?

Let me know which features you'd like to prioritize!
