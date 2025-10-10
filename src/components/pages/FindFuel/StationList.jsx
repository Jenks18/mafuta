import React from 'react';
import StationCard from './StationCard';

const StationList = ({ 
  stations, 
  selectedIndex, 
  onStationSelect, 
  onMoreInfo, 
  onClaim,
  variant = 'default' // 'default', 'sidebar'
}) => {
  return (
    <div className="space-y-3">
      {stations.map((station, index) => (
        <StationCard
          key={station.id}
          station={station}
          isSelected={index === selectedIndex}
          onSelect={() => onStationSelect(index)}
          onMoreInfo={onMoreInfo}
          onClaim={onClaim}
          variant={variant === 'sidebar' ? 'default' : 'compact'}
        />
      ))}
    </div>
  );
};

export default StationList;
