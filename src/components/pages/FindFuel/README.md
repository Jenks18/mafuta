# FindFuel Component Architecture

## Overview
The FindFuel feature has been refactored into a modular, maintainable architecture with separate components for desktop and mobile versions.

## Directory Structure

```
src/components/pages/
├── FindFuelPage.jsx                    # Main container (smart component)
├── FindFuel/                           # Modular components folder
│   ├── index.js                        # Exports all FindFuel components
│   ├── FindFuelDesktop.jsx            # Desktop-specific layout
│   ├── FindFuelMobile.jsx             # Mobile-specific layout (3-state drawer)
│   ├── StationCard.jsx                # Reusable station card component
│   ├── StationList.jsx                # Reusable station list component
│   ├── MapControls.jsx                # Reusable map control buttons
│   ├── ClaimSuccessToast.jsx          # Success notification component
│   └── useMapbox.js                   # Custom hook for Mapbox logic
```

## Component Responsibilities

### FindFuelPage.jsx (Main Container)
- **Type**: Smart Container Component
- **Responsibilities**:
  - Detects device type (desktop/mobile)
  - Manages routing between map view and station detail view
  - Handles claim success notifications
  - Delegates rendering to appropriate version (Desktop/Mobile)

### FindFuelDesktop.jsx
- **Type**: Desktop Layout Component
- **Responsibilities**:
  - Full-screen map with collapsible sidebar
  - Desktop-optimized UI and interactions
  - Search bar and filter dropdown in top-left
  - Balance display in top-right
  - Sidebar toggle functionality

### FindFuelMobile.jsx
- **Type**: Mobile Layout Component
- **Responsibilities**:
  - Three-state drawer system (initial, middle, full)
  - Touch/swipe interactions
  - Horizontal station scrolling (initial state)
  - Optimized for mobile screens

### StationCard.jsx
- **Type**: Presentational Component
- **Props**:
  - `station` - Station data object
  - `isSelected` - Boolean for selected state
  - `onSelect` - Callback for selection
  - `onMoreInfo` - Callback for more info button
  - `onClaim` - Callback for claim button
  - `variant` - 'default', 'compact', or 'list' styling
- **Responsibilities**:
  - Displays station information
  - Handles user interactions (select, more info, claim)

### StationList.jsx
- **Type**: Container Component
- **Props**:
  - `stations` - Array of station objects
  - `selectedIndex` - Currently selected station index
  - `onStationSelect` - Station selection handler
  - `onMoreInfo` - More info handler
  - `onClaim` - Claim handler
  - `variant` - List styling variant
- **Responsibilities**:
  - Renders list of StationCard components
  - Manages list-level interactions

### MapControls.jsx
- **Type**: Presentational Component
- **Props**:
  - `onRecenterLocation` - Callback to recenter map
  - `onSearchArea` - Callback to search current area
  - `position` - 'desktop' or 'mobile' for positioning
- **Responsibilities**:
  - Renders map control buttons
  - Handles different positioning for desktop/mobile

### ClaimSuccessToast.jsx
- **Type**: Presentational Component
- **Props**:
  - `show` - Boolean to show/hide toast
  - `position` - 'desktop' or 'mobile' for positioning
- **Responsibilities**:
  - Displays success message after claiming offer

### useMapbox.js
- **Type**: Custom Hook
- **Returns**:
  - `mapContainer` - Ref for map container div
  - `map` - Map instance ref
  - `markers` - Array of marker refs
  - `flyToStation(index)` - Function to fly to station
  - `recenterMap()` - Function to recenter map
  - `searchArea()` - Function to search current area
- **Responsibilities**:
  - Initializes Mapbox map
  - Manages map markers
  - Provides map interaction functions

## Benefits of This Architecture

### 1. **Separation of Concerns**
- Desktop and mobile logic are completely separated
- No interference between versions
- Easier to debug and maintain

### 2. **Reusability**
- Shared components (StationCard, StationList, MapControls) used by both versions
- Custom hooks encapsulate complex logic
- Easy to reuse components in other parts of the app

### 3. **Maintainability**
- Each component has a single responsibility
- Clear file structure and naming
- Easy to locate and modify specific functionality

### 4. **Testability**
- Small, focused components are easier to test
- Custom hooks can be tested independently
- Clear props interface for components

### 5. **Scalability**
- Easy to add new features to specific versions
- Simple to create new variants (tablet, etc.)
- Components can be extended without affecting others

## Usage Example

```jsx
// Simple usage in your router or app
import FindFuelPage from './components/pages/FindFuelPage';

function App() {
  return (
    <FindFuelPage />
  );
}

// The component automatically handles desktop/mobile rendering
```

## Customization

### Adding a New Station Card Variant
```jsx
// In StationCard.jsx, add a new variant
const variants = {
  default: 'w-10 h-10',
  compact: 'w-8 h-8',
  large: 'w-12 h-12', // New variant
};
```

### Modifying Map Behavior
```jsx
// Edit useMapbox.js to customize map logic
export const useMapbox = (fuelStations, onStationClick) => {
  // Add custom map behavior here
};
```

### Creating a Tablet Version
```jsx
// Create FindFuelTablet.jsx
// Update FindFuelPage.jsx to detect tablet screen size
const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
```

## Migration from Old Version

The old monolithic FindFuelPage.jsx has been backed up as:
- `FindFuelPage_Backup_Old.jsx`

All functionality has been preserved and improved in the new modular version.

## Future Enhancements

1. **Add unit tests** for each component
2. **Implement lazy loading** for better performance
3. **Add animation variants** for smoother transitions
4. **Create Storybook stories** for component documentation
5. **Add TypeScript** for better type safety
