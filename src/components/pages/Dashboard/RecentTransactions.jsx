import React, { useMemo, useState } from 'react';
import { useStore } from '../../../store';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

const RecentTransactions = () => {
  const { transactions } = useStore();
  const [tab, setTab] = useState('approved');

  const items = useMemo(() => {
    const list = (transactions || []).slice().sort((a, b) => new Date(b.date) - new Date(a.date));
    return list.filter((t) => (tab === 'approved' ? t.status !== 'declined' : t.status === 'declined')).slice(0, 7);
  }, [transactions, tab]);

  const toKES = (usd) => Math.round((usd || 0) * 130);

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-4 md:px-5 pt-3 md:pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-sm md:text-base font-semibold text-gray-700">Recent transactions</h3>
          <div className="flex bg-gray-100 rounded-lg p-0.5 md:p-1 text-xs md:text-sm shrink-0">
            <button onClick={() => setTab('approved')} className={`px-2.5 md:px-3 py-1 rounded-md ${tab==='approved'?'bg-white shadow text-gray-900':'text-gray-600'}`}>Approved</button>
            <button onClick={() => setTab('declined')} className={`px-2.5 md:px-3 py-1 rounded-md ${tab==='declined'?'bg-white shadow text-gray-900':'text-gray-600'}`}>Declined</button>
          </div>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-y">
              <th className="px-4 md:px-5 py-2 font-medium">Date</th>
              <th className="px-4 md:px-5 py-2 font-medium">Station</th>
              <th className="px-4 md:px-5 py-2 font-medium">Vehicle</th>
              <th className="px-4 md:px-5 py-2 font-medium">Driver</th>
              <th className="px-4 md:px-5 py-2 font-medium text-right">Amount</th>
              <th className="px-4 md:px-5 py-2 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan="6" className="px-4 md:px-5 py-6 text-center text-gray-400">No transactions yet</td>
              </tr>
            )}
            {items.map((t) => (
              <tr key={t.id || `${t.date}-${t.station}`} className="border-b last:border-b-0 hover:bg-gray-50">
                <td className="px-4 md:px-5 py-3 text-gray-700 whitespace-nowrap">{new Date(t.date).toLocaleDateString()}</td>
                <td className="px-4 md:px-5 py-3 text-gray-800 max-w-[160px] md:max-w-none truncate">{t.station || t.merchant || 'Shell Station'}</td>
                <td className="px-4 md:px-5 py-3 text-gray-600 whitespace-nowrap">{t.vehicle || 'KDJ 123A'}</td>
                <td className="px-4 md:px-5 py-3 text-gray-600 max-w-[120px] md:max-w-none truncate">{t.driver || '—'}</td>
                <td className="px-4 md:px-5 py-3 text-right font-medium text-gray-900 whitespace-nowrap">{currencyKES(toKES(t.amount))}</td>
                <td className="px-4 md:px-5 py-3">
                  {t.status === 'declined' ? (
                    <span className="inline-flex items-center gap-1 text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">● Declined</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">● Approved</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTransactions;
