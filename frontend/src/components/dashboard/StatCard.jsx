import React from 'react';

const StatCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive = true,
  variant = 'purple',
  onClick,
  className = ''
}) => {
  const styles = {
    purple: {
      border: 'hover:border-purple-300 dark:hover:border-brand-purple/50',
      iconBg: 'bg-purple-50 dark:bg-brand-purple/10 border-purple-200 dark:border-brand-purple/20 text-brand-purple dark:text-brand-purple-light',
      glow: 'hover:shadow-glow-purple'
    },
    cyan: {
      border: 'hover:border-cyan-300 dark:hover:border-brand-cyan/50',
      iconBg: 'bg-cyan-50 dark:bg-brand-cyan/10 border-cyan-200 dark:border-brand-cyan/20 text-cyan-600 dark:text-brand-cyan-light',
      glow: 'hover:shadow-glow-cyan'
    },
    emerald: {
      border: 'hover:border-emerald-300 dark:hover:border-emerald-500/50',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
      glow: 'hover:shadow-md'
    },
    amber: {
      border: 'hover:border-amber-300 dark:hover:border-amber-500/50',
      iconBg: 'bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-400',
      glow: 'hover:shadow-md'
    },
    rose: {
      border: 'hover:border-rose-300 dark:hover:border-rose-500/50',
      iconBg: 'bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20 text-rose-600 dark:text-rose-400',
      glow: 'hover:shadow-md'
    }
  }[variant] || {
    border: 'hover:border-slate-300 dark:hover:border-dark-600',
    iconBg: 'bg-slate-100 dark:bg-dark-750 border-slate-200 dark:border-dark-600 text-slate-600 dark:text-slate-300',
    glow: ''
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 sm:p-6 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark transition-all duration-300 ${styles.border} ${styles.glow} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider truncate mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-bold ${
                  trendPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 truncate font-medium">{subtitle}</p>
          )}
        </div>

        {Icon && (
          <div
            className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${styles.iconBg}`}
          >
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
