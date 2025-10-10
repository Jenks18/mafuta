import React, { useMemo, useState } from 'react';
import { useStore } from '../../store';
import TransactionForm from '../TransactionForm';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(Math.max(0, Math.round(n || 0)));

const TransactionsPage = () => {
  const { transactions, addTransaction, removeTransaction } = useStore();
  const [query, setQuery] = useState('');

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      removeTransaction(id);
    }
  };

  // Convert USD mock amounts to KES for display only
  const toKES = (usd) => currencyKES(usd * 130);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? transactions.filter(t => `${t.desc}`.toLowerCase().includes(q)) : transactions;
  }, [transactions, query]);

  const totals = useMemo(() => {
    const sum = filtered.reduce((acc, t) => acc + (t.amount || 0), 0);
    return {
      count: filtered.length,
      kes: toKES(sum),
    };
  }, [filtered]);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* App-wide gradient background */}
      <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
        <div className="p-4 md:p-6 space-y-4">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
              <div className="text-sm text-gray-600">{totals.count} items • Total {totals.kes}</div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search description…"
                value={query}
                onChange={(e)=>setQuery(e.target.value)}
                className="w-64 max-w-full px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-6 min-h-[60vh]">
            {/* Add form */}
            <div className="bg-white rounded-xl border border-gray-200 p-4">
              <TransactionForm onAdd={(tx) => addTransaction(tx)} />
            </div>

            {/* Recent small table */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-700">Recent (10)</div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-gray-500">
                      <th className="text-left font-semibold py-3 px-4">Date</th>
                      <th className="text-left font-semibold py-3 px-4">Description</th>
                      <th className="text-right font-semibold py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.slice(0,10).map(t => (
                      <tr key={`recent-${t.id}`} className="border-b border-gray-100">
                        <td className="py-3 px-4 text-sm">{t.date}</td>
                        <td className="py-3 px-4 text-sm">{t.desc}</td>
                        <td className="py-3 px-4 text-right text-sm font-semibold">{toKES(t.amount)}</td>
                      </tr>
                    ))}
                    {filtered.length === 0 && (
                      <tr><td colSpan="3" className="py-6 text-center text-sm text-gray-500">No results</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Full table */}
            <div className="min-h-0">
              <div className="bg-white rounded-xl border border-gray-200 flex flex-col h-[70vh] md:h-[72vh]">
                {/* Sticky table header */}
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 rounded-t-xl flex items-center justify-between">
                  <div className="text-sm font-semibold text-gray-700">All Transactions</div>
                </div>
                <div className="flex-1 overflow-auto">
                  <table className="w-full">
                    <thead className="sticky top-0 bg-white border-b border-gray-200">
                      <tr className="text-xs text-gray-500">
                        <th className="text-left font-semibold py-3 px-4">Action</th>
                        <th className="text-left font-semibold py-3 px-4">Date</th>
                        <th className="text-left font-semibold py-3 px-4">Description</th>
                        <th className="text-right font-semibold py-3 px-4">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((t) => (
                        <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4">
                            <button
                              className="text-red-600 hover:text-red-800 text-xs px-2 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors"
                              onClick={() => handleDelete(t.id)}
                            >
                              Delete
                            </button>
                          </td>
                          <td className="py-3 px-4 text-gray-900 text-sm whitespace-nowrap">{t.date}</td>
                          <td className="py-3 px-4 text-gray-900 text-sm">{t.desc}</td>
                          <td className="py-3 px-4 text-right font-semibold text-gray-900 whitespace-nowrap">{toKES(t.amount)}</td>
                        </tr>
                      ))}
                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan="4" className="py-12 text-center text-gray-500 text-sm">No results</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
