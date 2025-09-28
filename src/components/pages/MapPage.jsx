import React from 'react';
import MapView from '../MapView';
import { useStore } from '../../store';

const MapPage = () => {
  const { fuelStations } = useStore();

  return (
    <div className="flex-1">
      <MapView stations={fuelStations} />
    </div>
  );
};

export default MapPage;
