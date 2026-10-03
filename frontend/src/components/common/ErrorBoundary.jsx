import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center p-4 font-sans">
          <div className="bg-white rounded-xl shadow-lg border border-[#e4e6eb] p-6 max-w-md w-full text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h2 className="text-base font-bold text-[#050505]">Something went wrong</h2>
              <p className="text-xs text-[#65676b] mt-1">
                The interface encountered an unexpected state. Click below to reload the application.
              </p>
            </div>
            <div className="text-left bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px] font-mono text-slate-700 overflow-auto max-h-32">
              {this.state.error?.message || 'Unknown error'}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => window.location.reload()}
                className="flex-1 py-2 px-3 rounded-lg bg-[#0866ff] hover:bg-[#075ce6] text-white text-xs font-semibold shadow-xs transition-colors"
              >
                Reload Page
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                className="py-2 px-3 rounded-lg border border-[#ced0d4] hover:bg-slate-50 text-xs font-semibold text-[#050505] transition-colors"
              >
                Reset Session
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
