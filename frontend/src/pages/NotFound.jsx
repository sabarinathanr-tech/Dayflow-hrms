import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import DayflowLogo from '../components/common/DayflowLogo';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-dark-950 flex flex-col items-center justify-center p-6 text-center transition-colors">
      <div className="mb-6">
        <DayflowLogo size="lg" linkTo="/" />
      </div>

      <div className="w-full max-w-md p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-2xl space-y-4">
        <span className="text-6xl font-black text-brand-purple dark:text-brand-purple-light font-mono block">
          404
        </span>
        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
          Page Not Found
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
          The requested route does not exist or has been moved under Dayflow enterprise access controls.
        </p>

        <div className="pt-4 flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md" leftIcon={Home}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
