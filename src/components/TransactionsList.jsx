import React from 'react';
import { useStore } from '../store';

const TransactionsList = ({ onTransactionSelect }) => {
  const { transactions, formatCurrency } = useStore();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {transactions.map((transaction) => (
          <div 
            key={transaction.id}
            className="p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => onTransactionSelect && onTransactionSelect(transaction)}
          >
            <div className="flex items-center gap-3">
              {/* Receipt Thumbnail */}
              {transaction.receipt_image_url && (
                <div className="flex-shrink-0">
                  <img
                    src={transaction.receipt_image_url}
                    alt="Receipt"
                    className="w-12 h-12 object-cover rounded border border-gray-200"
                  />
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{transaction.desc}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-500">{transaction.date}</p>
                      {transaction.ocr_confidence && (
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          transaction.ocr_confidence >= 80 ? 'bg-emerald-100 text-emerald-700' :
                          transaction.ocr_confidence >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {transaction.ocr_confidence}% OCR
                        </span>
                      )}
                      {transaction.manual_review_required && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-700">
                          ⚠️ Review
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="font-semibold text-gray-900">{formatCurrency(transaction.amount)}</p>
                    <p className="text-sm text-emerald-600">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {transactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No transactions found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsList;
