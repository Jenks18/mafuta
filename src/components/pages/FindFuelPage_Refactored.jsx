import React, { useState, useEffect } from 'react';
import FindFuelDesktop from './FindFuel/FindFuelDesktop';
import FindFuelMobile from './FindFuel/FindFuelMobile';
import StationDetailPage from './StationDetailPage';
import ClaimSuccessToast from './FindFuel/ClaimSuccessToast';

const FindFuelPage = () => {
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  const [showStationDetail, setShowStationDetail] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

  // Handle window resize for responsive layout
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMoreInfo = (stationId) => {
    setSelectedStationId(stationId);
    setShowStationDetail(true);
  };

  const handleBackToMap = () => {
    setShowStationDetail(false);
    setSelectedStationId(null);
  };

  const handleClaim = () => {
    setShowClaimSuccess(true);
    setTimeout(() => setShowClaimSuccess(false), 3000);
  };

  // If showing station detail, render that instead
  if (showStationDetail && selectedStationId) {
    return <StationDetailPage stationId={selectedStationId} onBack={handleBackToMap} />;
  }

  return (
    <>
      {isDesktop ? (
        <FindFuelDesktop 
          onStationDetail={handleMoreInfo}
          onClaim={handleClaim}
        />
      ) : (
        <FindFuelMobile 
          onStationDetail={handleMoreInfo}
          onClaim={handleClaim}
        />
      )}
      
      <ClaimSuccessToast 
        show={showClaimSuccess} 
        position={isDesktop ? 'desktop' : 'mobile'}
      />
    </>
  );
};

export default FindFuelPage;
