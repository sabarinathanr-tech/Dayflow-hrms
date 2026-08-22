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
    purple: 'group-hover:border-brand-purple/50 group-hover:shadow-glow-purple text-brand-purple-light',
    cyan: 'group-hover:border-brand-cyan/50 group-hover:shadow-glow-cyan text-brand-cyan-light',
    emerald: 'group-hover:border-emerald-500/50 text-emerald-400'
  }[accent] || 'group-hover:border-brand-purple/50 text-brand-purple-light';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full p-4 rounded-2xl bg-dark-850 border border-dark-700/80 text-left transition-all duration-300 hover:bg-dark-800/80 ${accentClasses}`}
    >
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-dark-800 border border-dark-700 flex items-center justify-center mb-3">
          {Icon && <Icon className="w-5 h-5" />}
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </div>
      <h4 className="text-sm font-bold text-white mb-0.5">{title}</h4>
      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{description}</p>
    </button>
  );
};

export default QuickActionCard;
