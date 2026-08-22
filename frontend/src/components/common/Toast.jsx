import React from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';

const Toast = ({ toast, onClose }) => {
  const { title, message, type } = toast;

  const config = {
    success: {
      icon: CheckCircle2,
      border: 'border-emerald-200 dark:border-emerald-500/40',
      bg: 'bg-white dark:bg-dark-800/95',
      accent: 'text-emerald-600 dark:text-emerald-400',
      shadow: 'shadow-lg dark:shadow-[0_0_20px_-5px_rgba(16,185,129,0.3)]'
    },
    error: {
      icon: AlertCircle,
      border: 'border-rose-200 dark:border-rose-500/40',
      bg: 'bg-white dark:bg-dark-800/95',
      accent: 'text-rose-600 dark:text-rose-400',
      shadow: 'shadow-lg dark:shadow-[0_0_20px_-5px_rgba(244,63,94,0.3)]'
    },
    warning: {
      icon: AlertTriangle,
      border: 'border-amber-200 dark:border-amber-500/40',
      bg: 'bg-white dark:bg-dark-800/95',
      accent: 'text-amber-600 dark:text-amber-400',
      shadow: 'shadow-lg dark:shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]'
    },
    info: {
      icon: Info,
      border: 'border-cyan-200 dark:border-cyan-500/40',
      bg: 'bg-white dark:bg-dark-800/95',
      accent: 'text-cyan-600 dark:text-cyan-400',
      shadow: 'shadow-lg dark:shadow-[0_0_20px_-5px_rgba(6,182,212,0.3)]'
    }
  }[type] || {
    icon: Info,
    border: 'border-slate-200 dark:border-dark-600',
    bg: 'bg-white dark:bg-dark-800/95',
    accent: 'text-brand-purple dark:text-brand-cyan',
    shadow: 'shadow-lg'
  };

  const IconComponent = config.icon;

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 w-full p-4 rounded-2xl border ${config.border} ${config.bg} backdrop-blur-md ${config.shadow} transition-all duration-300 transform translate-y-0 animate-in fade-in slide-in-from-bottom-3`}
    >
      <div className={`mt-0.5 flex-shrink-0 ${config.accent}`}>
        <IconComponent className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        {title && <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{title}</h4>}
        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed break-words">{message}</p>
      </div>
      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-700/50 transition-colors"
        aria-label="Close notification"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;
