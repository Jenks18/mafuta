import React from 'react';

const maskId = (id) => (id ? `•••• ${String(id).slice(-4)}` : '•••• 0000');
const formattedMaskedNumber = (id) => {
  const last4 = String(id || '').slice(-4) || '0000';
  // Render as 4 groups like a real card number
  return `•••• •••• •••• ${last4}`;
};

const DigitalCardBase = ({ card, className = '', size = 'default' }) => {
  if (!card) return null;
  const isCompact = size === 'compact';
  const isReal = size === 'real';

  if (isReal) {
    // Realistic credit card ratio and layout
    return (
      <div className={`w-full max-w-[380px] aspect-[85/54] relative rounded-2xl overflow-hidden shadow-2xl ${className}`}>
        {/* Background gradient and subtle textures */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-700 via-emerald-600 to-green-500" />
        {/* Soft radial glow */}
        <div className="absolute -top-10 -right-10 w-44 h-44 rounded-full bg-white/10 blur-2xl" />
        {/* Glass highlight */}
        <div className="absolute inset-x-0 top-0 h-14 bg-white/10" style={{ WebkitMaskImage: 'linear-gradient(to bottom, black, transparent)' }} />

        {/* Content */}
        <div className="absolute inset-0 text-white flex flex-col justify-between p-5">
          {/* Top row */}
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] tracking-[0.2em] uppercase text-emerald-100">Fuel Card</div>
            </div>
            {/* EMV chip */}
            <div className="w-12 h-9 rounded-md bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-300 border border-white/50 shadow-inner flex items-center justify-center">
              <div className="w-8 h-6 border border-white/50 rounded-sm" />
            </div>
          </div>

          {/* Middle number */}
          <div className="font-semibold tracking-widest text-2xl md:text-3xl drop-shadow-sm">
            {formattedMaskedNumber(card.id)}
          </div>

          {/* Bottom row */}
          <div className="flex items-end justify-between">
            <div className="min-w-0">
              <div className="text-[10px] text-emerald-100 uppercase">Cardholder</div>
              <div className="text-lg font-semibold truncate">{card.assignedTo || 'Unassigned'}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-emerald-100 uppercase">Valid Thru</div>
              <div className="text-lg font-semibold">12/27</div>
            </div>
          </div>
        </div>

        {/* Network motif (overlapping circles) */}
        <div className="absolute bottom-5 right-5 flex items-center gap-1 opacity-90">
          <span className="inline-block w-5 h-5 rounded-full bg-orange-400/90 mix-blend-screen" />
          <span className="inline-block w-5 h-5 -ml-2 rounded-full bg-red-600/90 mix-blend-screen" />
        </div>
      </div>
    );
  }

  // Default/compact existing design
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

const DigitalCard = React.memo(DigitalCardBase);
DigitalCard.displayName = 'DigitalCard';

export default DigitalCard;
