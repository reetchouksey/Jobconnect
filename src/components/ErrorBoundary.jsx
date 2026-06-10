import { Component } from 'react';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, info: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('ErrorBoundary caught', error, info);
    this.setState({ info });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, info: null });
  };

  handleClearStorage = () => {
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('jobconnect:'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {
      /* ignore */
    }
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      const isDev = import.meta.env?.DEV;
      const message = this.state.error?.message || 'Unknown error';
      const stack = this.state.error?.stack || '';
      const componentStack = this.state.info?.componentStack || '';

      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 dark:bg-slate-950">
          <div className="card w-full max-w-2xl">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300">
                <AlertTriangle size={26} />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                  Something went wrong
                </h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  We&apos;ve logged the error. You can try resetting the page or
                  clearing local data.
                </p>
                {isDev && (
                  <div className="mt-4 space-y-3">
                    <div className="rounded-xl bg-rose-50 p-3 text-xs text-rose-800 dark:bg-rose-900/30 dark:text-rose-200">
                      <p className="font-bold">Error</p>
                      <p className="mt-1 break-words font-mono">{message}</p>
                    </div>
                    {(stack || componentStack) && (
                      <details className="rounded-xl bg-slate-50 p-3 text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        <summary className="cursor-pointer font-semibold">
                          Stack trace (dev only)
                        </summary>
                        <pre className="mt-2 max-h-60 overflow-auto whitespace-pre-wrap break-words font-mono text-[11px] leading-relaxed">
{stack}
{componentStack ? `\n--- Component Stack ---${componentStack}` : ''}
                        </pre>
                      </details>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary"
              >
                <RefreshCcw size={14} /> Reload page
              </button>
              <button onClick={this.handleReset} className="btn-secondary">
                Try again
              </button>
              <button
                onClick={this.handleClearStorage}
                className="btn-secondary"
              >
                <Home size={14} /> Clear data &amp; go home
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
