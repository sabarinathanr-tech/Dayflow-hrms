import React from 'react';
import { Loader2 } from 'lucide-react';

const Loading = ({ text = 'Loading data...', fullScreen = false, size = 'md' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-brand-purple/20 border-t-brand-purple animate-spin" />
        <div className="absolute w-6 h-6 rounded-full border-2 border-brand-cyan/20 border-b-brand-cyan animate-spin-reverse" />
      </div>
      {text && <p className="mt-4 text-xs font-medium text-slate-400 tracking-wide">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-dark-900/90 backdrop-blur-sm z-50 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default Loading;
