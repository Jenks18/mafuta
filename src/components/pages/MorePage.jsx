import React from 'react';
import DriversPage from './DriversPage';
import VehiclesPage from './VehiclesPage';
import PayrollPage from './PayrollPage';
import { useStore } from '../../store';

const MorePage = () => {
  const { contacts } = useStore();
  
  const mockVehicles = [
    { vin: '1HGCM82633A004352', make: 'Toyota', model: 'Hiace' },
    { vin: '2HGCM82633A004353', make: 'Ford', model: 'Transit' },
    { vin: '3HGCM82633A004354', make: 'Mercedes', model: 'Sprinter' }
  ];

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Content Container with gradient background */}
      <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
        <div className="p-6 max-w-3xl mx-auto space-y-8">
          <h1 className="text-2xl font-bold text-emerald-700">More</h1>
        
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Drivers Management</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <DriversPage drivers={contacts} />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Fleet Vehicles</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <VehiclesPage vehicles={mockVehicles} />
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Payroll System</h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <PayrollPage />
            </div>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MorePage;
