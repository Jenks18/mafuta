import React from 'react';
import OverviewCard from './Dashboard/OverviewCard';
import FuelBalanceCard from './Dashboard/FuelBalanceCard';
import RecentTransactions from './Dashboard/RecentTransactions';
import UpcomingPayments from './Dashboard/UpcomingPayments';

const DashboardPage = () => {
  return (
    <div className="p-4 md:p-6 h-full flex flex-col gap-6 min-h-0">
      {/* Top row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <OverviewCard />
          <UpcomingPayments />
        </div>
        <div className="space-y-6">
          <FuelBalanceCard />
          {/* Tip card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Tips</h3>
            <p className="text-sm text-gray-600">Search for Shell stations and claim fuel at the best price. Tap "Search this area" on the map to refresh results.</p>
          </div>
        </div>
      </div>

      {/* Bottom takes remaining height */}
      <div className="flex-1 min-h-0">
        <div className="h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <div className="px-5 pt-4 pb-2 border-b">
            <h3 className="text-sm font-semibold text-gray-700">Recent transactions</h3>
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <div className="h-full overflow-auto">
              <RecentTransactions />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
