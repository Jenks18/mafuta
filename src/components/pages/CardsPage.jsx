import React, { useState } from 'react';
import { useStore } from '../../store';
import CardDetail from '../CardDetail';
import CardDetailPage from './cards/CardDetailPage';

const CardsPage = () => {
  const { cards, toggleCardActive, removeCard } = useStore();
  const [selectedCardId, setSelectedCardId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredCards = cards.filter(card => {
    const matchesSearch = card.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'active' && card.status === 'ACTIVE') ||
      (activeFilter === 'inactive' && card.status !== 'ACTIVE');
    return matchesSearch && matchesFilter;
  });

  const handleCardDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      removeCard(id);
    }
  };

  const selectedCard = cards.find(c => c.id === selectedCardId);

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/6 w-32 h-32 bg-gradient-to-r from-emerald-200/30 to-green-200/20 rounded-full blur-2xl"></div>
        <div className="absolute top-3/4 right-1/6 w-48 h-48 bg-gradient-to-r from-green-200/20 to-emerald-200/15 rounded-full blur-2xl"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
        <div className="w-full px-4 md:px-6 lg:px-8 py-6">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <button className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg w-full sm:w-auto">
                Order Cards
              </button>
              
              <div className="relative w-full sm:max-w-sm">
                <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input 
                  type="text" 
                  placeholder="Last 4 digits"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/80 border border-emerald-200/50 rounded-xl text-gray-700 placeholder-emerald-500/70 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-1 bg-white/60 backdrop-blur-sm border border-emerald-200/50 rounded-xl p-1 w-full sm:w-fit">
              <button 
                onClick={() => setActiveFilter('all')}
                className={`flex-1 sm:flex-initial px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeFilter === 'all' 
                    ? 'text-emerald-700 bg-white shadow-sm' 
                    : 'text-emerald-600 hover:bg-white/50'
                }`}
              >
                All Cards
              </button>
              <button 
                onClick={() => setActiveFilter('active')}
                className={`flex-1 sm:flex-initial px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeFilter === 'active' 
                    ? 'text-emerald-700 bg-white shadow-sm' 
                    : 'text-emerald-600 hover:bg-white/50'
                }`}
              >
                Active
              </button>
              <button 
                onClick={() => setActiveFilter('inactive')}
                className={`flex-1 sm:flex-initial px-4 py-2 font-medium rounded-lg transition-colors ${
                  activeFilter === 'inactive' 
                    ? 'text-emerald-700 bg-white shadow-sm' 
                    : 'text-emerald-600 hover:bg-white/50'
                }`}
              >
                Inactive
              </button>
            </div>
          </div>

          {/* Cards Container */}
          {!selectedCardId ? (
          <div className="flex gap-6">
            {/* Cards List */}
            <div className="flex-1">
              <div className="bg-white/80 backdrop-blur-sm border border-emerald-200/50 rounded-2xl shadow-lg overflow-hidden">
                
                {/* Mobile Card View */}
                <div className="md:hidden divide-y divide-emerald-100/50">
                  {filteredCards.map((card) => (
                    <div 
                      key={card.id} 
                      className="p-4 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedCardId(card.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <input type="checkbox" className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500" />
                          <span className="font-mono font-semibold text-gray-900">{card.id}</span>
                        </div>
                        <span className={`inline-block text-xs font-semibold px-2 py-1 rounded-full ${
                          card.status === 'ACTIVE' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {card.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-7 justify-between">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          card.avatar === 'loading' ? 'bg-gray-400' : 'bg-emerald-500'
                        }`}>
                          {card.avatar === 'loading' ? (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-700 text-sm">{card.assignedTo}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block">
                  {/* Table Header */}
                  <div className="bg-emerald-50/80 border-b border-emerald-200/50 px-6 py-4">
                    <div className="grid grid-cols-4 gap-6 text-sm font-semibold text-emerald-700">
                      <div className="flex items-center gap-3">
                        <input type="checkbox" className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500" />
                        <span>Card Number</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Status</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                      </div>
                      <div>Assigned To</div>
                      <div>Actions</div>
                    </div>
                  </div>

                  {/* Table Body */}
                  <div className="divide-y divide-emerald-100/50">
                    {filteredCards.map((card) => (
                      <div 
                        key={card.id} 
                        className="px-6 py-4 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                        onClick={() => setSelectedCardId(card.id)}
                      >
                        <div className="grid grid-cols-4 gap-6 items-center">
                          <div className="flex items-center gap-3">
                            <input type="checkbox" className="w-4 h-4 text-emerald-600 border-emerald-300 rounded focus:ring-emerald-500" />
                            <span className="font-mono text-gray-900 font-medium">{card.id}</span>
                          </div>
                          <div>
                            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full ${
                              card.status === 'ACTIVE' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {card.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              card.avatar === 'loading' ? 'bg-gray-400' : 'bg-emerald-500'
                            }`}>
                              {card.avatar === 'loading' ? (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              ) : (
                                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <span className="text-gray-700 font-medium">{card.assignedTo}</span>
                          </div>
                          <div className="flex gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleCardActive(card.id);
                              }}
                              className="text-blue-600 hover:text-blue-800 text-sm px-2 py-1 rounded border border-blue-300 hover:bg-blue-50 transition-colors"
                            >
                              Toggle
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCardDelete(card.id);
                              }}
                              className="text-red-600 hover:text-red-800 text-sm px-2 py-1 rounded border border-red-300 hover:bg-red-50 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {filteredCards.length === 0 && (
                      <div className="px-6 py-8 text-center text-gray-500">
                        No cards found matching your criteria.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Detail Panel (compact) on large screens only) */}
            {selectedCardId && (
              <div className="hidden lg:block w-80">
                <CardDetail 
                  card={selectedCard} 
                  onToggle={toggleCardActive}
                  onRemove={handleCardDelete}
                />
              </div>
            )}
          </div>
          ) : (
            <CardDetailPage 
              card={selectedCard} 
              onBack={() => setSelectedCardId(null)}
              onToggleStatus={toggleCardActive}
            />
          )}
  </div>
      </div>
    </div>
  );
};

export default CardsPage;
