import React, { useState, useRef, useEffect, startTransition } from 'react';
import { sidebarNavigation } from '../../config/navigation.jsx';
import Logo, { LogoMark, LogoWordmark } from '../common/Logo';
import { prefetchByKey, prefetchCommonPagesIdle } from '../../utils/pagePrefetch';
import LogoutButton from '../auth/LogoutButton';

const Sidebar = ({ activeTab, setActiveTab }) => {
  // Default to collapsed; expand on hover/touch
  const [isCollapsed, setIsCollapsed] = useState(true);
  const collapseTimerRef = useRef(null);

  useEffect(() => {
    prefetchCommonPagesIdle();
    return () => clearTimeout(collapseTimerRef.current)
  }, []);

  const expand = () => {
    clearTimeout(collapseTimerRef.current);
    setIsCollapsed(false);
  };
  const collapse = () => {
    clearTimeout(collapseTimerRef.current);
    setIsCollapsed(true);
  };
  const touchPeek = () => {
    // Simulate hover on touch devices (iPad): tap to peek for 3 seconds
    expand();
    collapseTimerRef.current = setTimeout(() => setIsCollapsed(true), 3000);
  };

  return (
    <div
      className={`h-full flex-shrink-0 ${isCollapsed ? 'w-16' : 'w-80'} transition-all duration-300 ease-in-out bg-gradient-to-b from-emerald-50 via-green-50 to-emerald-100 border-r border-emerald-200/50 flex flex-col relative`}
      onMouseEnter={expand}
      onMouseLeave={collapse}
      onTouchStart={touchPeek}
      onFocus={expand}
      onBlur={collapse}
      role="navigation"
      aria-label="Main navigation"
      tabIndex={0}
    >
      {/* Floating background elements for sidebar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-emerald-300/20 to-green-300/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-green-300/10 to-emerald-300/15 rounded-full blur-xl"></div>
      </div>

      {/* Logo/Header */}
  <div className="relative z-10 p-4 border-b border-emerald-200/50">
        <div className="flex items-center gap-3">
          {/* Collapsed: logo mark only; Expanded: show wordmark too */}
          {isCollapsed ? (
            <div className="mx-auto">
      <LogoMark size={34} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
      <LogoMark size={36} />
      <LogoWordmark className="text-xl md:text-2xl" />
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
  <nav className="relative z-10 flex-1 overflow-y-auto p-3 md:p-4 space-y-5 md:space-y-6">
        {sidebarNavigation.map((section, index) => (
          <div key={index}>
            {section.section && !isCollapsed && (
              <h3 className="text-xs font-semibold text-emerald-700 uppercase tracking-wider mb-3 px-2">
                {section.section}
              </h3>
            )}
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.key}>
                  <button
                    onMouseEnter={() => prefetchByKey(item.key)}
                    onTouchStart={() => prefetchByKey(item.key)}
                    onFocus={() => prefetchByKey(item.key)}
                    onClick={() => startTransition(() => setActiveTab(item.key))}
                    className={`w-full flex items-center ${isCollapsed ? 'justify-center px-2 py-3' : 'gap-3 px-3 py-2'} text-sm font-medium rounded-lg transition-all duration-200 group relative ${
                      activeTab === item.key
                        ? 'bg-white/60 text-emerald-800 shadow-sm border border-emerald-300/50 backdrop-blur-sm'
                        : 'text-emerald-700 hover:text-emerald-800 hover:bg-white/40 hover:shadow-sm backdrop-blur-sm'
                    }`}
                    title={isCollapsed ? item.label : ''}
                  >
                    <span className="flex-shrink-0">{item.icon}</span>
                    {!isCollapsed && <span className="transition-all duration-200">{item.label}</span>}
                    
                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      {/* Quick Stats - only show when expanded */}
      {!isCollapsed && (
        <div className="relative z-10 p-4 mt-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-xl border border-emerald-200/50 p-4 shadow-sm">
            <h3 className="text-sm font-semibold text-emerald-800 mb-3">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600">Total Earnings</span>
                <span className="font-semibold text-emerald-800">$2,450</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600">Referrals</span>
                <span className="font-semibold text-emerald-800">12</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-emerald-600">Code</span>
                <span className="font-mono font-semibold text-emerald-800 text-[10px]">MAFUTA123</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Profile with Logout */}
      <LogoutButton variant="desktop" isCollapsed={isCollapsed} />
    </div>
  );
};

export default Sidebar;
