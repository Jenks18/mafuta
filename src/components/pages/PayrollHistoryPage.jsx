import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../store';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 2 }).format(Math.max(0, n || 0));

const PayrollHistoryPage = () => {
  const { payrollPayouts, loadPayrollPayouts } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadPayrollPayouts();
      setIsLoading(false);
    };
    loadData();
  }, [loadPayrollPayouts]);

  // Filter payouts
  const filteredPayouts = useMemo(() => {
    let filtered = [...payrollPayouts];

    // Filter by period
    if (filterPeriod !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();
      
      if (filterPeriod === 'week') {
        cutoffDate.setDate(now.getDate() - 7);
      } else if (filterPeriod === 'month') {
        cutoffDate.setMonth(now.getMonth() - 1);
      } else if (filterPeriod === 'quarter') {
        cutoffDate.setMonth(now.getMonth() - 3);
      }
      
      filtered = filtered.filter(p => new Date(p.created_at) >= cutoffDate);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.driver_name?.toLowerCase().includes(q) ||
        p.reference_number?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
      );
    }

    return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [payrollPayouts, filterPeriod, searchQuery]);

  // Calculate totals
  const totals = useMemo(() => {
    return filteredPayouts.reduce((acc, payout) => ({
      count: acc.count + 1,
      amount: acc.amount + (payout.amount || 0)
    }), { count: 0, amount: 0 });
  }, [filteredPayouts]);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payroll History</h1>
          <p className="text-sm text-gray-600 mt-1">View all payroll payments and transactions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-1">Total Payments</div>
            <div className="text-3xl font-bold text-gray-900">{totals.count}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-1">Total Amount Paid</div>
            <div className="text-3xl font-bold text-emerald-600">{currencyKES(totals.amount)}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-1">Average Payment</div>
            <div className="text-3xl font-bold text-gray-900">
              {totals.count > 0 ? currencyKES(totals.amount / totals.count) : currencyKES(0)}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by driver, reference, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterPeriod}
              onChange={(e) => setFilterPeriod(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 3 Months</option>
            </select>
          </div>
        </div>

        {/* Payroll History */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Payment Records</h2>
          </div>

          {isLoading ? (
            <div className="p-12 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              <p className="text-sm text-gray-500 mt-3">Loading payroll history...</p>
            </div>
          ) : filteredPayouts.length === 0 ? (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 font-medium">No payroll records found</p>
              <p className="text-sm text-gray-500 mt-1">
                {searchQuery ? 'Try adjusting your search' : 'Payroll payments will appear here'}
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredPayouts.map((payout) => (
                  <div key={payout.id} className="p-4 hover:bg-gray-50">
                    {/* Header: Driver & Status */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <span className="text-sm font-semibold text-emerald-700">
                            {payout.driver_name ? payout.driver_name.charAt(0).toUpperCase() : 'D'}
                          </span>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {payout.driver_name || 'Unknown Driver'}
                          </div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {new Date(payout.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })} at {new Date(payout.created_at).toLocaleTimeString('en-US', { 
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </div>
                      </div>
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        payout.status === 'completed' 
                          ? 'bg-green-100 text-green-800' 
                          : payout.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {payout.status || 'completed'}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="space-y-2 ml-13">
                      {payout.reference_number && (
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-500">Reference</span>
                          <span className="font-mono text-gray-700">{payout.reference_number}</span>
                        </div>
                      )}
                      {payout.description && (
                        <div className="text-xs">
                          <span className="text-gray-500">Description: </span>
                          <span className="text-gray-700">{payout.description}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <span className="text-xs font-medium text-gray-500">Amount</span>
                        <span className="text-lg font-bold text-emerald-600">{currencyKES(payout.amount)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Driver</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Reference</th>
                      <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPayouts.map((payout) => (
                      <tr key={payout.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {new Date(payout.created_at).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(payout.created_at).toLocaleTimeString('en-US', { 
                              hour: 'numeric',
                              minute: '2-digit',
                              hour12: true
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center mr-3">
                              <span className="text-xs font-semibold text-emerald-700">
                                {payout.driver_name ? payout.driver_name.charAt(0).toUpperCase() : 'D'}
                              </span>
                            </div>
                            <div className="text-sm font-medium text-gray-900">
                              {payout.driver_name || 'Unknown Driver'}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-mono text-gray-600">{payout.reference_number || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {payout.description || 'Payroll payment'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-semibold text-gray-900">{currencyKES(payout.amount)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                            payout.status === 'completed' 
                              ? 'bg-green-100 text-green-800' 
                              : payout.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {payout.status || 'completed'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>

        {/* Summary Footer */}
        {filteredPayouts.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredPayouts.length}</span> payment{filteredPayouts.length !== 1 ? 's' : ''}
              </div>
              <div className="text-sm text-gray-600">
                Total: <span className="font-bold text-emerald-600 text-lg">{currencyKES(totals.amount)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PayrollHistoryPage;
