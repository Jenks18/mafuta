import React, { startTransition, useEffect } from 'react';
import { mobileNavigation } from '../../config/navigation.jsx';
import { prefetchByKey, prefetchCommonPagesIdle } from '../../utils/pagePrefetch';
import LogoutButton from '../auth/LogoutButton';

const MobileNav = ({ activeTab, setActiveTab }) => {
  useEffect(() => {
    prefetchCommonPagesIdle();
  }, []);
  
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-50 border-t border-emerald-200/50 flex justify-around items-center py-2 z-50 shadow-lg backdrop-blur-sm">
      <div className="absolute inset-0 bg-white/60 pointer-events-none"></div>
      {mobileNavigation.map((item) => (
        <button
          key={item.key}
          onMouseEnter={() => prefetchByKey(item.key)}
          onTouchStart={() => prefetchByKey(item.key)}
          onFocus={() => prefetchByKey(item.key)}
          onClick={() => startTransition(() => setActiveTab(item.key))}
          className={`relative flex flex-col items-center px-2 py-1 rounded-lg transition-all duration-200 ${
            activeTab === item.key 
              ? 'text-emerald-700 bg-white/50 shadow-sm border border-emerald-200/30' 
              : 'text-emerald-600 hover:text-emerald-700 hover:bg-white/30'
          }`}
        >
          {item.icon}
          <span className="text-[11px] font-medium mt-0.5">{item.label}</span>
        </button>
      ))}
      
      {/* Logout Button */}
      <LogoutButton variant="mobile" />
    </nav>
  );
};

export default MobileNav;
