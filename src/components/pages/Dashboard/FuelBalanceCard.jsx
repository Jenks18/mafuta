import React from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

const FuelBalanceCard = () => {
  const { fuelCardBalance, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5 animate-pulse">
        <div className="h-20 bg-gray-200 rounded"></div>
      </div>
    );
  }

  const card = {
    last4: '1234',
    holder: 'Mafuta Fleet',
    brand: 'Shell Kenya',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5 flex items-start gap-4 md:gap-5">
      <div className="w-14 h-9 md:w-16 md:h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-sm md:text-base">
        KES
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] md:text-xs text-gray-500">Fuel card balance</div>
            <div className="text-lg md:text-xl font-bold text-gray-900 truncate">{currencyKES(fuelCardBalance)}</div>
          </div>
          <button className="px-2.5 md:px-3 py-1.5 md:py-2 text-xs md:text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100 shrink-0">Top up</button>
        </div>
        <div className="mt-2 md:mt-3 text-[11px] md:text-xs text-gray-500 truncate">
          {card.brand} • {card.holder} • •••• {card.last4}
        </div>
      </div>
    </div>
  );
};

export default FuelBalanceCard;
