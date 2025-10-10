import React from 'react';

export const LogoMark = ({ size = 28, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    className={className}
    aria-label="MafutaPass Logo"
  >
    <circle cx="32" cy="32" r="29" fill="#fff" stroke="#111827" strokeWidth="4" />
    {/* Pump */}
    <rect x="18" y="22" width="18" height="18" rx="2.5" fill="#111827" />
    <rect x="21.5" y="26" width="11" height="7" rx="1" fill="#fff" />
    <rect x="23" y="40" width="13" height="4" rx="1.5" fill="#111827" />
    {/* Nozzle */}
    <path d="M39 28c2 0 4 1.5 4 3.5V36c0 2 1.5 3 3 3" fill="none" stroke="#111827" strokeWidth="3" strokeLinecap="round" />
    {/* Check mark */}
    <path d="M24 35l4 4 9-10" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const LogoWordmark = ({ className = '' }) => (
  <div className={`select-none ${className}`} aria-label="MafutaPass">
    <span className="font-semibold text-gray-800 tracking-tight">Mafuta</span>
    <span className="font-semibold text-emerald-600 tracking-tight">Pass</span>
  </div>
);

const Logo = ({ size = 28, showWordmark = true }) => (
  <div className="flex items-center gap-2">
    <LogoMark size={size} />
    {showWordmark && <LogoWordmark />}
  </div>
);

export default Logo;
