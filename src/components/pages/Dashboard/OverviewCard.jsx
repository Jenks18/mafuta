import React from 'react';
import { useDashboardData } from '../../../hooks/useDashboardData';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

const OverviewCard = () => {
  const { currentPeriod, loading, formatDate } = useDashboardData();
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="grid grid-cols-3 gap-3 md:gap-6">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const periodText = currentPeriod.start && currentPeriod.end
    ? `${formatDate(currentPeriod.start)} — ${formatDate(currentPeriod.end)}`
    : 'Loading...';

  // Calculate progress percentage
  const spentPercentage = currentPeriod.availableToSpend > 0
    ? Math.min(100, (currentPeriod.spent / currentPeriod.availableToSpend) * 100)
    : 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 md:p-5">
      <div className="flex items-center justify-between gap-2 mb-3 md:mb-4">
        <h3 className="text-sm md:text-base font-semibold text-gray-700 truncate">Current billing period</h3>
        <span className="text-[11px] md:text-xs text-gray-500 shrink-0">{periodText}</span>
      </div>
      <div className="grid grid-cols-3 gap-3 md:gap-6">
        <div className="min-w-0">
          <div className="text-[11px] md:text-xs text-gray-500">Spent</div>
          <div className="text-base md:text-lg font-semibold text-gray-800 truncate">{currencyKES(currentPeriod.spent)}</div>
        </div>
        <div className="min-w-0">
          <div className="text-[11px] md:text-xs text-gray-500">Savings</div>
          <div className="text-base md:text-lg font-semibold text-gray-800 truncate">{currencyKES(currentPeriod.savings)}</div>
        </div>
        <div className="text-right min-w-0">
          <div className="text-[11px] md:text-xs text-gray-500">Available to spend</div>
          <div className="text-xl md:text-2xl font-bold text-emerald-600 truncate">{currencyKES(currentPeriod.availableToSpend)}</div>
        </div>
      </div>
      <div className="mt-3 md:mt-4">
        <div className="h-2 rounded-full bg-gray-100">
          <div className="h-2 rounded-full bg-emerald-500" style={{ width: `${spentPercentage}%` }} />
        </div>
        <div className="mt-2 flex justify-between gap-3 text-[11px] md:text-xs text-gray-500">
          <span className="truncate">Pending transactions {currencyKES(currentPeriod.pendingTransactions)}</span>
          {currentPeriod.earlyPayments > 0 && (
            <span className="truncate">Early payments +{currencyKES(currentPeriod.earlyPayments)}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewCard;
