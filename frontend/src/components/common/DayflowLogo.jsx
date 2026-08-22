import React from 'react';
import { Link } from 'react-router-dom';

const DayflowLogo = ({
  size = 'md', // 'sm', 'md', 'lg'
  showTagline = true,
  showBadge = true,
  className = '',
  linkTo = '/'
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12'
  };

  const titleSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl'
  };

  const content = (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      <div className="relative flex-shrink-0">
        <div className="rounded-xl overflow-hidden bg-slate-950 border border-slate-800/80 shadow-sm flex items-center justify-center">
          <img
            src="/logo.png"
            alt="Dayflow Logo"
            className={`${iconSizes[size] || iconSizes.md} object-contain`}
            onError={(e) => {
              // Fallback if image path needs local fallback
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 leading-none">
          <span className={`font-extrabold tracking-tight text-slate-900 dark:text-white ${titleSizes[size] || titleSizes.md}`}>
            Dayflow
          </span>
          {showBadge && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-purple dark:text-brand-cyan px-1.5 py-0.5 rounded bg-brand-purple/10 dark:bg-brand-cyan/10 border border-brand-purple/20 dark:border-brand-cyan/20">
              HRMS
            </span>
          )}
        </div>
        {showTagline && (
          <span className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 tracking-tight font-medium">
            Every workday, perfectly aligned.
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

export default DayflowLogo;
