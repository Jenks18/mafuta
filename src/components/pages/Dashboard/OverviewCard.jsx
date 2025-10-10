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
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-700">Current billing period</h3>
        <span className="text-xs text-gray-500">Mon 05/02 — Sun 05/08</span>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div>
          <div className="text-xs text-gray-500">Spent</div>
          <div className="text-lg font-semibold text-gray-800">{currencyKES(toKES(spentUSD))}</div>
        </div>
        <div>
          <div className="text-xs text-gray-500">Savings</div>
          <div className="text-lg font-semibold text-gray-800">{currencyKES(toKES(savingsUSD))}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-500">Available to spend</div>
          <div className="text-2xl font-bold text-emerald-600">{currencyKES(toKES(availableUSD))}</div>
        </div>
      </div>
      <div className="mt-4">
        <div className="h-2 rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: '35%' }} />
        </div>
        <div className="mt-2 flex justify-between text-xs text-gray-500">
          <span>Pending transactions {currencyKES(toKES(35))}</span>
          <span>Early payments +{currencyKES(toKES(100))}</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
