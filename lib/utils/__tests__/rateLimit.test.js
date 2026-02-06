import { describe, it, expect, beforeEach } from 'vitest';
import { checkRateLimit, getClientIP, clearRateLimit, getRateLimitStats } from '../rateLimit';

describe('Rate Limiter', () => {
  const testIP = '192.168.1.100';

  beforeEach(() => {
    clearRateLimit(testIP);
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit(testIP, 10, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(9);
    });

    it('should track remaining requests correctly', () => {
      for (let i = 0; i < 5; i++) {
        checkRateLimit(testIP, 10, 60000);
      }
      const result = checkRateLimit(testIP, 10, 60000);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should block when limit is exceeded', () => {
      // Use up all 3 requests
      for (let i = 0; i < 3; i++) {
        checkRateLimit(testIP, 3, 60000);
      }
      const result = checkRateLimit(testIP, 3, 60000);
      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should return retryAfter when blocked', () => {
      for (let i = 0; i < 3; i++) {
        checkRateLimit(testIP, 3, 60000);
      }
      const result = checkRateLimit(testIP, 3, 60000);
      expect(result.allowed).toBe(false);
      expect(result.retryAfter).toBeGreaterThan(0);
      expect(result.retryAfter).toBeLessThanOrEqual(60);
    });

    it('should handle different IPs independently', () => {
      const ip1 = '10.0.0.1';
      const ip2 = '10.0.0.2';
      clearRateLimit(ip1);
      clearRateLimit(ip2);

      // Exhaust ip1
      for (let i = 0; i < 2; i++) {
        checkRateLimit(ip1, 2, 60000);
      }
      const blocked = checkRateLimit(ip1, 2, 60000);
      expect(blocked.allowed).toBe(false);

      // ip2 should still be allowed
      const allowed = checkRateLimit(ip2, 2, 60000);
      expect(allowed.allowed).toBe(true);

      clearRateLimit(ip1);
      clearRateLimit(ip2);
    });

    it('should use default parameters', () => {
      const result = checkRateLimit(testIP);
      expect(result.allowed).toBe(true);
      expect(result.remaining).toBeGreaterThan(0);
    });
  });

  describe('getClientIP', () => {
    it('should extract IP from x-forwarded-for header', () => {
      const req = { headers: { 'x-forwarded-for': '1.2.3.4' }, socket: {} };
      expect(getClientIP(req)).toBe('1.2.3.4');
    });

    it('should take first IP from comma-separated x-forwarded-for', () => {
      const req = { headers: { 'x-forwarded-for': '1.2.3.4, 5.6.7.8' }, socket: {} };
      expect(getClientIP(req)).toBe('1.2.3.4');
    });

    it('should extract IP from x-real-ip header', () => {
      const req = { headers: { 'x-real-ip': '1.2.3.4' }, socket: {} };
      expect(getClientIP(req)).toBe('1.2.3.4');
    });

    it('should extract IP from cf-connecting-ip header (Cloudflare)', () => {
      const req = { headers: { 'cf-connecting-ip': '1.2.3.4' }, socket: {} };
      expect(getClientIP(req)).toBe('1.2.3.4');
    });

    it('should fall back to socket remoteAddress', () => {
      const req = { headers: {}, socket: { remoteAddress: '127.0.0.1' } };
      expect(getClientIP(req)).toBe('127.0.0.1');
    });

    it('should return unknown when no IP found', () => {
      const req = { headers: {}, socket: {} };
      expect(getClientIP(req)).toBe('unknown');
    });

    it('should prioritize x-forwarded-for over other headers', () => {
      const req = {
        headers: {
          'x-forwarded-for': '1.1.1.1',
          'x-real-ip': '2.2.2.2',
          'cf-connecting-ip': '3.3.3.3',
        },
        socket: { remoteAddress: '4.4.4.4' },
      };
      expect(getClientIP(req)).toBe('1.1.1.1');
    });
  });

  describe('clearRateLimit', () => {
    it('should clear rate limit for an IP', () => {
      checkRateLimit(testIP, 2, 60000);
      checkRateLimit(testIP, 2, 60000);
      const blocked = checkRateLimit(testIP, 2, 60000);
      expect(blocked.allowed).toBe(false);

      clearRateLimit(testIP);
      const allowed = checkRateLimit(testIP, 2, 60000);
      expect(allowed.allowed).toBe(true);
    });
  });

  describe('getRateLimitStats', () => {
    it('should return request count', () => {
      checkRateLimit(testIP, 10, 60000);
      checkRateLimit(testIP, 10, 60000);
      const stats = getRateLimitStats(testIP);
      expect(stats.requestCount).toBe(2);
      expect(stats.timestamps).toHaveLength(2);
    });

    it('should return empty stats for unknown IP', () => {
      const stats = getRateLimitStats('unknown-ip');
      expect(stats.requestCount).toBe(0);
      expect(stats.timestamps).toHaveLength(0);
    });
  });
});
