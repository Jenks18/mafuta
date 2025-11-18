import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store';
import { supabase, isSupabaseConfigured } from '../../lib/supabaseClient';

const PayrollPage = () => {
  const { drivers: storeDrivers, cards, loadDrivers, loadCards } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([loadDrivers(), loadCards()]);
      setIsLoading(false);
    };
    loadData();
  }, [loadDrivers, loadCards]);

  // Convert database drivers to payroll format
  const payrollDrivers = useMemo(() => {
    return storeDrivers.map(driver => {
      // Find assigned card for this driver
      const assignedCard = cards.find(card => card.assigned_driver_id === driver.id);
      
      return {
        id: driver.id,
        name: `${driver.first_name || ''} ${driver.last_name || ''}`.trim() || driver.email || 'Driver',
        type: driver.employment_type || '1099/W2',
        card: assignedCard?.last_four || '----',
        instant: assignedCard?.status === 'active',
        quickPay: 0.00,
        status: 'PENDING'
      };
    });
  }, [storeDrivers, cards]);

  const [drivers, setDrivers] = useState(payrollDrivers);
  
  // Update local state when database drivers change
  useEffect(() => {
    setDrivers(payrollDrivers);
  }, [payrollDrivers]);

  // Funding sources from cards
  const fundingOptions = useMemo(() => {
    const cardOptions = cards
      .filter(card => card.status === 'active')
      .map(card => ({
        id: card.id,
        label: `${card.provider || 'Card'} ending in ${card.last_four || '****'}`
      }));
    
    return cardOptions.length > 0 ? cardOptions : [
      { id: 'default', label: 'No active cards available' }
    ];
  }, [cards]);

  const [instantSource, setInstantSource] = useState(fundingOptions[0]?.id || 'default');
  const [bankSource, setBankSource] = useState(fundingOptions[0]?.id || 'default');

  const updateQuickPay = (id, value) => {
    setDrivers((prev) => prev.map(d => d.id === id ? { ...d, quickPay: value } : d));
  };

  const formatCurrency = (v) => {
    return Number(v).toLocaleString(undefined, { style: 'currency', currency: 'USD', minimumFractionDigits: 2 });
  };

  const [loadingMap, setLoadingMap] = useState({});

  const handlePay = async (driver) => {
    const amount = Number(driver.quickPay || 0);
    if (isNaN(amount) || amount <= 0) return;

    // optimistic UI
    setDrivers((prev) => prev.map(d => d.id === driver.id ? { ...d, status: 'PROCESSING' } : d));
    setLoadingMap((m) => ({ ...m, [driver.id]: true }));

    if (isSupabaseConfigured() && supabase) {
      try {
        const payload = {
          driver_name: driver.name,
          driver_id: driver.id,
          amount: amount,
          funding_source: instantSource,
          method: driver.instant ? 'instant' : 'bank',
          status: 'processing',
          created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase.from('payroll_payouts').insert(payload).select();
        if (error) throw error;

        // For demo: immediately mark paid (in production wait for provider/webhook)
        if (data && data[0] && data[0].id) {
          await supabase.from('payroll_payouts').update({ status: 'paid' }).eq('id', data[0].id);
        }

        setDrivers((prev) => prev.map(d => d.id === driver.id ? { ...d, status: 'PAID', quickPay: 0 } : d));
      } catch (err) {
        console.error('Payroll payout error:', err);
        setDrivers((prev) => prev.map(d => d.id === driver.id ? { ...d, status: 'FAILED' } : d));
      } finally {
        setLoadingMap((m) => ({ ...m, [driver.id]: false }));
      }
      return;
    }

    // Fallback local simulation
    setTimeout(() => {
      setDrivers((prev) => prev.map(d => d.id === driver.id ? { ...d, status: 'PAID', quickPay: 0 } : d));
      setLoadingMap((m) => ({ ...m, [driver.id]: false }));
    }, 800);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Payroll Overview</h1>
        </div>
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Payroll Overview</h1>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium">Instant Payment</button>
          <button className="px-4 py-2 rounded-lg border border-emerald-200 text-emerald-700 text-sm font-medium">Bank Transfer</button>
        </div>
      </div>

      {/* Funding sources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Instant Payment Funding Source</h3>
              <p className="text-xs text-gray-500 mt-1">Select the card to use for instant payouts</p>
            </div>
            <select
              value={instantSource}
              onChange={(e) => setInstantSource(e.target.value)}
              className="ml-4 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm"
            >
              {fundingOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-600">Bank Transfer (ACH) Funding Source</h3>
              <p className="text-xs text-gray-500 mt-1">Select the bank account for ACH transfers</p>
            </div>
            <select
              value={bankSource}
              onChange={(e) => setBankSource(e.target.value)}
              className="ml-4 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm shadow-sm"
            >
              {fundingOptions.map(opt => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-emerald-100">
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
                      <button
                        onClick={() => handlePay(d)}
                        disabled={!!loadingMap[d.id]}
                        className={`px-2 py-1 rounded-md text-xs ${loadingMap[d.id] ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-emerald-600 text-white'}`}
                      >
                        {loadingMap[d.id] ? 'Processing…' : 'Pay'}
                      </button>
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
