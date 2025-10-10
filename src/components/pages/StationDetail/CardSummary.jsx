import React from 'react';

const CardSummary = ({ card }) => {
  if (!card) return null;
  const isActive = card.status === 'ACTIVE';
  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Card Details</h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-700'}`}>{isActive ? 'ACTIVE' : 'INACTIVE'}</span>
      </div>
      <div className="bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-6 text-white mb-5 relative overflow-hidden">
        <div className="text-sm text-emerald-100">Fuel Card</div>
        <div className="text-3xl font-bold tracking-wide">{card.id}</div>
        {/* Top-right icon block */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
            <path fillRule="evenodd" d="M10 2L3 7v11a2 2 0 002 2h10a2 2 0 002-2V7l-7-5z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="mt-4 flex items-end justify-between">
          <div>
            <div className="text-sm text-emerald-100">Assigned to</div>
            <div className="text-lg font-semibold">{card.assignedTo}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-emerald-100">Valid thru</div>
            <div className="text-lg font-semibold">12/27</div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Card Number:</span><span className="font-mono font-medium text-gray-900">{card.id}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Status:</span><span className="font-medium text-gray-900">{card.status}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Assigned to:</span><span className="font-medium text-gray-900">{card.assignedTo}</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Daily Limit:</span><span className="font-medium text-gray-900">$200.00</span></div>
        <div className="flex items-center justify-between text-sm"><span className="text-gray-600">Monthly Spend:</span><span className="font-medium text-gray-900">$1,245.67</span></div>
      </div>
    </div>
  );
};

export default CardSummary;
