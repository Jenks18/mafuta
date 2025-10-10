# FindFuel Component Hierarchy

## Component Tree

```
FindFuelPage (Smart Container)
├── Responsive Detection
├── State Management (detail view, claim success)
│
├── Desktop Version
│   └── FindFuelDesktop
│       ├── useMapbox Hook
│       │   ├── Map Container
│       │   ├── Markers
│       │   └── Map Functions
│       │
│       ├── Search Bar & Filters (Top Left)
│       ├── Balance Display (Top Right)
│       ├── Sidebar Toggle Button
│       │
│       ├── MapControls (Desktop)
│       │   ├── Search Area Button (Top Center)
│       │   └── Recenter Button (Bottom Right)
│       │
│       └── Collapsible Sidebar (Left)
│           └── StationList
│               └── StationCard (× N stations)
│                   ├── Station Info
│                   ├── Price Display
│                   ├── Cashback Info
│                   └── Action Buttons
│
└── Mobile Version
    └── FindFuelMobile
        ├── useMapbox Hook
        │   ├── Map Container
        │   ├── Markers
        │   └── Map Functions
        │
        ├── Header (Fixed Top)
        │   ├── Search Bar
        │   ├── Balance
        │   └── Profile Button
        │
        ├── Filter Bar (Visible in Full State)
        │
        ├── MapControls (Mobile)
        │   ├── Search Area Button (Top Center)
        │   └── Recenter Button (Bottom Right)
        │
        └── Three-State Drawer (Bottom)
            ├── Initial State
            │   ├── Horizontal Scroll
            │   └── StationCard (× N stations)
            │       └── Station Info + Actions
            │
            ├── Middle State
            │   └── StationList (First 6 stations)
            │       └── StationCard (× 6)
            │
            └── Full State
                ├── Search Bar
                ├── Filters
                └── StationList (All stations)
                    └── StationCard (× N stations)

Shared Components (Used by Both)
├── StationCard
├── StationList
├── MapControls
└── ClaimSuccessToast
```

## Data Flow

```
User Interaction
      ↓
FindFuelPage (Routing & State)
      ↓
Desktop/Mobile Component (Layout & Local State)
      ↓
useMapbox Hook (Map Logic)
      ↓
Presentational Components (UI)
      ↓
Callbacks to Parent
```

## State Management Layers

### 1. Global State (Store)
- `fuelStations` - Array of all fuel stations

### 2. Page State (FindFuelPage)
- `isDesktop` - Device type detection
- `showStationDetail` - Detail page visibility
- `selectedStationId` - Selected station for details
- `showClaimSuccess` - Toast visibility

### 3. Desktop Local State (FindFuelDesktop)
- `selectedStationIndex` - Currently selected station
- `searchQuery` - Search input value
- `selectedFilter` - Active filter
- `showSidebar` - Sidebar visibility

### 4. Mobile Local State (FindFuelMobile)
- `selectedStationIndex` - Currently selected station
- `scrollState` - Drawer state (initial/middle/full)
- `searchQuery` - Search input value
- `selectedFilter` - Active filter
- `isDragging` - Drawer drag state
- `startY`, `currentY` - Touch coordinates

## Event Flow

### Station Selection
```
User clicks station
    ↓
StationCard.onSelect()
    ↓
StationList.onStationSelect(index)
    ↓
Desktop/Mobile.handleStationSelect(index)
    ↓
useMapbox.flyToStation(index)
    ↓
Map animates to station
```

### Claim Offer
```
User clicks "Claim"
    ↓
StationCard.onClaim()
    ↓
Desktop/Mobile.onClaim (prop from parent)
    ↓
FindFuelPage.handleClaim()
    ↓
Shows ClaimSuccessToast
    ↓
Auto-hides after 3s
```

### View Station Details
```
User clicks "More info"
    ↓
StationCard.onMoreInfo(stationId)
    ↓
Desktop/Mobile.onStationDetail (prop from parent)
    ↓
FindFuelPage.handleMoreInfo(stationId)
    ↓
Shows StationDetailPage
```

## Responsive Breakpoints

- **Mobile**: `< 1024px` → FindFuelMobile
- **Desktop**: `≥ 1024px` → FindFuelDesktop

The system automatically switches between layouts on window resize.
