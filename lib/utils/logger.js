/**
 * Structured logging utility
 *
 * Provides consistent, JSON-formatted logs for production monitoring
 */

const isDevelopment = process.env.NODE_ENV === 'development';

/**
 * Format log entry as JSON
 */
function formatLog(level, message, context = {}) {
  return JSON.stringify({
    level,
    message,
    timestamp: new Date().toISOString(),
    ...context
  });
}

/**
 * Logger instance with structured output
 */
export const logger = {
  /**
   * Log info message
   */
  info: (message, context = {}) => {
    const log = formatLog('INFO', message, context);
    console.log(log);
  },

  /**
   * Log warning message
   */
  warn: (message, context = {}) => {
    const log = formatLog('WARN', message, context);
    console.warn(log);
  },

  /**
   * Log error message with full error details
   */
  error: (message, error, context = {}) => {
    const log = formatLog('ERROR', message, {
      error: error ? {
        name: error.name,
        message: error.message,
        stack: isDevelopment ? error.stack : undefined, // Hide stack in production
        code: error.code
      } : undefined,
      ...context
    });
    console.error(log);
  },

  /**
   * Log debug message (only in development)
   */
  debug: (message, context = {}) => {
    if (isDevelopment) {
      const log = formatLog('DEBUG', message, context);
      console.debug(log);
    }
  }
};

export default logger;
