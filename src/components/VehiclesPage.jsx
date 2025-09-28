import React from 'react';

const VehiclesPage = ({ vehicles = [] }) => {
  const mockVehicles = vehicles.length > 0 ? vehicles : [
    { vin: '1HGCM82633A004352', make: 'Toyota', model: 'Hiace', year: 2020, status: 'active' },
    { vin: '2HGCM82633A004353', make: 'Ford', model: 'Transit', year: 2019, status: 'maintenance' },
    { vin: '3HGCM82633A004354', make: 'Mercedes', model: 'Sprinter', year: 2021, status: 'active' }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'maintenance': return 'bg-orange-100 text-orange-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Fleet Vehicles</h2>
        <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors">
          Add Vehicle
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockVehicles.map((vehicle, index) => (
          <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(vehicle.status)}`}>
                {vehicle.status}
              </span>
            </div>
            
            <h3 className="font-semibold text-gray-900 mb-2">
              {vehicle.year} {vehicle.make} {vehicle.model}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>VIN:</span>
                <span className="font-mono text-xs">{vehicle.vin}</span>
              </div>
              <div className="flex justify-between">
                <span>Fuel Level:</span>
                <span>{Math.floor(Math.random() * 100)}%</span>
              </div>
              <div className="flex justify-between">
                <span>Last Service:</span>
                <span>{Math.floor(Math.random() * 30)} days ago</span>
              </div>
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
    </div>
  );
};

export default VehiclesPage;
