import { describe, it, expect } from 'vitest';
import {
  sanitizeTextInput,
  sanitizeEmail,
  sanitizeName,
  sanitizeBudget,
  isValidEmail,
  isValidName,
  isValidBudget,
} from '../inputValidator';

describe('Input Validator', () => {
  describe('sanitizeTextInput', () => {
    it('should remove script tags', () => {
      const input = '<script>alert("xss")</script>Hello';
      const result = sanitizeTextInput(input);
      expect(result).not.toContain('<script>');
      expect(result).toContain('Hello');
    });

    it('should remove all HTML tags', () => {
      const input = '<div>Hello <span>World</span></div>';
      const result = sanitizeTextInput(input);
      expect(result).not.toContain('<div>');
      expect(result).not.toContain('<span>');
      expect(result).toContain('Hello World');
    });

    it('should remove javascript: protocol', () => {
      const input = 'javascript:alert(1)';
      const result = sanitizeTextInput(input);
      expect(result).not.toContain('javascript:');
    });

    it('should remove data: protocol', () => {
      const input = 'data:text/html,<script>alert(1)</script>';
      const result = sanitizeTextInput(input);
      expect(result).not.toContain('data:');
    });

    it('should remove prompt injection patterns', () => {
      const inputs = [
        'ignore previous instructions',
        'forget everything',
        'system: do something',
      ];

      inputs.forEach((input) => {
        const result = sanitizeTextInput(input);
        expect(result.toLowerCase()).not.toContain('ignore previous');
        expect(result.toLowerCase()).not.toContain('forget everything');
        expect(result.toLowerCase()).not.toContain('system:');
      });
    });

    it('should escape quotes', () => {
      const input = 'Test "quotes" and \'apostrophes\'';
      const result = sanitizeTextInput(input);
      expect(result).toContain('\\"');
      expect(result).toContain("\\'");
    });

    it('should truncate to max length', () => {
      const input = 'a'.repeat(1000);
      const result = sanitizeTextInput(input, 100);
      expect(result.length).toBe(100);
    });

    it('should return empty string for invalid input', () => {
      expect(sanitizeTextInput(null)).toBe('');
      expect(sanitizeTextInput(undefined)).toBe('');
      expect(sanitizeTextInput(123)).toBe('');
      expect(sanitizeTextInput({})).toBe('');
    });

    it('should trim whitespace', () => {
      const input = '  Hello World  ';
      const result = sanitizeTextInput(input);
      expect(result).toBe('Hello World');
    });
  });

  describe('isValidEmail', () => {
    it('should accept valid email addresses', () => {
      const validEmails = [
        'test@example.com',
        'user.name@example.com',
        'user+tag@example.co.uk',
      ];

      validEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(true);
      });
    });

    it('should reject invalid email addresses', () => {
      const invalidEmails = [
        'invalid',
        '@example.com',
        'user@',
        'user @example.com',
        '',
        null,
        undefined,
      ];

      invalidEmails.forEach((email) => {
        expect(isValidEmail(email)).toBe(false);
      });
    });

    it('should reject emails exceeding max length', () => {
      const longEmail = 'a'.repeat(250) + '@example.com';
      expect(isValidEmail(longEmail)).toBe(false);
    });
  });

  describe('sanitizeEmail', () => {
    it('should trim and lowercase email', () => {
      const input = '  TeSt@ExAmPlE.CoM  ';
      const result = sanitizeEmail(input);
      expect(result).toBe('test@example.com');
    });

    it('should truncate to max length', () => {
      const input = 'a'.repeat(300) + '@example.com';
      const result = sanitizeEmail(input);
      expect(result.length).toBeLessThanOrEqual(254);
    });

    it('should return empty string for invalid input', () => {
      expect(sanitizeEmail(null)).toBe('');
      expect(sanitizeEmail(undefined)).toBe('');
      expect(sanitizeEmail('')).toBe('');
    });
  });

  describe('isValidName', () => {
    it('should accept valid names', () => {
      const validNames = [
        'John Doe',
        'Anna-Maria',
        "O'Brien",
        'Åsa Öberg',
        'Jean-François',
      ];

      validNames.forEach((name) => {
        expect(isValidName(name)).toBe(true);
      });
    });

    it('should reject invalid names', () => {
      const invalidNames = [
        'A', // too short
        '123', // numbers
        '<script>',
        'Name@123',
        '',
        null,
        undefined,
      ];

      invalidNames.forEach((name) => {
        expect(isValidName(name)).toBe(false);
      });
    });

    it('should reject names exceeding max length', () => {
      const longName = 'a'.repeat(101);
      expect(isValidName(longName)).toBe(false);
    });
  });

  describe('sanitizeName', () => {
    it('should remove HTML tags', () => {
      const input = '<div>John</div> Doe';
      const result = sanitizeName(input);
      expect(result).not.toContain('<div>');
      expect(result).toContain('John Doe');
    });

    it('should remove angle brackets', () => {
      const input = 'John <> Doe';
      const result = sanitizeName(input);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });

    it('should trim whitespace', () => {
      const input = '  John Doe  ';
      const result = sanitizeName(input);
      expect(result).toBe('John Doe');
    });

    it('should truncate to max length', () => {
      const input = 'a'.repeat(200);
      const result = sanitizeName(input);
      expect(result.length).toBeLessThanOrEqual(100);
    });
  });

  describe('isValidBudget', () => {
    it('should accept valid budget values', () => {
      expect(isValidBudget(5000)).toBe(true);
      expect(isValidBudget('10000')).toBe(true);
      expect(isValidBudget('0')).toBe(true);
      expect(isValidBudget(null)).toBe(true); // Optional field
      expect(isValidBudget('')).toBe(true); // Optional field
    });

    it('should reject invalid budget values', () => {
      expect(isValidBudget('abc')).toBe(false);
      expect(isValidBudget(-100)).toBe(false);
      expect(isValidBudget(99999999999)).toBe(false); // Exceeds max
    });
  });

  describe('sanitizeBudget', () => {
    it('should remove non-digit characters', () => {
      const input = '5,000 kr';
      const result = sanitizeBudget(input);
      expect(result).toBe('5000');
    });

    it('should handle numeric input', () => {
      const result = sanitizeBudget(5000);
      expect(result).toBe('5000');
    });

    it('should enforce max budget', () => {
      const result = sanitizeBudget('999999999999');
      expect(parseInt(result, 10)).toBeLessThanOrEqual(10000000);
    });

    it('should return empty string for invalid input', () => {
      expect(sanitizeBudget(null)).toBe('');
      expect(sanitizeBudget('')).toBe('');
      expect(sanitizeBudget('abc')).toBe('');
    });
  });
});
