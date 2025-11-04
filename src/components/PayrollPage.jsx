import React, { useState } from 'react';
import { useStore } from '../store';

const mockDrivers = [
  { id: 1, name: 'Benjamin Johannsen', type: '1099/W2', card: '8171', instant: true, quickPay: 0.00, status: 'PENDING' },
  { id: 2, name: 'Elizabeth Williamson', type: '1099/W2', card: '9345', instant: true, quickPay: 0.00, status: 'PENDING' },
  { id: 3, name: 'Juan Villareal', type: '1099/W2', card: '8787', instant: true, quickPay: 0.00, status: 'PENDING' },
  { id: 4, name: 'James Newton', type: '1099/W2', card: '3352', instant: false, quickPay: 0.00, status: 'PENDING' },
  { id: 5, name: 'Leslie Stephenson', type: '1099/W2', card: '7713', instant: true, quickPay: 0.00, status: 'PENDING' },
];

const fundingOptions = [
  { id: 'card-1', label: 'Mastercard ending in 8171' },
  { id: 'bank-1', label: 'JP Morgan Chase' },
];

const PayrollPage = () => {
  const storeProfiles = useStore((s) => s.profiles);
  const storeContacts = useStore((s) => s.contacts);

  const initialDrivers = (storeProfiles && storeProfiles.length > 0)
    ? storeProfiles.map((p, i) => ({ id: p.id || `p-${i}`, name: p.full_name || p.email || `Driver ${i+1}`, type: p.role || '1099/W2', card: '----', instant: true, quickPay: 0.00, status: 'PENDING' }))
    : (storeContacts && storeContacts.length > 0)
      ? storeContacts.map((c, i) => ({ id: `c-${i}`, name: c.name, type: '1099/W2', card: '----', instant: true, quickPay: 0.00, status: 'PENDING' }))
      : mockDrivers;

  const [drivers, setDrivers] = useState(initialDrivers);
  const [instantSource, setInstantSource] = useState(fundingOptions[0].id);
  const [bankSource, setBankSource] = useState(fundingOptions[1].id);

  const updateQuickPay = (id, value) => {
    setDrivers((prev) => prev.map(d => d.id === id ? { ...d, quickPay: value } : d));
  };

  const formatCurrency = (v) => {
    return Number(v).toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h1 className="text-2xl font-semibold text-gray-900">Payroll Overview</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium">Instant Payment</button>
          <button className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-50">Bank Transfer</button>
        </div>
      </div>

      {/* Funding sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Instant Payment Funding Source</h3>
              <p className="text-xs text-gray-500 mt-1">Select the card to use for instant payouts</p>
            </div>
            <select
              value={instantSource}
              onChange={(e) => setInstantSource(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm"
            >
              {fundingOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
          <div className="flex flex-col gap-3">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Bank Transfer (ACH) Funding Source</h3>
              <p className="text-xs text-gray-500 mt-1">Select the bank account for ACH transfers</p>
            </div>
            <select
              value={bankSource}
              onChange={(e) => setBankSource(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm"
            >
              {fundingOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {drivers.map((d) => (
          <div key={d.id} className="bg-white rounded-xl p-4 shadow-sm border border-emerald-100 space-y-3">
            {/* Driver Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {d.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{d.name}</div>
                  <div className="text-xs text-gray-500">{d.type}</div>
                </div>
              </div>
              <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">{d.status}</span>
            </div>

            {/* Card & Instant Payout */}
            <div className="flex items-center justify-between py-2 border-t border-gray-100">
              <div>
                <div className="text-xs text-gray-500">Debit Card</div>
                <div className="font-mono text-sm text-gray-800">{d.card}</div>
              </div>
              {d.instant ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                  Instant
                </span>
              ) : (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">Disabled</span>
              )}
            </div>

            {/* Quick Pay */}
            <div className="pt-2 border-t border-gray-100">
              <div className="text-xs text-gray-500 mb-2">Quick Pay</div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={d.quickPay}
                  onChange={(e) => updateQuickPay(d.id, Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                  placeholder="0.00"
                />
                <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium">Pay</button>
              </div>
              <div className="text-xs text-gray-500 mt-1">Current: {formatCurrency(d.quickPay)}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                <th className="w-1/3 py-3 px-4">Driver Name</th>
                <th className="w-1/6 py-3 px-4">1099/W2</th>
                <th className="w-1/6 py-3 px-4">Debit Card</th>
                <th className="w-1/6 py-3 px-4">Instant Payout</th>
                <th className="w-1/6 py-3 px-4">Quick Pay</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {drivers.map((d) => (
                <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4 align-middle">
                    <div className="font-medium text-gray-800">{d.name}</div>
                  </td>
                  <td className="py-3 px-4 align-middle text-gray-600">{d.type}</td>
                  <td className="py-3 px-4 align-middle text-gray-800 font-mono">{d.card}</td>
                  <td className="py-3 px-4 align-middle">
                    {d.instant ? (
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        Enabled
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-xs font-semibold">Disabled</span>
                    )}
                  </td>
                  <td className="py-3 px-4 align-middle">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500">{formatCurrency(d.quickPay)}</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={d.quickPay}
                        onChange={(e) => updateQuickPay(d.id, Number(e.target.value))}
                        className="w-24 px-2 py-1 border border-gray-200 rounded-md text-sm"
                      />
                      <button className="px-2 py-1 bg-emerald-600 text-white rounded-md text-xs hover:bg-emerald-700">Pay</button>
                    </div>
                  </td>
                  <td className="py-3 px-4 align-middle">
                    <span className="inline-block px-3 py-1 rounded-full bg-yellow-100 text-yellow-800 text-xs font-semibold">{d.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PayrollPage;
