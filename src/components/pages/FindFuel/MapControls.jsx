import React from 'react';

const MapControls = ({ 
  onRecenterLocation, 
  onSearchArea,
  position = 'desktop', // 'desktop' or 'mobile'
  className = '' 
}) => {
  if (position === 'desktop') {
    return (
      <>
        {/* Search this area button - Centered horizontally, positioned at top */}
    <div className="absolute top-24 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <button 
            onClick={onSearchArea}
      className="bg-white px-6 py-3 rounded-full shadow-lg text-sm font-medium text-emerald-600 hover:bg-gray-50 transition-colors flex items-center gap-2 pointer-events-auto"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
            Search this area
          </button>
        </div>

        {/* Location control - Bottom Right Overlay */}
    <div className="absolute bottom-6 right-6 z-20 flex flex-col gap-2 pointer-events-none">
          <button 
            onClick={onRecenterLocation}
      className="bg-white p-2.5 rounded-lg shadow-lg hover:bg-gray-50 transition-colors border border-gray-200 pointer-events-auto"
            title="Center map on your location"
          >
            {/* Minimal crosshair icon */}
            <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              <path strokeWidth="2" strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
              <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="opacity-60"/>
            </svg>
          </button>
        </div>
      </>
    );
  }

  // Mobile layout
  return (
    <>
      {/* Search this area button - Positioned near top center */}
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <button 
          onClick={onSearchArea}
      className="bg-white px-4 py-2 rounded-full shadow-lg text-sm font-medium text-emerald-600 hover:bg-gray-50 transition-colors flex items-center gap-2 pointer-events-auto"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          Search this area
        </button>
      </div>

      {/* Location controls - Bottom Right */}
    <div className="absolute bottom-32 right-4 flex flex-col gap-2 z-10 pointer-events-none">
        <button 
          onClick={onRecenterLocation}
      className="bg-white p-2.5 rounded-full shadow-lg hover:bg-gray-50 transition-colors border border-gray-200 pointer-events-auto"
        >
          <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth="2"/>
            <path strokeWidth="2" strokeLinecap="round" d="M12 2v3M12 19v3M2 12h3M19 12h3" />
            <circle cx="12" cy="12" r="9" strokeWidth="1.5" className="opacity-60"/>
          </svg>
        </button>
      </div>
    </>
  );
};

export default MapControls;
