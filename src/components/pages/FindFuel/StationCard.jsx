import React from 'react';

const StationCard = ({ 
  station, 
  isSelected, 
  onSelect, 
  onMoreInfo, 
  onClaim,
  variant = 'default' // 'default', 'compact', 'list'
}) => {
  const handleClick = () => {
    if (onSelect) onSelect();
  };

  const handleMoreInfo = (e) => {
    e.stopPropagation();
    if (onMoreInfo) onMoreInfo(station.id);
  };

  const handleClaim = (e) => {
    e.stopPropagation();
    if (onClaim) onClaim();
  };

  const baseClasses = "bg-white rounded-xl p-4 border cursor-pointer transition-all";
  const selectedClasses = isSelected 
    ? "border-emerald-500 bg-emerald-50 shadow-md ring-2 ring-emerald-200" 
    : "border-gray-200 hover:border-emerald-300 hover:shadow-md";

  const toKES = (usd) => {
    if (usd == null) return '';
    // Approx conversion; in production, pull a real rate or store KES directly
    const kes = usd * 130;
    return new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(kes);
  };

  return (
    <div 
      onClick={handleClick}
      className={`${baseClasses} ${selectedClasses}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 min-w-0">
          <img 
            src={`/logos/${station.brand.toLowerCase()}.png`} 
            alt={station.brand} 
            className={variant === 'compact' ? 'w-8 h-8 rounded-lg' : 'w-10 h-10 rounded-lg'}
            onError={(e) => e.target.style.display = 'none'} 
          />
          <div className="flex-1 min-w-0">
            <h3 className={`font-bold text-gray-800 truncate ${variant === 'compact' ? 'text-base' : 'text-lg'}`}>
              {station.brand || station.name}
            </h3>
            <p className="text-xs text-gray-600 truncate">{station.address}</p>
            <p className="text-xs text-gray-600 mt-0.5">
              {station.distance} • <span className="text-emerald-600 font-medium">Open</span>
            </p>
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex flex-col items-end">
            {station.originalPrice != null && (
              <span className="text-xs text-gray-400 line-through">{toKES(station.originalPrice)}</span>
            )}
            <span className={`font-bold text-gray-800 ${variant === 'compact' ? 'text-lg' : 'text-xl'}`}>
              {toKES(station.price)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-3 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-200">
        <div className="text-emerald-700 font-semibold text-sm truncate">
          {station.cashback}¢/L cash back on Regular
        </div>
        {station.extraOffer && (
          <div className="text-emerald-700 font-semibold text-xs mt-0.5 truncate">
            {station.extraOffer}
          </div>
        )}
      </div>
      
      <div className="flex gap-2">
        <button 
          onClick={handleMoreInfo}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-lg transition-colors text-sm"
        >
          More info
        </button>
        <button 
          onClick={handleClaim}
          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-colors text-sm"
        >
          Claim
        </button>
      </div>
    </div>
  );
};

export default StationCard;
