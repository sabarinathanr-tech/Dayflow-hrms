import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  accent = 'purple'
}) => {
  const accentClasses = {
    purple: 'hover:border-purple-300 dark:hover:border-brand-purple/50 text-brand-purple dark:text-brand-purple-light',
    cyan: 'hover:border-cyan-300 dark:hover:border-brand-cyan/50 text-cyan-600 dark:text-brand-cyan-light',
    emerald: 'hover:border-emerald-300 dark:hover:border-emerald-500/50 text-emerald-600 dark:text-emerald-400'
  }[accent] || 'hover:border-purple-300 dark:hover:border-brand-purple/50 text-brand-purple dark:text-brand-purple-light';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full p-4 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-card-light dark:shadow-card-dark text-left transition-all duration-300 hover:bg-slate-50 dark:hover:bg-dark-800/80 hover:shadow-md ${accentClasses}`}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-dark-800 border border-slate-200 dark:border-dark-700 flex items-center justify-center mb-3">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <h4 className="text-sm font-black text-slate-900 dark:text-white mb-0.5">{title}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-medium">{description}</p>
    </button>
  );
};

export default QuickActionCard;
