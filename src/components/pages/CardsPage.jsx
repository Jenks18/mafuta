import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '../../store';
import AddCardModal from '../modals/AddCardModal';

const CardsPage = () => {
  const { cards = [], drivers = [], vehicles = [], isLoadingCards, loadCards, loadDrivers, loadVehicles } = useStore();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedDriver, setSelectedDriver] = useState('all');
  const [selectedVehicle, setSelectedVehicle] = useState('all');

  // Load cards, drivers, and vehicles on mount
  useEffect(() => {
    loadCards();
    loadDrivers();
    loadVehicles();
  }, [loadCards, loadDrivers, loadVehicles]);

  const handleCardAdded = () => {
    loadCards(); // Refresh the list
  };

  const filteredCards = useMemo(() => {
    return cards.filter(card => {
      const matchesSearch = searchTerm === '' || 
        card.card_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        card.last_four?.includes(searchTerm);
      
      const matchesTab = activeTab === 'all' || 
        (activeTab === 'active' && card.status === 'active') ||
        (activeTab === 'inactive' && card.status === 'inactive') ||
        (activeTab === 'pending' && card.status === 'pending');
      
      const matchesDriver = selectedDriver === 'all' || card.assigned_driver_id === selectedDriver;
      const matchesVehicle = selectedVehicle === 'all' || card.assigned_vehicle_id === selectedVehicle;
      
      return matchesSearch && matchesTab && matchesDriver && matchesVehicle;
    });
  }, [cards, searchTerm, activeTab, selectedDriver, selectedVehicle]);

  const stats = useMemo(() => {
    return {
      total: cards.length,
      active: cards.filter(c => c.status === 'active').length,
      inactive: cards.filter(c => c.status === 'inactive').length,
      pending: cards.filter(c => c.status === 'pending').length,
    };
  }, [cards]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'in delivery':
        return 'bg-yellow-100 text-yellow-800';
      case 'blocked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
      <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fuel Cards</h1>
          <p className="text-sm text-gray-600 mt-1">Manage your fleet fuel cards and spending</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-1">Total Cards</div>
            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-1">Active</div>
            <div className="text-3xl font-bold text-green-600">{stats.active}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-1">Inactive</div>
            <div className="text-3xl font-bold text-red-600">{stats.inactive}</div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="text-sm text-gray-600 mb-1">Pending</div>
            <div className="text-3xl font-bold text-orange-600">{stats.pending}</div>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Search by card number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors">
              <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Edit Policy
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Order Cards
            </button>
          </div>
        </div>


        {/* Cards Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Table Header with Tabs */}
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Fuel Cards</h2>
            
            {/* Tabs */}
            <div className="flex items-center gap-6 -mb-4">
              <button
                onClick={() => setActiveTab('all')}
                className={`pb-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'all'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                All cards ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab('active')}
                className={`pb-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'active'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Active ({stats.active})
              </button>
              <button
                onClick={() => setActiveTab('inactive')}
                className={`pb-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'inactive'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Inactive ({stats.inactive})
              </button>
              <button
                onClick={() => setActiveTab('pending')}
                className={`pb-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'pending'
                    ? 'border-emerald-600 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                Pending ({stats.pending})
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 px-6 py-3 bg-gray-50 border-b border-gray-200">
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="all">All Drivers</option>
              {drivers.map(driver => (
                <option key={driver.id} value={driver.id}>{driver.name}</option>
              ))}
            </select>
            
            <select
              value={selectedVehicle}
              onChange={(e) => setSelectedVehicle(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white"
            >
              <option value="all">All Vehicles</option>
              {vehicles.map(vehicle => (
                <option key={vehicle.id} value={vehicle.id}>
                  {vehicle.make} {vehicle.model} - {vehicle.license_plate}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {isLoadingCards ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-3"></div>
                  <p className="text-sm text-gray-500">Loading cards...</p>
                </div>
              </div>
            ) : filteredCards.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="flex flex-col items-center justify-center">
                  <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  <p className="text-gray-600 font-medium mb-2">No cards found</p>
                  <p className="text-sm text-gray-500 mb-4">
                    {searchTerm || selectedDriver !== 'all' || selectedVehicle !== 'all' 
                      ? 'Try adjusting your filters' 
                      : 'Order your first fuel card to get started'}
                  </p>
                  {!searchTerm && selectedDriver === 'all' && selectedVehicle === 'all' && (
                    <button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Order Cards
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredCards.map((card) => (
                  <div key={card.id} className="p-4 hover:bg-gray-50">
                    {/* Card Number & Status */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span className="text-sm font-medium text-gray-900 font-mono">
                          {card.card_number || `****${card.last_four}` || '9876'}
                        </span>
                      </div>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                        {card.status?.charAt(0).toUpperCase() + card.status?.slice(1) || 'Active'}
                      </span>
                    </div>

                    {/* Card Type */}
                    <div className="text-xs text-gray-500 mb-3">
                      {card.card_type === 'physical' ? 'Physical card' : 'Virtual card'}
                    </div>

                    {/* Driver */}
                    <div className="flex items-center justify-between mb-2 pb-2 border-t border-gray-100 pt-2">
                      <span className="text-xs text-gray-500">Driver</span>
                      {card.driver ? (
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center">
                            <span className="text-emerald-700 font-semibold text-xs">
                              {card.driver.name?.charAt(0).toUpperCase() || 'JD'}
                            </span>
                          </div>
                          <span className="text-sm text-gray-900">{card.driver.name}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </div>

                    {/* Vehicle */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Vehicle</span>
                      {card.vehicle ? (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          <span className="text-sm text-gray-900">
                            {card.vehicle.color} {card.vehicle.make} {card.vehicle.license_plate}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">Unassigned</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile Footer */}
            {filteredCards.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold text-gray-900">{filteredCards.length}</span> of <span className="font-semibold text-gray-900">{cards.length}</span> cards
                </div>
              </div>
            )}
          </div>

          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Card Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Card Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Driver
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Vehicle
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoadingCards ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600 mb-3"></div>
                        <p className="text-sm text-gray-500">Loading cards...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredCards.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <p className="text-gray-600 font-medium mb-2">No cards found</p>
                        <p className="text-sm text-gray-500 mb-4">
                          {searchTerm || selectedDriver !== 'all' || selectedVehicle !== 'all' 
                            ? 'Try adjusting your filters' 
                            : 'Order your first fuel card to get started'}
                        </p>
                        {!searchTerm && selectedDriver === 'all' && selectedVehicle === 'all' && (
                          <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                          >
                            Order Cards
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredCards.map((card) => (
                    <tr key={card.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                          <span className="text-sm font-medium text-gray-900 font-mono">
                            {card.card_number || `****${card.last_four}` || '9876'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(card.status)}`}>
                          {card.status?.charAt(0).toUpperCase() + card.status?.slice(1) || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {card.card_type === 'physical' ? 'Physical card' : 'Virtual card'}
                      </td>
                      <td className="px-6 py-4">
                        {card.driver ? (
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-emerald-700 font-semibold text-xs">
                                {card.driver.name?.charAt(0).toUpperCase() || 'JD'}
                              </span>
                            </div>
                            <span className="text-sm text-gray-900">{card.driver.name}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {card.vehicle ? (
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                            </svg>
                            <span className="text-sm text-gray-900">
                              {card.vehicle.color} {card.vehicle.make} {card.vehicle.license_plate}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Desktop Footer */}
          {filteredCards.length > 0 && (
            <div className="hidden md:block px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="text-sm text-gray-600">
                Showing <span className="font-semibold text-gray-900">{filteredCards.length}</span> of <span className="font-semibold text-gray-900">{cards.length}</span> cards
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Card Modal */}
      <AddCardModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleCardAdded}
      />
    </div>
  );
};

export default CardsPage;
