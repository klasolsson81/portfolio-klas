/**
 * Environment variable validation and configuration
 *
 * Validates required environment variables at startup and provides
 * a centralized config object for the application
 *
 * Features:
 * - Required vs optional env vars
 * - API key format validation
 * - Auto-validation on import (server-side)
 * - Fail-fast with clear error messages
 * - Safe config summary (no secrets exposed)
 */

import { logger } from '../utils/logger.js';

/**
 * Required environment variables for the application
 */
const requiredEnvVars = {
  // Server-side only (API keys, secrets)
  server: [
    'OPENAI_API_KEY',
  ],
  // Client-side (Vite exposes VITE_* variables)
  client: [
    // Add client-side env vars here if needed
    // e.g., 'VITE_RECAPTCHA_SITE_KEY'
  ]
};

/**
 * Optional environment variables with defaults
 */
const optionalEnvVars = {
  NODE_ENV: 'development',
  PORT: '3000',
};

/**
 * Validate that all required environment variables are set
 *
 * @param {boolean} isServer - True if running on server, false if client
 * @throws {Error} If any required variables are missing
 */
export function validateEnv(isServer = true) {
  const varsToCheck = isServer
    ? requiredEnvVars.server
    : requiredEnvVars.client;

  const missing = varsToCheck.filter(key => !process.env[key]);

  if (missing.length > 0) {
    const context = isServer ? 'server' : 'client';
    throw new Error(
      `❌ Missing required ${context} environment variables:\n` +
      `   ${missing.map(key => `- ${key}`).join('\n   ')}\n\n` +
      `Please check your .env file and ensure all required variables are set.\n` +
      `See .env.example for reference.`
    );
  }

  // Validate format of API keys
  if (isServer) {
    validateApiKeyFormats();
  }
}

/**
 * Validate API key formats
 * @throws {Error} If API key format is invalid
 */
function validateApiKeyFormats() {
  const openaiKey = process.env.OPENAI_API_KEY;

  // OpenAI keys should start with 'sk-' or 'sk-proj-'
  if (openaiKey && !openaiKey.startsWith('sk-')) {
    const maskedKey = maskApiKey(openaiKey);
    throw new Error(
      `❌ Invalid OPENAI_API_KEY format.\n` +
      `   Expected format: sk-...\n` +
      `   Received: ${maskedKey}`
    );
  }
}

/**
 * Mask API key for safe logging
 * Shows first 7 chars and last 4 chars, masks middle
 *
 * @param {string} key - API key to mask
 * @returns {string} Masked key (e.g., "sk-1234...xyz")
 */
function maskApiKey(key) {
  if (!key || key.length < 12) return '***';
  return `${key.substring(0, 7)}...${key.substring(key.length - 4)}`;
}

/**
 * Get environment variable with fallback
 *
 * @param {string} key - Environment variable key
 * @param {string} fallback - Fallback value if not set
 * @returns {string} Environment variable value or fallback
 */
function getEnv(key, fallback = '') {
  return process.env[key] || optionalEnvVars[key] || fallback;
}

/**
 * Application configuration object
 * All environment variables accessed through this object
 */
export const config = {
  // Environment
  env: getEnv('NODE_ENV', 'development'),
  isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
  isProduction: getEnv('NODE_ENV') === 'production',
  isTest: getEnv('NODE_ENV') === 'test',

  // Server
  port: parseInt(getEnv('PORT', '3000'), 10),

  // API Keys (server-side only)
  openaiKey: process.env.OPENAI_API_KEY,
  githubToken: process.env.GITHUB_TOKEN,

  // Feature flags
  enableDebugLogging: getEnv('DEBUG_LOGGING') === 'true',
  enableAnalytics: getEnv('ENABLE_ANALYTICS') === 'true',
};

/**
 * Check if configuration is valid
 *
 * @returns {boolean} True if all required config is present
 */
export function isConfigValid() {
  try {
    validateEnv(typeof window === 'undefined'); // Server-side check
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get configuration summary for logging
 *
 * @param {boolean} includeMaskedKeys - Include masked API keys in summary
 * @returns {Object} Safe config summary (no secrets)
 */
export function getConfigSummary(includeMaskedKeys = false) {
  const summary = {
    env: config.env,
    isDevelopment: config.isDevelopment,
    isProduction: config.isProduction,
    port: config.port,
    openaiKeySet: !!config.openaiKey,
    enableDebugLogging: config.enableDebugLogging,
    enableAnalytics: config.enableAnalytics,
  };

  // Optionally include masked keys for debugging
  if (includeMaskedKeys && config.openaiKey) {
    summary.openaiKeyMasked = maskApiKey(config.openaiKey);
  }

  return summary;
}

// Auto-validate on import (server-side only)
if (typeof window === 'undefined') {
  try {
    validateEnv(true);
    if (config.isDevelopment) {
      logger.info('Environment variables validated successfully', getConfigSummary(true));
    } else {
      // Production: minimal logging
      logger.info('Environment configuration loaded', {
        env: config.env,
        openaiKeySet: !!config.openaiKey
      });
    }
  } catch (error) {
    logger.error('Environment validation failed', new Error(error.message), {});
    process.exit(1); // Fail fast with clear error message
  }
}
