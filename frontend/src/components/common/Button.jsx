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
  const baseStyles = 'group inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none select-none active:scale-[0.98]';

  const variants = {
    primary: 'bg-gradient-to-r from-brand-purple to-brand-magenta hover:from-purple-700 hover:to-fuchsia-700 text-white shadow-glow-purple hover:shadow-[0_0_24px_-2px_rgba(168,85,247,0.55)] hover:-translate-y-0.5 focus-visible:ring-brand-purple border border-purple-400/30',
    secondary: 'bg-slate-100 dark:bg-dark-800 hover:bg-slate-200 dark:hover:bg-dark-750 text-slate-800 dark:text-slate-200 hover:-translate-y-0.5 hover:shadow-sm border border-slate-200 dark:border-dark-700 focus-visible:ring-brand-purple',
    cyan: 'bg-gradient-to-r from-brand-cyan-dark to-brand-cyan hover:from-cyan-700 hover:to-cyan-500 text-white shadow-glow-cyan hover:shadow-[0_0_24px_-2px_rgba(6,182,212,0.55)] hover:-translate-y-0.5 focus-visible:ring-brand-cyan border border-cyan-400/30',
    outline: 'bg-transparent hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-dark-600 hover:border-brand-purple hover:-translate-y-0.5 focus-visible:ring-brand-purple',
    danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)] hover:shadow-[0_0_22px_-2px_rgba(244,63,94,0.5)] hover:-translate-y-0.5 focus-visible:ring-rose-500 border border-rose-500/30',
    ghost: 'bg-transparent hover:bg-slate-100 dark:hover:bg-dark-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white focus-visible:ring-slate-400'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-xs sm:text-sm gap-2',
    lg: 'px-6 py-3 text-sm sm:text-base gap-2.5'
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
          {LeftIcon && (
            <LeftIcon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:-translate-x-0.5" />
          )}
          <span>{children}</span>
          {RightIcon && (
            <RightIcon className="w-4 h-4 flex-shrink-0 transition-transform duration-200 group-hover:translate-x-1" />
          )}
        </>
      )}
    </button>
  );
};

export default Button;
