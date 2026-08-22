import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  onClick,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-purple to-brand-magenta hover:from-purple-600 hover:to-fuchsia-600 text-white shadow-glow-purple focus:ring-brand-purple border border-purple-400/20',
    secondary: 'bg-dark-750 hover:bg-dark-700 text-slate-200 hover:text-white border border-dark-600 hover:border-dark-500 focus:ring-brand-cyan',
    cyan: 'bg-gradient-to-r from-brand-cyan-dark to-brand-cyan hover:from-cyan-600 hover:to-cyan-400 text-white shadow-glow-cyan focus:ring-brand-cyan border border-cyan-400/20',
    outline: 'bg-transparent hover:bg-dark-800 text-slate-300 hover:text-white border border-dark-600 hover:border-brand-purple focus:ring-brand-purple',
    danger: 'bg-rose-600/90 hover:bg-rose-600 text-white shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)] focus:ring-rose-500 border border-rose-500/30',
    ghost: 'bg-transparent hover:bg-dark-800 text-slate-400 hover:text-white focus:ring-slate-500'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5'
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>{typeof children === 'string' ? 'Loading...' : children}</span>
        </>
      ) : (
        <>
          {LeftIcon && <LeftIcon className="w-4 h-4 flex-shrink-0" />}
          {children}
          {RightIcon && <RightIcon className="w-4 h-4 flex-shrink-0" />}
        </>
      )}
    </button>
  );
};

export default Button;
