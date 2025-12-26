import React from 'react';

/**
 * Card Component - Flexible container for content
 */

export const Card = ({ 
  children, 
  className = '',
  padding = 'default',
  hoverable = false,
  onClick,
  ...props 
}) => {
  const baseStyles = 'bg-white rounded-2xl shadow-sm border border-gray-100';
  
  const paddings = {
    none: '',
    small: 'p-4',
    default: 'p-5',
    large: 'p-6',
  };
  
  const hoverStyles = hoverable || onClick 
    ? 'transition-all duration-200 active:scale-[0.98] cursor-pointer hover:shadow-md' 
    : '';
  
  return (
    <div
      onClick={onClick}
      className={`
        ${baseStyles}
        ${paddings[padding]}
        ${hoverStyles}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * Expense Card - Displays transaction with receipt
 */
export const ExpenseCard = ({
  merchant,
  category,
  amount,
  date,
  time,
  categoryIcon,
  categoryColor = 'orange',
  receiptUrl,
  onClick,
  className = '',
}) => {
  const colorClasses = {
    orange: 'bg-orange-50 text-orange-500',
    purple: 'bg-purple-50 text-purple-500',
    teal: 'bg-teal-50 text-teal-500',
    pink: 'bg-pink-50 text-pink-500',
    indigo: 'bg-indigo-50 text-indigo-500',
    lime: 'bg-lime-50 text-lime-500',
  };
  
  return (
    <Card hoverable onClick={onClick} className={className}>
      <div className="flex items-start justify-between">
        <div className="flex gap-3 flex-1 min-w-0">
          {/* Category Icon */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClasses[categoryColor]}`}>
            {categoryIcon || (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          {/* Details */}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {merchant}
            </h3>
            <p className="text-sm text-gray-500 mt-0.5">
              {category} • {date}
              {time && ` • ${time}`}
            </p>
          </div>
        </div>
        
        {/* Amount */}
        <span className="font-mono font-semibold text-lg text-gray-900 flex-shrink-0 ml-3">
          ${typeof amount === 'number' ? amount.toFixed(2) : amount}
        </span>
      </div>
      
      {/* Receipt Thumbnail */}
      {receiptUrl && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <img 
            src={receiptUrl} 
            className="w-full h-32 object-cover rounded-lg"
            alt="Receipt"
          />
        </div>
      )}
    </Card>
  );
};

/**
 * Stat Card - Display metrics with gradient
 */
export const StatCard = ({
  label,
  value,
  subtitle,
  trend,
  gradient = 'primary',
  className = '',
}) => {
  const gradients = {
    primary: 'from-primary-500 to-primary-600',
    success: 'from-success-500 to-success-600',
    warning: 'from-warning-500 to-warning-600',
    purple: 'from-purple-500 to-purple-600',
  };
  
  return (
    <div className={`
      bg-gradient-to-br ${gradients[gradient]}
      rounded-2xl p-6
      text-white
      shadow-lg
      ${className}
    `}>
      <p className="text-sm opacity-90 font-medium">
        {label}
      </p>
      <p className="text-4xl font-bold mt-2 font-mono">
        {value}
      </p>
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-3">
          {trend && (
            <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
          {subtitle && (
            <span className="text-xs opacity-75">
              {subtitle}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
