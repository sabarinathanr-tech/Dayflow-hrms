import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';
import Button from './Button';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Dayflow Application Error caught by boundary:', error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-dark-900 flex items-center justify-center p-6 text-center transition-colors">
          <div className="max-w-md w-full p-8 rounded-3xl bg-white dark:bg-dark-850 border border-slate-200 dark:border-dark-700/80 shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-500 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Application Encountered an Issue</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Dayflow encountered an unexpected state. You can reload the page or return to the main dashboard to restore your session.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 pt-2">
              <Button variant="secondary" size="md" onClick={() => { window.location.href = '/'; }}>
                Return Home
              </Button>
              <Button variant="primary" size="md" onClick={this.handleReload} leftIcon={RotateCcw}>
                Reload Application
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
