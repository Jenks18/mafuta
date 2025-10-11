import React from 'react';
import { useStore } from '../../../store';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

const UpcomingPayments = () => {
  const { transactions } = useStore();

  // Placeholder math: upcoming payment ~ 75% of recent spend; account balance ~ sum of amounts * 1.2
  const totalUSD = (transactions || []).reduce((s, t) => s + (t.amount || 0), 0);
  const toKES = (usd) => Math.round((usd || 0) * 130);
  const upcomingPaymentKES = toKES(totalUSD * 0.75 || 25000);
  const accountBalanceKES = toKES(totalUSD * 1.2 || 50000);
  const billingPeriod = 'Mon 05/08 — Sun 05/15';
  const nextPaymentDate = 'Mon 05/22';

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="divide-y">
        {/* Upcoming payment */}
        <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5">
          <div className="mt-0.5 w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs md:text-sm text-gray-700 break-words">
              Upcoming Payment: <span className="font-semibold">{currencyKES(upcomingPaymentKES)}</span> will be auto‑processed from your linked account on <span className="font-medium">{nextPaymentDate}</span>
            </div>
            <div className="text-[11px] md:text-xs text-gray-500 mt-1 truncate">Billing Period: {billingPeriod}</div>
          </div>
        </div>
        {/* Account balance */}
        <div className="flex items-start gap-3 md:gap-4 p-4 md:p-5">
          <div className="mt-0.5 w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h7M5 6h14a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2z"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xs md:text-sm text-gray-700 truncate">Account Balance: <span className="font-semibold">{currencyKES(accountBalanceKES)}</span></div>
            <div className="text-[11px] md:text-xs text-gray-500 mt-1">As of today</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingPayments;
