import React from 'react';

const HomePage = () => (
  <div className="flex-1 overflow-y-auto">
    {/* Content Container with gradient background */}
    <div className="relative z-10 bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100 min-h-full">
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-3xl">M</span>
          </div>
          <h1 className="text-3xl font-bold text-emerald-700 mb-2">Welcome to MafutaPass</h1>
          <p className="text-gray-600 mb-4">Your all-in-one fuel management platform</p>
        </div>
      </div>
    </div>
  </div>
);

export default HomePage;
