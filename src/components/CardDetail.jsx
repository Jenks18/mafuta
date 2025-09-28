import React from 'react';

const CardDetail = ({ card, onToggle, onRemove }) => {
  if (!card) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="text-center py-8 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 10H3m18 0a2 2 0 012 2v6a2 2 0 01-2 2H3a2 2 0 01-2-2v-6a2 2 0 012-2m18 0V7a2 2 0 00-2-2H5a2 2 0 00-2 2v3" />
          </svg>
          <p>Select a card to view details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Card Details</h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${
          card.status === 'ACTIVE' 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
        }`}>
          {card.status}
        </span>
      </div>

      {/* Card Visual */}
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl p-6 text-white mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-emerald-100 text-sm">Fuel Card</p>
            <p className="text-2xl font-bold">{card.id}</p>
          </div>
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex justify-between items-end">
          <div>
            <p className="text-emerald-100 text-sm">Assigned to</p>
            <p className="font-semibold">{card.assignedTo}</p>
          </div>
          <div className="text-right">
            <p className="text-emerald-100 text-sm">Valid thru</p>
            <p className="font-semibold">12/27</p>
          </div>
        </div>
      </div>

      {/* Card Information */}
      <div className="space-y-4 mb-6">
        <div className="flex justify-between">
          <span className="text-gray-600">Card Number:</span>
          <span className="font-mono font-medium text-gray-900">{card.id}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Status:</span>
          <span className="font-medium text-gray-900">{card.status}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Assigned to:</span>
          <span className="font-medium text-gray-900">{card.assignedTo}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Daily Limit:</span>
          <span className="font-medium text-gray-900">$200.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Monthly Spend:</span>
          <span className="font-medium text-gray-900">$1,245.67</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button 
          onClick={() => onToggle && onToggle(card.id)}
          className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${
            card.status === 'ACTIVE'
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              : 'bg-green-100 text-green-700 hover:bg-green-200'
          }`}
        >
          {card.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
        </button>
        <button 
          onClick={() => onRemove && onRemove(card.id)}
          className="flex-1 py-2 px-4 rounded-lg font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
        >
          Remove
        </button>
      </div>

      {/* Recent Transactions */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Recent Transactions</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shell Downtown</span>
            <span className="font-medium text-gray-900">$45.67</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">BP Highway</span>
            <span className="font-medium text-gray-900">$52.34</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Chevron Main</span>
            <span className="font-medium text-gray-900">$38.92</span>
          </div>
        </div>
        <button className="w-full mt-3 text-emerald-600 hover:text-emerald-700 text-sm font-medium">
          View All Transactions
        </button>
      </div>
    </div>
  );
};

export default CardDetail;
