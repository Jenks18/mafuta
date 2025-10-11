import React from 'react';
import DriversPage from './DriversPage';
import VehiclesPage from './VehiclesPage';
import PayrollPage from './PayrollPage';
import UsersPage from './UsersPage';
import StationsAdmin from './StationsAdmin';
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
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <button onClick={()=>window.dispatchEvent(new CustomEvent('app:navigate',{detail:'dashboard'}))} className="px-3 py-2 rounded-lg border hover:border-emerald-300 text-gray-700 hover:text-emerald-700">Dashboard</button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('app:navigate',{detail:'fuel'}))} className="px-3 py-2 rounded-lg border hover:border-emerald-300 text-gray-700 hover:text-emerald-700">Find Fuel</button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('app:navigate',{detail:'cards'}))} className="px-3 py-2 rounded-lg border hover:border-emerald-300 text-gray-700 hover:text-emerald-700">Cards</button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('app:navigate',{detail:'transactions'}))} className="px-3 py-2 rounded-lg border hover:border-emerald-300 text-gray-700 hover:text-emerald-700">Transactions</button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('app:navigate',{detail:'trucks-map'}))} className="px-3 py-2 rounded-lg border hover:border-emerald-300 text-gray-700 hover:text-emerald-700">Trucks Map</button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('app:navigate',{detail:'drivers'}))} className="px-3 py-2 rounded-lg border hover:border-emerald-300 text-gray-700 hover:text-emerald-700">Drivers</button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('app:navigate',{detail:'vehicles'}))} className="px-3 py-2 rounded-lg border hover:border-emerald-300 text-gray-700 hover:text-emerald-700">Vehicles</button>
              <button onClick={()=>window.dispatchEvent(new CustomEvent('app:navigate',{detail:'payroll-overview'}))} className="px-3 py-2 rounded-lg border hover:border-emerald-300 text-gray-700 hover:text-emerald-700">Payroll</button>
            </div>
          </div>
        
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

                  {/* Quick link: Users admin */}
                  <div className="bg-white rounded-xl border border-gray-200 p-5">
                    <h3 className="text-lg font-semibold mb-2">Users</h3>
                    <p className="text-sm text-gray-600 mb-3">Invite and manage profiles.</p>
                    <div className="border rounded-lg overflow-hidden"><UsersPage /></div>
                  </div>

                  <div className="bg-white rounded-xl border border-gray-200 p-5 mt-6">
                    <h3 className="text-lg font-semibold mb-2">Stations</h3>
                    <p className="text-sm text-gray-600 mb-3">Set logos for stations (Shell and more).</p>
                    <StationsAdmin />
                  </div>
            </div>
          </section>
        </div>
        </div>
      </div>
    </div>
  );
};

export default MorePage;
