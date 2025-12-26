import React from 'react';

/**
 * Button Component - Mobile-first design
 * Variants: primary, secondary, danger, icon
 */

export const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'default',
  fullWidth = false,
  icon,
  disabled = false,
  loading = false,
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = 'font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-primary-500 hover:bg-primary-600 active:bg-primary-700 text-white shadow-lg shadow-primary-500/20',
    secondary: 'bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700',
    danger: 'bg-danger-500 hover:bg-danger-600 active:bg-danger-700 text-white',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
    ghost: 'text-gray-600 hover:bg-gray-100 active:bg-gray-200',
  };
  
  const sizes = {
    small: 'px-4 py-2 text-sm rounded-lg',
    default: 'px-6 py-3 text-base rounded-xl',
    large: 'px-6 py-4 text-lg rounded-xl',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${widthClass}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};

export const IconButton = ({ 
  children, 
  variant = 'default',
  size = 'default',
  onClick,
  className = '',
  ...props 
}) => {
  const baseStyles = 'flex items-center justify-center transition-all duration-200 active:scale-95';
  
  const variants = {
    default: 'bg-white hover:bg-gray-50 text-gray-600 shadow-md',
    primary: 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg shadow-primary-500/20',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-600',
  };
  
  const sizes = {
    small: 'w-10 h-10 rounded-lg',
    default: 'w-12 h-12 rounded-xl',
    large: 'w-16 h-16 rounded-2xl',
  };
  
  return (
    <button
      onClick={onClick}
      className={`
        ${baseStyles}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export const FAB = ({ 
  children, 
  onClick,
  className = '',
  ...props 
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        fixed bottom-24 right-6
        w-16 h-16
        bg-primary-500 hover:bg-primary-600 active:bg-primary-700
        text-white
        rounded-full
        shadow-2xl shadow-primary-500/40
        flex items-center justify-center
        transition-all duration-300
        active:scale-90
        z-50
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
