import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';
import { Sparkles, Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-dark-950 flex flex-col items-center justify-center p-6 text-center selection:bg-brand-purple selection:text-white">
      <div className="max-w-md w-full p-8 rounded-3xl bg-dark-900 border border-dark-700/80 shadow-2xl space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light flex items-center justify-center mx-auto shadow-glow-purple">
          <Sparkles className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-6xl font-black text-white tracking-tight gradient-text-purple">
            404
          </h1>
          <h2 className="text-xl font-bold text-white mt-2">Page Not Found</h2>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            The workspace route you are trying to access does not exist or has been moved.
          </p>
        </div>

        <div className="pt-2 flex justify-center">
          <Link to="/login">
            <Button variant="primary" leftIcon={Home}>
              Return to Workspace
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
