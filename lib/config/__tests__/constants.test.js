import { describe, it, expect } from 'vitest';
import {
  CHAT_CONFIG,
  RATE_LIMIT,
  GPT_CONFIG,
  VALIDATION,
  RECAPTCHA,
  HTTP_STATUS,
  UI,
  Z_INDEX,
  ERROR_MESSAGES,
} from '../constants';

describe('Application Constants', () => {
  describe('CHAT_CONFIG', () => {
    it('should have reasonable message length limit', () => {
      expect(CHAT_CONFIG.MAX_MESSAGE_LENGTH).toBeGreaterThanOrEqual(100);
      expect(CHAT_CONFIG.MAX_MESSAGE_LENGTH).toBeLessThanOrEqual(5000);
    });

    it('should have a valid storage key', () => {
      expect(CHAT_CONFIG.STORAGE_KEY).toBeTruthy();
      expect(typeof CHAT_CONFIG.STORAGE_KEY).toBe('string');
    });

    it('should limit conversation history', () => {
      expect(CHAT_CONFIG.MAX_CONVERSATION_HISTORY).toBeGreaterThan(0);
      expect(CHAT_CONFIG.MAX_CONVERSATION_HISTORY).toBeLessThanOrEqual(50);
    });
  });

  describe('RATE_LIMIT', () => {
    it('should have positive request limit', () => {
      expect(RATE_LIMIT.MAX_REQUESTS).toBeGreaterThan(0);
    });

    it('should have window in milliseconds', () => {
      expect(RATE_LIMIT.WINDOW_MS).toBeGreaterThanOrEqual(1000);
    });

    it('should have cleanup interval longer than window', () => {
      expect(RATE_LIMIT.CLEANUP_INTERVAL_MS).toBeGreaterThan(RATE_LIMIT.WINDOW_MS);
    });
  });

  describe('GPT_CONFIG', () => {
    it('should have a valid model name', () => {
      expect(GPT_CONFIG.MODEL).toBeTruthy();
      expect(typeof GPT_CONFIG.MODEL).toBe('string');
    });

    it('should have temperature between 0 and 2', () => {
      expect(GPT_CONFIG.TEMPERATURE).toBeGreaterThanOrEqual(0);
      expect(GPT_CONFIG.TEMPERATURE).toBeLessThanOrEqual(2);
    });

    it('should have reasonable max tokens', () => {
      expect(GPT_CONFIG.MAX_TOKENS).toBeGreaterThan(0);
      expect(GPT_CONFIG.MAX_TOKENS).toBeLessThanOrEqual(16000);
    });
  });

  describe('VALIDATION', () => {
    it('should have API message length greater than text length', () => {
      expect(VALIDATION.MAX_API_MESSAGE_LENGTH).toBeGreaterThanOrEqual(VALIDATION.MAX_TEXT_LENGTH);
    });

    it('should have email max length of 254 (RFC standard)', () => {
      expect(VALIDATION.MAX_EMAIL_LENGTH).toBe(254);
    });

    it('should have reasonable name length limits', () => {
      expect(VALIDATION.MIN_NAME_LENGTH).toBeGreaterThan(0);
      expect(VALIDATION.MAX_NAME_LENGTH).toBeGreaterThan(VALIDATION.MIN_NAME_LENGTH);
    });

    it('should have a max budget limit', () => {
      expect(VALIDATION.MAX_BUDGET).toBeGreaterThan(0);
    });
  });

  describe('RECAPTCHA', () => {
    it('should have threshold between 0 and 1', () => {
      expect(RECAPTCHA.SCORE_THRESHOLD).toBeGreaterThan(0);
      expect(RECAPTCHA.SCORE_THRESHOLD).toBeLessThanOrEqual(1);
    });
  });

  describe('HTTP_STATUS', () => {
    it('should have standard HTTP status codes', () => {
      expect(HTTP_STATUS.OK).toBe(200);
      expect(HTTP_STATUS.BAD_REQUEST).toBe(400);
      expect(HTTP_STATUS.UNAUTHORIZED).toBe(401);
      expect(HTTP_STATUS.NOT_FOUND).toBe(404);
      expect(HTTP_STATUS.TOO_MANY_REQUESTS).toBe(429);
      expect(HTTP_STATUS.INTERNAL_ERROR).toBe(500);
    });
  });

  describe('Z_INDEX', () => {
    it('should have ascending z-index hierarchy', () => {
      expect(Z_INDEX.BASE).toBeLessThan(Z_INDEX.DROPDOWN);
      expect(Z_INDEX.DROPDOWN).toBeLessThan(Z_INDEX.FIXED);
      expect(Z_INDEX.FIXED).toBeLessThan(Z_INDEX.STICKY);
      expect(Z_INDEX.STICKY).toBeLessThan(Z_INDEX.OVERLAY);
      expect(Z_INDEX.OVERLAY).toBeLessThan(Z_INDEX.MODAL);
      expect(Z_INDEX.MODAL).toBeLessThan(Z_INDEX.COOKIE_BANNER);
      expect(Z_INDEX.COOKIE_BANNER).toBeLessThan(Z_INDEX.TOAST);
      expect(Z_INDEX.TOAST).toBeLessThan(Z_INDEX.TOOLTIP);
      expect(Z_INDEX.TOOLTIP).toBeLessThan(Z_INDEX.PRIVACY_MODAL);
    });

    it('should have privacy modal as highest user-facing layer', () => {
      expect(Z_INDEX.PRIVACY_MODAL).toBe(100);
    });
  });

  describe('ERROR_MESSAGES', () => {
    it('should have both Swedish and English messages', () => {
      expect(ERROR_MESSAGES.sv).toBeDefined();
      expect(ERROR_MESSAGES.en).toBeDefined();
    });

    it('should have matching keys in both languages', () => {
      const svKeys = Object.keys(ERROR_MESSAGES.sv).sort();
      const enKeys = Object.keys(ERROR_MESSAGES.en).sort();
      expect(svKeys).toEqual(enKeys);
    });

    it('should have non-empty error messages', () => {
      Object.values(ERROR_MESSAGES.sv).forEach(msg => {
        expect(msg.length).toBeGreaterThan(0);
      });
      Object.values(ERROR_MESSAGES.en).forEach(msg => {
        expect(msg.length).toBeGreaterThan(0);
      });
    });
  });

  describe('UI', () => {
    it('should have char counter threshold less than max message length', () => {
      expect(UI.CHAR_COUNTER_THRESHOLD).toBeLessThan(CHAT_CONFIG.MAX_MESSAGE_LENGTH);
    });

    it('should have positive animation values', () => {
      expect(UI.ANIMATION.STAGGER_DELAY).toBeGreaterThan(0);
      expect(UI.ANIMATION.FADE_DURATION).toBeGreaterThan(0);
    });
  });
});
