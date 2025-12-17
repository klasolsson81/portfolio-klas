import axios from 'axios';
import { toast } from 'sonner';
import { CHAT_CONFIG } from '../config/constants';
import { logger } from '../utils/logger';

/**
 * Axios instance with centralized error handling
 * Eliminates duplicated error handling across components
 */
const apiClient = axios.create({
  timeout: CHAT_CONFIG.REQUEST_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - can add auth tokens here in the future
apiClient.interceptors.request.use(
  (config) => {
    // Log outgoing requests in development
    if (import.meta.env.DEV) {
      logger.info('API Request', {
        method: config.method,
        url: config.url,
        timeout: config.timeout,
      });
    }
    return config;
  },
  (error) => {
    logger.error('Request interceptor error', error);
    return Promise.reject(error);
  }
);

// Response interceptor - centralized error handling
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses in development
    if (import.meta.env.DEV) {
      logger.info('API Response', {
        status: response.status,
        url: response.config.url,
      });
    }
    return response;
  },
  (error) => {
    // Determine language from error config or default to Swedish
    const lang = error.config?.data?.lang || 'sv';

    // Centralized error handling with bilingual support
    if (error.code === 'ECONNABORTED') {
      // Timeout error
      const message = lang === 'sv'
        ? 'Det tog för lång tid. Försök igen.'
        : 'Timeout - please try again.';
      toast.error(message);
      logger.error('Request timeout', error, {
        url: error.config?.url,
        timeout: error.config?.timeout,
      });
    } else if (error.response?.status === 429) {
      // Rate limit error
      const message = lang === 'sv'
        ? 'För många förfrågningar. Vänta lite och försök igen.'
        : 'Too many requests. Please wait and try again.';
      toast.error(message);
      logger.error('Rate limit exceeded', error, {
        url: error.config?.url,
        status: 429,
      });
    } else if (error.response?.status >= 500) {
      // Server error
      const message = lang === 'sv'
        ? 'Serverfel. Försök igen senare.'
        : 'Server error. Please try again later.';
      toast.error(message);
      logger.error('Server error', error, {
        url: error.config?.url,
        status: error.response?.status,
      });
    } else if (error.response?.status === 400) {
      // Bad request
      const message = lang === 'sv'
        ? 'Ogiltig förfrågan. Kontrollera din inmatning.'
        : 'Invalid request. Please check your input.';
      toast.error(message);
      logger.error('Bad request', error, {
        url: error.config?.url,
        status: 400,
      });
    } else if (!error.response) {
      // Network error (no response)
      const message = lang === 'sv'
        ? 'Nätverksfel. Kontrollera din anslutning.'
        : 'Network error. Please check your connection.';
      toast.error(message);
      logger.error('Network error', error, {
        message: error.message,
      });
    }

    // Always reject so components can handle specific cases if needed
    return Promise.reject(error);
  }
);

export default apiClient;
