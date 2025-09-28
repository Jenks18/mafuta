import React from 'react';
import { useStore } from '../../store';
import TransactionForm from '../TransactionForm';

const TransactionsPage = () => {
  const { transactions, addTransaction, removeTransaction, formatCurrency } = useStore();

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      removeTransaction(id);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Content Container with gradient background */}
      <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
        <div className="max-w-3xl mx-auto space-y-6 p-6">
          <h1 className="text-2xl font-bold text-emerald-700">Transactions</h1>
        
        {/* Add Transaction Form */}
        <div className="bg-white p-4 rounded-xl shadow">
          <TransactionForm onAdd={(tx) => addTransaction(tx)} />
        </div>

        {/* Transactions Table */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-2">Action</th>
                  <th className="text-left py-3 px-2">Date</th>
                  <th className="text-left py-3 px-2">Description</th>
                  <th className="text-right py-3 px-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-2">
                      <button 
                        className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(t.id)}
                      >
                        Delete
                      </button>
                    </td>
                    <td className="py-3 px-2 text-gray-900">{t.date}</td>
                    <td className="py-3 px-2 text-gray-900">{t.desc}</td>
                    <td className="py-3 px-2 text-right font-semibold text-gray-900">
                      {formatCurrency(t.amount)}
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-gray-500">
                      No transactions yet. Add your first transaction above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
