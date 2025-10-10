import React from 'react';

const maskId = (id) => (id ? `•••• ${String(id).slice(-4)}` : '•••• 0000');

const DigitalCard = ({ card, className = '', size = 'default' }) => {
  if (!card) return null;
  const isCompact = size === 'compact';
  return (
    <div className={`rounded-2xl ${isCompact ? 'p-4' : 'p-5'} bg-gradient-to-br from-emerald-600 via-emerald-500 to-green-500 text-white shadow-xl ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-emerald-100 tracking-widest uppercase">Fuel Card</div>
          <div className={`${isCompact ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'} font-bold mt-1`}>{maskId(card.id)}</div>
        </div>
        <div className={`${isCompact ? 'w-10 h-10' : 'w-12 h-12'} rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center`}>
          <svg className={`${isCompact ? 'w-5 h-5' : 'w-6 h-6'} text-white`} viewBox="0 0 24 24" fill="currentColor"><path d="M3 7h18v4H3zM3 13h18v4H3z"/></svg>
        </div>
      </div>
      <div className={`${isCompact ? 'mt-4' : 'mt-6'} flex items-end justify-between`}>
        <div>
          <div className="text-xs text-emerald-100">Cardholder</div>
          <div className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold`}>{card.assignedTo || 'Unassigned'}</div>
        </div>
        <div className="text-right">
          <div className="text-xs text-emerald-100">Valid Thru</div>
          <div className={`${isCompact ? 'text-base' : 'text-lg'} font-semibold`}>12/27</div>
        </div>
      </div>
    </div>
  );
};

export default DigitalCard;
