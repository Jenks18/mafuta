import React, { useState } from 'react';
import { useStore } from '../../store';

const StationDetailPage = ({ stationId, onBack }) => {
  const { fuelStations } = useStore();
  const [selectedFuelType, setSelectedFuelType] = useState('Regular');
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);
  
  // Find the station by ID
  const station = fuelStations.find(s => s.id === parseInt(stationId)) || fuelStations[0];

  const handleClaim = () => {
    setShowClaimSuccess(true);
    setTimeout(() => {
      setShowClaimSuccess(false);
      // Navigate back after showing success
      setTimeout(() => onBack(), 500);
    }, 2000);
  };
  
  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-6 border-b border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-800 mb-2">{station.name}</h1>
        <p className="text-gray-600 mb-2">{station.address}</p>
        <p className="text-gray-600">
          {station.distance} • <span className="text-emerald-600 font-medium">Open</span>
        </p>
        
        <button className="mt-4 bg-gray-800 text-white px-6 py-3 rounded-xl font-medium">
          Directions
        </button>
      </div>

      {/* Map Section */}
      <div className="h-48 bg-gradient-to-br from-green-100 via-emerald-50 to-green-200 relative">
        {/* Simulated map with route */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-gray-400"></div>
          <div className="absolute top-2/3 left-0 right-0 h-0.5 bg-gray-400"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-0.5 bg-gray-400"></div>
        </div>
        
        {/* Current location */}
        <div className="absolute bottom-6 left-6">
          <div className="w-4 h-4 bg-blue-600 rounded-full border-4 border-white shadow-lg"></div>
        </div>
        
        {/* Route line */}
        <div className="absolute bottom-6 left-6 w-32 h-0.5 bg-blue-600 transform rotate-45 origin-left"></div>
        
        {/* Station location */}
        <div className="absolute top-6 right-6">
          <div className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
            {station.distance}
          </div>
        </div>
        
        {/* Google watermark */}
        <div className="absolute bottom-2 left-2">
          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">Google</span>
        </div>
      </div>

      {/* Fuel Offers Section */}
      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-800">Your gas offers</h2>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        </div>

        {/* Fuel type cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {station.offers?.map((offer, index) => (
            <div 
              key={offer.type}
              onClick={() => setSelectedFuelType(offer.type)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedFuelType === offer.type 
                  ? 'border-emerald-500 bg-emerald-50' 
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <h3 className="font-semibold text-gray-800 text-sm mb-1">{offer.type}</h3>
              <div className="flex items-center gap-1">
                <span className="text-lg font-bold text-gray-800">${offer.price}</span>
                <span className="text-sm text-gray-400 line-through">${offer.originalPrice}</span>
              </div>
              <div className="text-emerald-600 font-semibold text-sm mt-1">
                {offer.cashback}¢/gal
              </div>
            </div>
          ))}
        </div>

        {/* How to earn cash back */}
        <div className="bg-gray-50 rounded-2xl p-4 mb-6">
          <button className="w-full flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">How to earn cash back</h3>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div className="mt-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Claim an offer</h4>
                <p className="text-sm text-gray-600">Offer valid at this location only</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                2
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Choose how to earn</h4>
                <p className="text-sm text-gray-600">Select how to earn cash back and make your purchase</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional offers */}
        {station.extraOffer && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 mb-6">
            <h3 className="font-semibold text-emerald-800 mb-1">Bonus Offer</h3>
            <p className="text-emerald-700">{station.extraOffer}</p>
          </div>
        )}

        {/* Claim button */}
        <button 
          onClick={handleClaim}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl text-lg transition-colors"
        >
          Claim {selectedFuelType} • {station.offers?.find(o => o.type === selectedFuelType)?.cashback || station.cashback}¢/gal
        </button>
      </div>

      {/* Claim Success Modal/Toast */}
      {showClaimSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 mx-4 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Offer Claimed!</h3>
            <p className="text-gray-600 mb-4">
              You've successfully claimed {station.offers?.find(o => o.type === selectedFuelType)?.cashback || station.cashback}¢/gal cash back on {selectedFuelType} at {station.name}.
            </p>
            <p className="text-sm text-gray-500">Returning to map...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StationDetailPage;