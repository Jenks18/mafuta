import React, { useState } from 'react';
import { useStore } from '../../store';

const AddCardModal = ({ isOpen, onClose, onSuccess }) => {
  const { drivers = [], vehicles = [], addCard } = useStore();
  const [formData, setFormData] = useState({
    card_type: 'physical',
    assigned_driver_id: '',
    assigned_vehicle_id: '',
    spending_limit: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await addCard({
        ...formData,
        status: 'pending',
        spending_limit: formData.spending_limit ? parseFloat(formData.spending_limit) : null
      });
      
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        card_type: 'physical',
        assigned_driver_id: '',
        assigned_vehicle_id: '',
        spending_limit: '',
        notes: ''
      });
    } catch (error) {
      console.error('Error adding card:', error);
      alert('Failed to order card. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Order Fuel Card</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Card Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Card Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, card_type: 'physical' })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.card_type === 'physical'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-900">Physical Card</div>
                    <div className="text-xs text-gray-500">Delivered in 5-7 days</div>
                  </div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, card_type: 'virtual' })}
                className={`p-4 border-2 rounded-lg text-left transition-all ${
                  formData.card_type === 'virtual'
                    ? 'border-emerald-600 bg-emerald-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <div className="font-semibold text-gray-900">Virtual Card</div>
                    <div className="text-xs text-gray-500">Instant digital card</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Assign to Driver */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Driver (Optional)
            </label>
            <select
              value={formData.assigned_driver_id}
              onChange={(e) => setFormData({ ...formData, assigned_driver_id: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select a driver...</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>
                  {driver.name} - {driver.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Assign to Vehicle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign to Vehicle (Optional)
            </label>
            <select
              value={formData.assigned_vehicle_id}
              onChange={(e) => setFormData({ ...formData, assigned_vehicle_id: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            >
              <option value="">Select a vehicle...</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.license_plate}
                </option>
              ))}
            </select>
          </div>

          {/* Spending Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Daily Spending Limit (KES)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.spending_limit}
              onChange={(e) => setFormData({ ...formData, spending_limit: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="e.g., 5000.00"
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Add any special instructions or notes..."
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Ordering...' : 'Order Card'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCardModal;
