import React from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { logger } from '../../lib/utils/logger';

/**
 * Error Boundary Component
 *
 * Catches JavaScript errors in child components and displays a fallback UI
 * Prevents the entire app from crashing due to a single component error
 *
 * Props:
 * - componentName: Name of the component being wrapped (for error messages)
 * - showHomeButton: Show "Home" button in error UI
 * - isDark: Theme mode (dark/light)
 * - lang: Language ('sv' | 'en')
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
    const { componentName } = this.props;

    // Log error with structured logger
    logger.error('Error caught by ErrorBoundary', error, {
      component: componentName || 'Unknown',
      errorInfo: errorInfo?.componentStack?.substring(0, 500), // Limit stack size
      errorCount: this.state.errorCount + 1
    });

    this.setState(prevState => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // TODO: Send to error reporting service (Sentry, LogRocket, etc.)
    // if (process.env.NODE_ENV === 'production') {
    //   reportErrorToService(error, errorInfo, componentName);
    // }
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
      const { componentName, showHomeButton, isDark = true, lang = 'sv' } = this.props;
      const { error, errorInfo, errorCount } = this.state;

      // If too many errors, suggest full reload
      const tooManyErrors = errorCount > 3;

      // Translations
      const t = {
        title: lang === 'sv' ? 'Något gick fel' : 'Something went wrong',
        description: {
          component: lang === 'sv'
            ? `Ett fel uppstod i ${componentName}-komponenten.`
            : `An error occurred in the ${componentName} component.`,
          generic: lang === 'sv' ? 'Ett oväntat fel uppstod.' : 'An unexpected error occurred.',
          tooMany: lang === 'sv'
            ? 'Flera fel har uppstått. Vänligen ladda om sidan.'
            : 'Multiple errors occurred. Please reload the page.',
          suggestion: lang === 'sv'
            ? 'Försök ladda om sidan eller återställ komponenten.'
            : 'Try reloading the page or resetting the component.'
        },
        buttons: {
          reset: lang === 'sv' ? 'Återställ komponent' : 'Reset component',
          reload: lang === 'sv' ? 'Ladda om sidan' : 'Reload page',
          home: lang === 'sv' ? 'Till startsidan' : 'Go to home'
        },
        devInfo: lang === 'sv'
          ? 'Teknisk information (endast i development)'
          : 'Technical information (development only)',
        helpText: lang === 'sv'
          ? 'Om problemet kvarstår, kontakta mig via mail-länken i sidfoten.'
          : 'If the problem persists, contact me via the email link in the footer.'
      };

      return (
        <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-700
          ${isDark
            ? 'bg-gradient-to-br from-slate-800 via-slate-950 to-black'
            : 'bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50'}`}>
          <div className={`max-w-2xl w-full rounded-2xl p-8 shadow-2xl backdrop-blur-sm border transition-colors duration-300
            ${isDark
              ? 'bg-slate-900/50 border-red-500/30'
              : 'bg-orange-50/80 border-red-400/40'}`}>
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className={`p-4 rounded-full ${isDark ? 'bg-red-500/10' : 'bg-red-100'}`}>
                <AlertTriangle className={`w-16 h-16 ${isDark ? 'text-red-500' : 'text-red-600'}`} />
              </div>
            </div>

            {/* Error Title */}
            <h1 className={`text-2xl md:text-3xl font-bold text-center mb-4 transition-colors
              ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {t.title}
            </h1>

            {/* Error Description */}
            <p className={`text-center mb-6 transition-colors
              ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
              {componentName ? t.description.component : t.description.generic}
              {' '}
              {tooManyErrors ? t.description.tooMany : t.description.suggestion}
            </p>

            {/* Error Details (Development Mode) */}
            {process.env.NODE_ENV === 'development' && error && (
              <details className={`mb-6 rounded-lg p-4 border transition-colors
                ${isDark
                  ? 'bg-black/30 border-red-500/20'
                  : 'bg-red-50/50 border-red-300/40'}`}>
                <summary className={`cursor-pointer font-mono text-sm mb-2 transition-colors
                  ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                  {t.devInfo}
                </summary>
                <div className="mt-4 space-y-2">
                  <div>
                    <p className={`font-semibold text-sm transition-colors
                      ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                      Error:
                    </p>
                    <pre className={`text-xs overflow-x-auto transition-colors
                      ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
                      {error.toString()}
                    </pre>
                  </div>
                  {errorInfo && errorInfo.componentStack && (
                    <div>
                      <p className={`font-semibold text-sm mt-2 transition-colors
                        ${isDark ? 'text-red-400' : 'text-red-700'}`}>
                        Component Stack:
                      </p>
                      <pre className={`text-xs overflow-x-auto max-h-40 transition-colors
                        ${isDark ? 'text-gray-300' : 'text-slate-700'}`}>
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
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-medium
                    ${isDark
                      ? 'bg-neon-purple hover:bg-neon-purple/80 text-white'
                      : 'bg-warm-accent hover:bg-warm-accentDark text-white shadow-md hover:shadow-lg'}`}
                >
                  <RefreshCw size={20} />
                  {t.buttons.reset}
                </button>
              )}

              <button
                onClick={this.handleReload}
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-medium
                  ${isDark
                    ? 'bg-slate-700 hover:bg-slate-600 text-white'
                    : 'bg-slate-600 hover:bg-slate-700 text-white shadow-md hover:shadow-lg'}`}
              >
                <RefreshCw size={20} />
                {t.buttons.reload}
              </button>

              {showHomeButton && (
                <button
                  onClick={() => (window.location.href = '/')}
                  className={`flex items-center justify-center gap-2 px-6 py-3 rounded-lg transition-all font-medium
                    ${isDark
                      ? 'bg-slate-700 hover:bg-slate-600 text-white'
                      : 'bg-slate-600 hover:bg-slate-700 text-white shadow-md hover:shadow-lg'}`}
                >
                  <Home size={20} />
                  {t.buttons.home}
                </button>
              )}
            </div>

            {/* Help Text */}
            <p className={`text-sm text-center mt-6 transition-colors
              ${isDark ? 'text-gray-500' : 'text-slate-500'}`}>
              {t.helpText}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
