import React, { useState } from 'react';
import { sidebarNavigation } from '../../config/navigation.jsx';

const Sidebar = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`${isCollapsed ? 'w-20' : 'w-80'} transition-all duration-300 ease-in-out bg-gradient-to-b from-emerald-50 via-green-50 to-emerald-100 border-r border-emerald-200/50 flex flex-col relative`}>
      {/* Floating background elements for sidebar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-to-r from-emerald-300/20 to-green-300/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-1/3 right-1/4 w-20 h-20 bg-gradient-to-r from-green-300/10 to-emerald-300/15 rounded-full blur-xl"></div>
      </div>

      {/* Logo/Header */}
      <div className="relative z-10 p-6 border-b border-emerald-200/50 backdrop-blur-sm bg-white/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">M</span>
          </div>
          {!isCollapsed && (
            <div className="flex-1">
              <h1 className="text-lg font-bold text-emerald-800">MafutaPass</h1>
              <p className="text-xs text-emerald-600">Fuel Management</p>
            </div>
          )}
          <button
            onClick={toggleCollapsed}
            className="p-2 rounded-lg bg-white/50 hover:bg-white/70 text-emerald-700 hover:text-emerald-800 transition-all shadow-sm border border-emerald-200/50"
          >
            <svg 
              className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex-1 overflow-y-auto p-4 space-y-6">
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
                    onClick={() => setActiveTab(item.key)}
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

      {/* User Profile */}
      <div className="relative z-10 p-4 border-t border-emerald-200/50 bg-white/30 backdrop-blur-sm">
        <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
          <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full flex items-center justify-center shadow-sm">
            <span className="text-white font-semibold text-xs">IJ</span>
          </div>
          {!isCollapsed && (
            <>
              <div className="flex-1">
                <p className="font-medium text-emerald-800 text-sm">Ian Jenkins</p>
                <p className="text-xs text-emerald-600">Premium Member</p>
              </div>
              <button className="p-1 rounded-md hover:bg-white/50 text-emerald-600 hover:text-emerald-700 transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
