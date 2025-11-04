import React, { useEffect, useState } from 'react';
import MorePageMobile from './MorePageMobile';

const MorePage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024); // Use lg breakpoint (1024px)
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);

    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  // More page is only for mobile/tablet - desktop users use the sidebar
  if (!isMobile) {
    return (
      <div className="h-full flex items-center justify-center bg-gradient-to-br from-emerald-50 via-green-50 to-emerald-100">
        <div className="text-center p-8">
          <div className="text-6xl mb-4">👈</div>
          <h2 className="text-2xl font-bold text-emerald-700 mb-2">Use the Sidebar</h2>
          <p className="text-emerald-600">All features are available in the sidebar on desktop</p>
        </div>
      </div>
    );
  }

  return <MorePageMobile />;
};

export default MorePage;

