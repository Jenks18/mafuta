import React from 'react';

/**
 * Bottom Navigation - Mobile-first navigation
 */

export const BottomNav = ({ items, activeItem, onItemClick, className = '' }) => {
  return (
    <nav className={`
      fixed bottom-0 left-0 right-0
      bg-white border-t border-gray-200
      px-6 py-3
      z-40
      ${className}
    `}
    style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex items-center justify-around">
        {items.map(item => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`
              flex flex-col items-center gap-1 px-4 py-2
              transition-colors duration-200
              ${item.id === activeItem ? 'text-primary-500' : 'text-gray-400'}
            `}
          >
            {item.icon}
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

/**
 * Header - Screen header with title and actions
 */
export const Header = ({ 
  title, 
  subtitle,
  leftAction,
  rightAction,
  transparent = false,
  className = '' 
}) => {
  return (
    <header 
      className={`
        sticky top-0 z-30
        ${transparent ? 'bg-transparent' : 'bg-white border-b border-gray-200'}
        ${className}
      `}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div className="flex items-center justify-between px-4 py-4">
        {/* Left Action (Back button, etc) */}
        <div className="flex-shrink-0">
          {leftAction || <div className="w-10" />}
        </div>
        
        {/* Title */}
        <div className="flex-1 text-center px-4">
          <h1 className="text-lg font-semibold text-gray-900 truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-gray-500 truncate mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        
        {/* Right Action (Menu, etc) */}
        <div className="flex-shrink-0">
          {rightAction || <div className="w-10" />}
        </div>
      </div>
    </header>
  );
};

/**
 * Back Button - Standard back navigation
 */
export const BackButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        w-10 h-10
        flex items-center justify-center
        text-gray-600
        rounded-full
        hover:bg-gray-100
        active:bg-gray-200
        transition-colors duration-200
      "
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

/**
 * Menu Button - Three dots menu
 */
export const MenuButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="
        w-10 h-10
        flex items-center justify-center
        text-gray-600
        rounded-full
        hover:bg-gray-100
        active:bg-gray-200
        transition-colors duration-200
      "
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
      </svg>
    </button>
  );
};

export default BottomNav;
