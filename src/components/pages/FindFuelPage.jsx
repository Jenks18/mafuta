import React, { useState, useEffect, lazy, Suspense } from 'react';
import FindFuelDesktop from './FindFuel/FindFuelDesktop';
import FindFuelMobile from './FindFuel/FindFuelMobile';
import ClaimSuccessToast from './FindFuel/ClaimSuccessToast';
import { useSupabaseStations } from '../../hooks/useSupabaseStations';
import { useStore } from '../../store';

const StationDetailPage = lazy(() => import('./StationDetailPage'));

const FindFuelPage = () => {
  const [isDesktop, setIsDesktop] = useState(typeof window !== 'undefined' ? window.innerWidth >= 1024 : true);
  const [showStationDetail, setShowStationDetail] = useState(false);
  const [selectedStationId, setSelectedStationId] = useState(null);
  const [showClaimSuccess, setShowClaimSuccess] = useState(false);

  // Handle window resize for responsive layout
  useEffect(() => {
  const handleResize = () => setIsDesktop(window.innerWidth >= 1024);

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

  // Load stations from Supabase (shell table) on page mount
  const { loading, error } = useSupabaseStations();
  const loadLocalShellStations = useStore((s) => s.loadLocalShellStations);

  useEffect(() => {
    // As a fallback (e.g., no Supabase), load local stations lazily once
    loadLocalShellStations();
  }, [loadLocalShellStations]);

  // If showing station detail, render that instead
  if (showStationDetail && selectedStationId) {
    return (
      <Suspense fallback={<div className="flex-1 flex items-center justify-center text-gray-500">Loading station…</div>}>
        <StationDetailPage stationId={selectedStationId} onBack={handleBackToMap} />
      </Suspense>
    );
  }

  return (
    <div className="flex-1 min-h-screen flex flex-col relative">
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
    </div>
  );
};

export default FindFuelPage;
