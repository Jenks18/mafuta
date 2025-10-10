import React from 'react';

const currencyKES = (n) => new Intl.NumberFormat('en-KE', { style: 'currency', currency: 'KES', maximumFractionDigits: 0 }).format(n);

const FuelBalanceCard = () => {
  const balance = 475000; // KES placeholder
  const card = {
    last4: '1234',
    holder: 'Mafuta Fleet',
    brand: 'Shell Kenya',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-5">
      <div className="w-16 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-semibold">
        KES
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-gray-500">Fuel card balance</div>
            <div className="text-xl font-bold text-gray-900">{currencyKES(balance)}</div>
          </div>
          <button className="px-3 py-2 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg hover:bg-emerald-100">Top up</button>
        </div>
        <div className="mt-3 text-xs text-gray-500">
          {card.brand} • {card.holder} • •••• {card.last4}
        </div>
      </div>
    </div>
  );
};

export default FuelBalanceCard;
