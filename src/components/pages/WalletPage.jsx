import React, { useState, useMemo, useEffect } from 'react';
import { useStore } from '../../store';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 2 }).format(Math.max(0, n || 0));

const WalletPage = () => {
  const { walletTransactions, loadWalletTransactions, addWalletTransaction } = useStore();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [showSendMoneyModal, setShowSendMoneyModal] = useState(false);
  const [showAddFundsModal, setShowAddFundsModal] = useState(false);

  // Load wallet transactions on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await loadWalletTransactions();
      setIsLoading(false);
    };
    loadData();
  }, [loadWalletTransactions]);

  // Calculate balance from transactions
  const balance = useMemo(() => {
    return walletTransactions.reduce((acc, txn) => {
      if (txn.type === 'credit' || txn.type === 'deposit') {
        return acc + (txn.amount || 0);
      } else if (txn.type === 'debit' || txn.type === 'withdrawal' || txn.type === 'payment') {
        return acc - (txn.amount || 0);
      }
      return acc;
    }, 0);
  }, [walletTransactions]);

  // Filter transactions by tab
  const filteredTransactions = useMemo(() => {
    if (activeTab === 'all') return walletTransactions;
    if (activeTab === 'completed') return walletTransactions.filter(t => t.status === 'completed');
    if (activeTab === 'pending') return walletTransactions.filter(t => t.status === 'pending');
    if (activeTab === 'cancelled') return walletTransactions.filter(t => t.status === 'cancelled');
    return walletTransactions;
  }, [walletTransactions, activeTab]);

  const handleSendMoney = async (data) => {
    try {
      await addWalletTransaction({
        type: 'payment',
        amount: data.amount,
        recipient_name: data.recipientName,
        description: `Payment to ${data.recipientName}`,
        status: 'completed',
        fee: 3.00
      });
      setShowSendMoneyModal(false);
    } catch (error) {
      console.error('Error sending money:', error);
      alert('Failed to send money. Please try again.');
    }
  };

  const handleAddFunds = async (data) => {
    try {
      await addWalletTransaction({
        type: 'deposit',
        amount: data.amount,
        description: 'Wallet top-up',
        status: 'completed',
        fee: 0
      });
      setShowAddFundsModal(false);
    } catch (error) {
      console.error('Error adding funds:', error);
      alert('Failed to add funds. Please try again.');
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      <div className="max-w-4xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Wallet</h1>
          <button className="p-2 hover:bg-white/50 rounded-lg transition-colors">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>

        {/* Balance Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-sm text-gray-600 mb-1">Balance</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500">$</span>
                <button className="text-xs text-gray-400 hover:text-gray-600">•••</button>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Manage recipients
              </button>
              <button className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Auto-deposit
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-600 mb-2">Available to Spend</div>
            <div className="text-4xl font-bold text-gray-900">{currencyKES(balance)}</div>
          </div>

          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium underline">
            Show account info
          </button>

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowSendMoneyModal(true)}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
              </svg>
              Send money
            </button>
            <button
              onClick={() => setShowAddFundsModal(true)}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add funds
            </button>
          </div>
        </div>

        {/* Wallet Transactions */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Wallet Transactions</h2>
          </div>

          {/* Tabs */}
          <div className="flex items-center gap-6 px-6 pt-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('all')}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'all'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              All transactions
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'completed'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Completed
            </button>
            <button
              onClick={() => setActiveTab('pending')}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'pending'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Pending
            </button>
            <button
              onClick={() => setActiveTab('cancelled')}
              className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
                activeTab === 'cancelled'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Cancelled
            </button>
          </div>

          {/* Transactions List */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-12 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
                <p className="text-sm text-gray-500 mt-3">Loading transactions...</p>
              </div>
            ) : filteredTransactions.length === 0 ? (
              <div className="p-12 text-center">
                <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-gray-600 font-medium">No transactions yet</p>
                <p className="text-sm text-gray-500 mt-1">Your wallet transactions will appear here</p>
              </div>
            ) : (
              filteredTransactions.map((txn) => (
                <div key={txn.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-emerald-700">
                        {txn.recipient_name ? txn.recipient_name.charAt(0).toUpperCase() : 'T'}
                      </span>
                    </div>
                    <div className={`w-3 h-3 rounded-full mt-1 ml-auto border-2 border-white ${
                      txn.status === 'completed' ? 'bg-green-500' : 
                      txn.status === 'pending' ? 'bg-yellow-500' : 
                      'bg-gray-400'
                    }`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900">
                      {txn.recipient_name || txn.description || 'Transaction'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(txn.created_at).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-semibold ${
                      txn.type === 'credit' || txn.type === 'deposit' ? 'text-green-600' : 'text-gray-900'
                    }`}>
                      {txn.type === 'credit' || txn.type === 'deposit' ? '+' : ''}{currencyKES(txn.amount)}
                    </div>
                    {txn.fee > 0 && (
                      <div className="text-sm text-gray-500">{currencyKES(txn.fee)} fee</div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Send Money Modal */}
      {showSendMoneyModal && (
        <SendMoneyModal 
          onClose={() => setShowSendMoneyModal(false)}
          onSubmit={handleSendMoney}
        />
      )}

      {/* Add Funds Modal */}
      {showAddFundsModal && (
        <AddFundsModal 
          onClose={() => setShowAddFundsModal(false)}
          onSubmit={handleAddFunds}
        />
      )}
    </div>
  );
};

// Send Money Modal Component
const SendMoneyModal = ({ onClose, onSubmit }) => {
  const [recipientName, setRecipientName] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!recipientName || !amount || parseFloat(amount) <= 0) {
      alert('Please fill in all fields with valid values');
      return;
    }
    onSubmit({
      recipientName,
      amount: parseFloat(amount)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Send Money</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Name</label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Enter recipient name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          <div className="text-sm text-gray-500">
            Transaction fee: KES 3.00
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Send Money
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Add Funds Modal Component
const AddFundsModal = ({ onClose, onSubmit }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }
    onSubmit({
      amount: parseFloat(amount)
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">Add Funds</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount (KES)</label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="0.00"
              required
            />
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3">
            <p className="text-sm text-emerald-800">
              Funds will be added to your wallet immediately via M-Pesa
            </p>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Add Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalletPage;
