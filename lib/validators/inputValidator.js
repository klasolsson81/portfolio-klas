/**
 * Input validation and sanitization utilities
 *
 * Protects against XSS, injection attacks, and malicious input
 */

import { VALIDATION } from '../config/constants.js';

/**
 * Sanitize text input to prevent XSS and injection attacks
 *
 * @param {string} input - Raw user input
 * @param {number} maxLength - Maximum allowed length
 * @returns {string} Sanitized input
 */
export function sanitizeTextInput(input, maxLength = VALIDATION.MAX_TEXT_LENGTH) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove dangerous patterns
  let sanitized = input
    .trim()
    // Remove script tags (case-insensitive)
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    // Remove all HTML tags
    .replace(/<[^>]+>/g, '')
    // Remove javascript: protocol
    .replace(/javascript:/gi, '')
    // Remove data: protocol (can be used for XSS)
    .replace(/data:/gi, '')
    // Remove vbscript: protocol
    .replace(/vbscript:/gi, '')
    // Remove event handlers (onclick, onerror, etc.)
    .replace(/on\w+\s*=/gi, '')
    // Remove common prompt injection patterns
    .replace(/ignore\s+previous\s+instructions/gi, '')
    .replace(/forget\s+everything/gi, '')
    .replace(/system:/gi, '')
    // Remove code block markers
    .replace(/```/g, '')
    .replace(/~~~\s*/g, '');

  // Escape quotes to prevent breaking out of strings
  sanitized = sanitized
    .replace(/"/g, '\\"')
    .replace(/'/g, "\\'")
    .replace(/`/g, '\\`');

  // Truncate to max length
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }

  return sanitized;
}

/**
 * Validate email format
 *
 * @param {string} email - Email address to validate
 * @returns {boolean} True if valid email format
 */
export function isValidEmail(email) {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= VALIDATION.MAX_EMAIL_LENGTH;
}

/**
 * Sanitize email input
 *
 * @param {string} email - Raw email input
 * @returns {string} Sanitized email
 */
export function sanitizeEmail(email) {
  if (!email || typeof email !== 'string') {
    return '';
  }

  return email
    .trim()
    .toLowerCase()
    .substring(0, VALIDATION.MAX_EMAIL_LENGTH);
}

/**
 * Validate name input (letters, spaces, hyphens only)
 *
 * @param {string} name - Name to validate
 * @returns {boolean} True if valid name
 */
export function isValidName(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }

  // Only letters, spaces, hyphens, apostrophes, and common accented characters
  // Including French (ç), Swedish (å,ä,ö), German (ü), and other European diacritics
  const nameRegex = /^[a-zA-ZåäöÅÄÖéèêëúùûüíìîïóòôõœøæçñÇÑ\s\-']+$/;
  return nameRegex.test(name) && name.length >= VALIDATION.MIN_NAME_LENGTH && name.length <= VALIDATION.MAX_NAME_LENGTH;
}

/**
 * Sanitize name input
 *
 * @param {string} name - Raw name input
 * @returns {string} Sanitized name
 */
export function sanitizeName(name) {
  if (!name || typeof name !== 'string') {
    return '';
  }

  return name
    .trim()
    .replace(/<[^>]+>/g, '')  // Remove HTML tags
    .replace(/[<>]/g, '')      // Remove angle brackets
    .substring(0, VALIDATION.MAX_NAME_LENGTH);
}

/**
 * Validate budget input (numbers only)
 *
 * @param {string|number} budget - Budget value
 * @returns {boolean} True if valid budget
 */
export function isValidBudget(budget) {
  if (!budget) return true;  // Optional field

  const num = parseInt(budget, 10);
  return !isNaN(num) && num >= 0 && num <= VALIDATION.MAX_BUDGET;
}

/**
 * Sanitize budget input
 *
 * @param {string|number} budget - Raw budget input
 * @returns {string} Sanitized budget (empty string or number string)
 */
export function sanitizeBudget(budget) {
  if (!budget) return '';

  // Remove all non-digit characters
  const cleaned = String(budget).replace(/\D/g, '');
  const num = parseInt(cleaned, 10);

  if (isNaN(num)) return '';
  if (num > VALIDATION.MAX_BUDGET) return String(VALIDATION.MAX_BUDGET);

  return String(num);
}
