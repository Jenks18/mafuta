import React, { useEffect } from 'react';
import { useStore } from '../../store';

const VehiclesPage = () => {
  const { vehicles = [], isLoadingVehicles, loadVehicles } = useStore();

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  };

  if (isLoadingVehicles) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Fleet Vehicles</h2>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Fleet Vehicles</h2>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add Vehicle
        </button>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          <p className="text-gray-600 font-medium mb-2">No vehicles found</p>
          <p className="text-sm text-gray-500">Add your first vehicle to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
            <div key={vehicle.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
                  {vehicle.status || 'active'}
                </span>
              </div>
              
              <h3 className="font-semibold text-gray-900 mb-2">
                {vehicle.year || ''} {vehicle.make || ''} {vehicle.model || ''}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                {vehicle.vin && (
                  <div className="flex justify-between">
                    <span>VIN:</span>
                    <span className="font-mono text-xs">{vehicle.vin}</span>
                  </div>
                )}
                {vehicle.license_plate && (
                  <div className="flex justify-between">
                    <span>License Plate:</span>
                    <span className="font-mono text-xs">{vehicle.license_plate}</span>
                  </div>
                )}
                {vehicle.color && (
                  <div className="flex justify-between">
                    <span>Color:</span>
                    <span>{vehicle.color}</span>
                  </div>
                )}
                {vehicle.fuel_type && (
                  <div className="flex justify-between">
                    <span>Fuel Type:</span>
                    <span className="capitalize">{vehicle.fuel_type}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex gap-2">
                <button className="flex-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Details
                </button>
                <button className="flex-1 text-gray-600 hover:text-gray-800 text-sm font-medium">
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehiclesPage;
