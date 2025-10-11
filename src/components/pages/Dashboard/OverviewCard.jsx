import React from 'react';
import { useStore } from '../../../store';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

const OverviewCard = () => {
  const { transactions, earnings } = useStore();
  // Simple aggregates (placeholder logic; can be replaced with real backend values)
  const spentUSD = transactions.reduce((sum, t) => sum + (t.amount || 0), 0);
  const savingsUSD = Math.max(0, earnings || 0); // reuse earnings as proxy savings
  const availableUSD = 4750; // placeholder available balance

  const toKES = (usd) => Math.round((usd || 0) * 130);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-3 md:mb-4">
        <h3 className="text-sm md:text-base font-semibold text-gray-700 truncate">Current billing period</h3>
        <span className="text-[11px] md:text-xs text-gray-500 shrink-0">Mon 05/02 — Sun 05/08</span>
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        <div className="min-w-0">
          <div className="text-[11px] md:text-xs text-gray-500">Spent</div>
          <div className="text-base md:text-lg font-semibold text-gray-800 truncate">{currencyKES(toKES(spentUSD))}</div>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] md:text-xs text-gray-500">Savings</div>
          <div className="text-base md:text-lg font-semibold text-gray-800 truncate">{currencyKES(toKES(savingsUSD))}</div>
        </div>
        <div className="text-right min-w-0">
          <div className="text-[11px] md:text-xs text-gray-500">Available to spend</div>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 truncate">{currencyKES(toKES(availableUSD))}</div>
        </div>
      </div>
      <div className="mt-3 md:mt-4">
        <div className="h-2 rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: '35%' }} />
        </div>
        <div className="mt-2 flex justify-between gap-3 text-[11px] md:text-xs text-gray-500">
          <span className="truncate">Pending transactions {currencyKES(toKES(35))}</span>
          <span className="truncate">Early payments +{currencyKES(toKES(100))}</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
