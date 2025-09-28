import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import FloatingBackground from '../common/FloatingBackground';

const Layout = ({ children, activeTab, setActiveTab }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <>
      {/* Floating Background - applies to entire app */}
      <FloatingBackground />
      
      <div className="min-h-screen flex bg-white">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        )}

        {/* Main Content - matches original App.jsx structure */}
        <main className={`flex-1 flex flex-col ${isMobile ? 'pb-16' : ''}`}>
          {children}
        </main>
      </div>

      {/* Mobile Navigation - fixed positioned */}
      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
};

export default Layout;
