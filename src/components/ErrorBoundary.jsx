import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays a fallback UI
 * Prevents the entire app from crashing due to a single component error
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // You can also log the error to an error reporting service here
    // e.g., Sentry, LogRocket, etc.
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      const { componentName, showHomeButton } = this.props;
      const { error, errorInfo, errorCount } = this.state;

      // If too many errors, suggest full reload
      const tooManyErrors = errorCount > 3;

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-950 to-black flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-sm border border-red-500/30 rounded-2xl p-8 shadow-2xl">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="bg-red-500/10 p-4 rounded-full">
                <AlertTriangle className="w-16 h-16 text-red-500" />
              </div>
            </div>

            {/* Error Title */}
            <h1 className="text-2xl md:text-3xl font-bold text-white text-center mb-4">
              Något gick fel
            </h1>

            {/* Error Description */}
            <p className="text-gray-400 text-center mb-6">
              {componentName
                ? `Ett fel uppstod i ${componentName}-komponenten.`
                : 'Ett oväntat fel uppstod.'}
              {' '}
              {tooManyErrors
                ? 'Flera fel har uppstått. Vänligen ladda om sidan.'
                : 'Försök ladda om sidan eller återställ komponenten.'}
            </p>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className="mb-6 bg-black/30 rounded-lg p-4 border border-red-500/20">
                <summary className="text-red-400 cursor-pointer font-mono text-sm mb-2">
                  Teknisk information (endast i development)
                </summary>
                <div className="mt-4 space-y-2">
                  <div>
                    <p className="text-red-400 font-semibold text-sm">Error:</p>
                    <pre className="text-gray-300 text-xs overflow-x-auto">
                      {error.toString()}
                    </pre>
                  </div>
                  {errorInfo && errorInfo.componentStack && (
                    <div>
                      <p className="text-red-400 font-semibold text-sm mt-2">
                        Component Stack:
                      </p>
                      <pre className="text-gray-300 text-xs overflow-x-auto max-h-40">
                        {errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </details>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!tooManyErrors && (
                <button
                  onClick={this.handleReset}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  <RefreshCw size={20} />
                  Återställ komponent
                </button>
              )}

              <button
                onClick={this.handleReload}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
              >
                <RefreshCw size={20} />
                Ladda om sidan
              </button>

              {showHomeButton && (
                <button
                  onClick={() => (window.location.href = '/')}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors font-medium"
                >
                  <Home size={20} />
                  Till startsidan
                </button>
              )}
            </div>

            {/* Help Text */}
            <p className="text-gray-500 text-sm text-center mt-6">
              Om problemet kvarstår, kontakta mig via mail-länken i sidfoten.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
