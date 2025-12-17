/**
 * Simple in-memory rate limiter
 *
 * Tracks request counts per IP address to prevent API abuse
 * Uses sliding window algorithm for accurate rate limiting
 */

import { RATE_LIMIT } from '../config/constants.js';

// Store: IP -> [timestamp1, timestamp2, ...]
const requestStore = new Map();

// Cleanup old entries to prevent memory leak
setInterval(() => {
  const now = Date.now();
  const cleanupThreshold = now - RATE_LIMIT.CLEANUP_INTERVAL_MS;

  for (const [ip, timestamps] of requestStore.entries()) {
    const validTimestamps = timestamps.filter(ts => ts > cleanupThreshold);

    if (validTimestamps.length === 0) {
      requestStore.delete(ip);
    } else {
      requestStore.set(ip, validTimestamps);
    }
  }
}, RATE_LIMIT.CLEANUP_INTERVAL_MS);

/**
 * Check if request should be rate limited
 *
 * @param {string} ip - Client IP address
 * @param {number} limit - Max requests allowed in window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Object} { allowed: boolean, remaining: number, resetAt: number }
 */
export function checkRateLimit(ip, limit = RATE_LIMIT.MAX_REQUESTS, windowMs = RATE_LIMIT.WINDOW_MS) {
  const now = Date.now();
  const windowStart = now - windowMs;

  // Get existing requests for this IP
  const requests = requestStore.get(ip) || [];

  // Filter out requests outside the current window
  const validRequests = requests.filter(timestamp => timestamp > windowStart);

  // Check if limit exceeded
  if (validRequests.length >= limit) {
    const oldestRequest = Math.min(...validRequests);
    const resetAt = oldestRequest + windowMs;

    return {
      allowed: false,
      remaining: 0,
      resetAt: resetAt,
      retryAfter: Math.ceil((resetAt - now) / 1000)  // Seconds until reset
    };
  }

  // Add current request timestamp
  validRequests.push(now);
  requestStore.set(ip, validRequests);

  return {
    allowed: true,
    remaining: limit - validRequests.length,
    resetAt: now + windowMs
  };
}

/**
 * Get client IP from request headers
 *
 * Handles various proxy headers (Vercel, Cloudflare, etc.)
 *
 * @param {Object} req - Request object
 * @returns {string} Client IP address
 */
export function getClientIP(req) {
  // Check common proxy headers (in priority order)
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    // x-forwarded-for can be a comma-separated list, take the first one
    return forwarded.split(',')[0].trim();
  }

  const realIP = req.headers['x-real-ip'];
  if (realIP) {
    return realIP;
  }

  const cfConnectingIP = req.headers['cf-connecting-ip'];  // Cloudflare
  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to socket remote address
  return req.socket?.remoteAddress || 'unknown';
}

/**
 * Clear rate limit for specific IP (useful for testing or admin override)
 *
 * @param {string} ip - IP address to clear
 */
export function clearRateLimit(ip) {
  requestStore.delete(ip);
}

/**
 * Get current rate limit stats for IP
 *
 * @param {string} ip - IP address
 * @returns {Object} { requestCount: number, timestamps: number[] }
 */
export function getRateLimitStats(ip) {
  const requests = requestStore.get(ip) || [];
  return {
    requestCount: requests.length,
    timestamps: requests
  };
}
