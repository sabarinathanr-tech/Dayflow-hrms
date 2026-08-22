import React from 'react';
import DayflowLogo from './DayflowLogo';

const Loading = ({ text = 'Loading data...', fullScreen = false }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
      <div className="relative flex items-center justify-center mb-4">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-purple to-brand-magenta p-0.5 animate-pulse">
          <div className="w-full h-full bg-white dark:bg-dark-900 rounded-2xl flex items-center justify-center">
            <div className="w-6 h-6 rounded-full border-2 border-brand-purple border-t-transparent animate-spin" />
          </div>
        </div>
      </div>
      {text && <p className="text-xs font-bold text-slate-600 dark:text-slate-400 tracking-wide">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-slate-50/90 dark:bg-dark-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
