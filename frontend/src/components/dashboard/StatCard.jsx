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
      border: 'hover:border-brand-purple/50',
      iconBg: 'bg-brand-purple/10 border-brand-purple/20 text-brand-purple-light',
      glow: 'hover:shadow-glow-purple'
    },
    cyan: {
      border: 'hover:border-brand-cyan/50',
      iconBg: 'bg-brand-cyan/10 border-brand-cyan/20 text-brand-cyan-light',
      glow: 'hover:shadow-glow-cyan'
    },
    emerald: {
      border: 'hover:border-emerald-500/50',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
      glow: 'hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]'
    },
    amber: {
      border: 'hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
      glow: 'hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]'
    },
    rose: {
      border: 'hover:border-rose-500/50',
      iconBg: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
      glow: 'hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]'
    }
  }[variant] || {
    border: 'hover:border-dark-600',
    iconBg: 'bg-dark-750 border-dark-600 text-slate-300',
    glow: ''
  };

  return (
    <div
      onClick={onClick}
      className={`p-5 sm:p-6 rounded-2xl bg-dark-850 border border-dark-700/80 transition-all duration-300 ${styles.border} ${styles.glow} ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider truncate mb-1">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {value}
            </h3>
            {trend && (
              <span
                className={`text-xs font-semibold ${
                  trendPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {trend}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-slate-400 mt-1 truncate">{subtitle}</p>
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
