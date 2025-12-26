import React from 'react';

/**
 * Badge Component - Status indicators, categories, confidence scores
 */

export const Badge = ({ 
  children, 
  variant = 'default',
  size = 'default',
  dot = false,
  className = '',
  ...props 
}) => {
  const baseStyles = 'inline-flex items-center gap-1 font-medium rounded-md';
  
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    primary: 'bg-primary-50 text-primary-700',
    success: 'bg-success-50 text-success-700',
    warning: 'bg-warning-50 text-warning-700',
    danger: 'bg-danger-50 text-danger-700',
  };
  
  const sizes = {
    small: 'px-2 py-0.5 text-xs',
    default: 'px-2.5 py-1 text-xs',
    large: 'px-3 py-1.5 text-sm',
  };
  
  return (
    <span
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
};

/**
 * OCR Confidence Badge - Color-coded based on confidence level
 */
export const ConfidenceBadge = ({ confidence, className = '' }) => {
  const getVariant = () => {
    if (confidence >= 80) return 'success';
    if (confidence >= 60) return 'warning';
    return 'danger';
  };
  
  return (
    <Badge variant={getVariant()} dot className={className}>
      {confidence}% Confidence
    </Badge>
  );
};

/**
 * Status Badge - For approval states
 */
export const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    approved: { variant: 'success', label: 'Approved' },
    pending: { variant: 'warning', label: 'Pending' },
    rejected: { variant: 'danger', label: 'Rejected' },
    draft: { variant: 'default', label: 'Draft' },
  };
  
  const config = statusConfig[status] || statusConfig.draft;
  
  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
};

/**
 * Category Pill - Selectable category chips
 */
export const CategoryPill = ({ 
  children, 
  selected = false, 
  onClick,
  icon,
  className = '',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        px-3 py-1.5
        rounded-full
        text-xs font-medium
        transition-all duration-200
        active:scale-95
        ${selected 
          ? 'bg-primary-500 text-white shadow-md shadow-primary-500/20' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        ${className}
      `}
      {...props}
    >
      <span className="flex items-center gap-1">
        {icon && <span>{icon}</span>}
        {children}
      </span>
    </button>
  );
};

/**
 * Amount Badge - Displays currency amount
 */
export const AmountBadge = ({ 
  amount, 
  type = 'expense', 
  size = 'default',
  className = '' 
}) => {
  const sizes = {
    small: 'text-sm',
    default: 'text-base',
    large: 'text-xl',
    xlarge: 'text-2xl',
  };
  
  const colors = {
    expense: 'text-gray-900',
    income: 'text-success-600',
    refund: 'text-primary-600',
  };
  
  return (
    <span
      className={`
        font-mono font-semibold
        ${sizes[size]}
        ${colors[type]}
        ${className}
      `}
    >
      ${typeof amount === 'number' ? amount.toFixed(2) : amount}
    </span>
  );
};

export default Badge;
