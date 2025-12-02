import React, { useState } from 'react';
import ReceiptCaptureModal from './modals/ReceiptCaptureModal';

const TransactionForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    desc: '',
    amount: '',
    receiptImageUrl: null,
    ocrData: null,
    ocrConfidence: null,
    ocrStatus: 'manual',
  });
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleReceiptProcessed = (receiptData) => {
    // Auto-fill form with OCR data
    const newFormData = {
      ...formData,
      receiptImageUrl: receiptData.receiptImageUrl,
      ocrData: receiptData.ocrData,
      ocrConfidence: receiptData.ocrConfidence,
      ocrStatus: receiptData.ocrStatus,
    };

    // Pre-fill fields if OCR extracted them
    if (receiptData.ocrData.amount) {
      newFormData.amount = receiptData.ocrData.amount.toString();
    }
    if (receiptData.ocrData.date) {
      // Try to convert to YYYY-MM-DD format
      try {
        const parsedDate = new Date(receiptData.ocrData.date);
        if (!isNaN(parsedDate)) {
          newFormData.date = parsedDate.toISOString().split('T')[0];
        }
      } catch (e) {
        console.warn('Could not parse OCR date');
      }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Add New Transaction</h2>
        <button
          type="button"
          onClick={() => setShowReceiptModal(true)}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-2 text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          Scan Receipt
        </button>
      </div>

      {/* Receipt Preview */}
      {formData.receiptImageUrl && (
        <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
          <div className="flex items-start gap-3">
            <img
              src={formData.receiptImageUrl}
              alt="Receipt"
              className="w-20 h-20 object-cover rounded border border-emerald-300"
            />
            <div className="flex-1">
              <p className="text-sm font-semibold text-emerald-800 mb-1">
                ✓ Receipt Captured
              </p>
              {formData.ocrConfidence && (
                <p className="text-xs text-emerald-700">
                  OCR Confidence: {formData.ocrConfidence}%
                </p>
              )}
              {formData.ocrData?.validation?.requiresManualReview && (
                <p className="text-xs text-yellow-700 mt-1">
                  ⚠️ Please verify extracted details
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => setFormData({ 
                ...formData, 
                receiptImageUrl: null, 
                ocrData: null,
                ocrConfidence: null 
              })}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Add Transaction
        </button>
      </form>

      {/* Receipt Capture Modal */}
      <ReceiptCaptureModal
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
        onReceiptProcessed={handleReceiptProcessed}
      />
    </div>
  );
};

export default TransactionForm;
    if (formData.desc && formData.amount) {
      onAdd({
        id: Date.now(),
        date: formData.date,
        desc: formData.desc,
        amount: parseFloat(formData.amount),
        receipt_image_url: formData.receiptImageUrl,
        ocr_data: formData.ocrData,
        ocr_confidence: formData.ocrConfidence,
        ocr_status: formData.ocrStatus || 'manual',
        manual_review_required: formData.ocrData?.validation?.requiresManualReview || false,
      });
      setFormData({
        date: new Date().toISOString().split('T')[0],
        desc: '',
        amount: '',
        receiptImageUrl: null,
        ocrData: null,
        ocrConfidence: null,
        ocrStatus: 'manual',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Add New Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="desc" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              id="desc"
              name="desc"
              value={formData.desc}
              onChange={handleChange}
              placeholder="Transaction description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors"
        >
          Add Transaction
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;
