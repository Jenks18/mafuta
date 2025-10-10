import React from 'react';

const ClaimSuccessToast = ({ show, position = 'desktop' }) => {
  if (!show) return null;

  const baseClasses = "fixed z-50 bg-emerald-600 text-white px-6 py-4 rounded-xl shadow-2xl";
  const positionClasses = position === 'desktop' 
    ? "top-24 right-6 animate-slide-in-right"
    : "top-20 left-1/2 transform -translate-x-1/2 animate-bounce";

  return (
    <div className={`${baseClasses} ${positionClasses}`}>
      <div className="flex items-center gap-3">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold">Offer claimed successfully!</span>
      </div>
    </div>
  );
};

export default ClaimSuccessToast;
