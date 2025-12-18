/**
 * Application-wide constants
 *
 * Centralizes all magic numbers and configuration values for easy maintenance
 */

// ============================================
// CHAT CONFIGURATION
// ============================================

export const CHAT_CONFIG = {
  /**
   * Maximum characters per chat message
   * Prevents excessively long messages and reduces API costs
   */
  MAX_MESSAGE_LENGTH: 500,

  /**
   * Request timeout in milliseconds
   * OpenAI Assistants API can take 30-60s for initial responses
   * (creating assistant + generating response)
   */
  REQUEST_TIMEOUT_MS: 60000, // 60 seconds

  /**
   * Maximum conversation history to send to API
   * Keeps context relevant while managing token usage
   */
  MAX_CONVERSATION_HISTORY: 10, // Last 10 messages

  /**
   * localStorage key for persisting chat history
   */
  STORAGE_KEY: 'klasPortfolio_chatHistory',
};

// ============================================
// RATE LIMITING
// ============================================

export const RATE_LIMIT = {
  /**
   * Maximum requests allowed per window per IP
   * Protects against API abuse and excessive costs
   */
  MAX_REQUESTS: 10,

  /**
   * Time window for rate limiting in milliseconds
   * 60000ms = 1 minute
   */
  WINDOW_MS: 60000,

  /**
   * Cleanup interval for old rate limit entries
   * Prevents memory leaks in serverless functions
   */
  CLEANUP_INTERVAL_MS: 300000, // 5 minutes
};

// ============================================
// GPT CONFIGURATION
// ============================================

export const GPT_CONFIG = {
  /**
   * OpenAI model for chatbot
   * gpt-5-nano: Fastest, most cost-efficient (perfect for casual chat)
   */
  MODEL: 'gpt-5-nano',

  /**
   * OpenAI model for project analysis (HireMe)
   * GPT-5.2: Best reasoning for agentic tasks
   */
  HIRE_MODEL: 'GPT-5.2',

  /**
   * Temperature for GPT responses (0.0-2.0)
   * 0.7 balances creativity with consistency
   */
  TEMPERATURE: 0.7,

  /**
   * Maximum tokens in GPT response
   * Controls response length and cost
   */
  MAX_TOKENS: 500,

  /**
   * Presence penalty (-2.0 to 2.0)
   * Slightly discourage repetitive topics
   */
  PRESENCE_PENALTY: 0.1,

  /**
   * Frequency penalty (-2.0 to 2.0)
   * Slightly discourage word repetition
   */
  FREQUENCY_PENALTY: 0.1,
};

// ============================================
// INPUT VALIDATION
// ============================================

export const VALIDATION = {
  /**
   * Maximum length for text inputs
   */
  MAX_TEXT_LENGTH: 500,

  /**
   * Maximum length for chat messages to API
   */
  MAX_API_MESSAGE_LENGTH: 1000,

  /**
   * Maximum length for email addresses
   */
  MAX_EMAIL_LENGTH: 254,

  /**
   * Maximum length for name fields
   */
  MAX_NAME_LENGTH: 100,

  /**
   * Minimum length for name fields
   */
  MIN_NAME_LENGTH: 2,

  /**
   * Maximum budget value
   */
  MAX_BUDGET: 10000000,
};

// ============================================
// CAPTCHA CONFIGURATION
// ============================================

export const CAPTCHA = {
  /**
   * Captcha expiration time in milliseconds
   * Currently set to 10 minutes
   */
  EXPIRATION_MS: 600000, // 10 minutes

  /**
   * Operand ranges for different math operations
   */
  OPERATIONS: {
    ADD: { min: 1, max: 20 },
    SUBTRACT: { min: 5, max: 20 },
    MULTIPLY: { min: 2, max: 10 },
  },
};

// ============================================
// HTTP STATUS CODES
// ============================================

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  REQUEST_TIMEOUT: 408,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ============================================
// UI CONFIGURATION
// ============================================

export const UI = {
  /**
   * Character count warning threshold
   * Shows character counter when input exceeds this
   */
  CHAR_COUNTER_THRESHOLD: 400,

  /**
   * Maximum textarea height in pixels
   */
  MAX_TEXTAREA_HEIGHT: 120,

  /**
   * Animation delays and durations (in milliseconds)
   */
  ANIMATION: {
    STAGGER_DELAY: 100,           // Delay between staggered animations
    FADE_DURATION: 300,           // Standard fade transition duration
    FLOATING_CODE_DISPLAY: 8000,  // How long floating code shows (8 seconds)
    FLOATING_CODE_INTERVAL: 12000, // Interval between floating code appearances (12 seconds)
    FLOATING_CODE_DURATION: 10,   // Animation duration in seconds (used by Framer Motion)
  },

  /**
   * Floating code position constraints (percentages)
   */
  FLOATING_CODE: {
    MIN_TOP_POSITION: 10,  // Minimum top position (10% of screen)
    MAX_TOP_RANGE: 70,     // Range for random position (70% of screen)
  },
};

// ============================================
// ERROR MESSAGES
// ============================================

export const ERROR_MESSAGES = {
  sv: {
    RATE_LIMIT: 'För många förfrågningar. Försök igen om {{minutes}} minut.',
    INVALID_INPUT: 'Meddelandet innehöll ogiltiga tecken. Försök igen.',
    TIMEOUT: 'Det tog för lång tid. Försök igen.',
    GENERIC: 'Något gick fel. Försök igen.',
    CAPTCHA_FAILED: 'Fel svar. Försök igen.',
  },
  en: {
    RATE_LIMIT: 'Too many requests. Please try again in {{minutes}} minute.',
    INVALID_INPUT: 'Invalid input. Please try again.',
    TIMEOUT: 'Request timeout. Please try again.',
    GENERIC: 'Something went wrong. Please try again.',
    CAPTCHA_FAILED: 'Incorrect answer. Please try again.',
  },
};
