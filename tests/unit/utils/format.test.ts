import { describe, it, expect } from 'vitest';
import {
  formatCurrency,
  formatDate,
  formatShortDate,
  formatPercent,
  formatNumber,
} from '@/utils/format';

describe('Format Utils', () => {
  describe('formatCurrency', () => {
    it('should format ILS currency correctly', () => {
      const result = formatCurrency(1000, 'ILS', 'he-IL');
      expect(result).toContain('1,000');
      expect(result).toContain('₪');
    });

    it('should format USD currency correctly', () => {
      const result = formatCurrency(1000, 'USD', 'en-US');
      expect(result).toContain('$');
      expect(result).toContain('1,000');
    });

    it('should handle zero', () => {
      const result = formatCurrency(0);
      expect(result).toContain('0');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-500);
      expect(result).toContain('500');
    });

    it('should handle decimal numbers', () => {
      const result = formatCurrency(99.99);
      expect(result).toBeDefined();
    });
  });

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date);
      expect(result).toBeDefined();
      expect(typeof result).toBe('string');
    });

    it('should accept string dates', () => {
      const result = formatDate('2024-01-15');
      expect(result).toBeDefined();
    });

    it('should accept custom options', () => {
      const date = new Date('2024-01-15');
      const result = formatDate(date, { month: 'short' });
      expect(result).toBeDefined();
    });
  });

  describe('formatShortDate', () => {
    it('should format date as DD/MM/YYYY', () => {
      const date = new Date('2024-01-15');
      const result = formatShortDate(date);
      expect(result).toMatch(/\d{1,2}[./]\d{1,2}[./]\d{4}/);
    });

    it('should accept string dates', () => {
      const result = formatShortDate('2024-01-15');
      expect(result).toBeDefined();
    });
  });

  describe('formatPercent', () => {
    it('should format percentage with default decimals', () => {
      const result = formatPercent(75.5);
      expect(result).toBe('75.5%');
    });

    it('should format percentage with custom decimals', () => {
      const result = formatPercent(75.555, 2);
      expect(result).toBe('75.56%');
    });

    it('should handle zero', () => {
      const result = formatPercent(0);
      expect(result).toBe('0.0%');
    });

    it('should handle 100%', () => {
      const result = formatPercent(100);
      expect(result).toBe('100.0%');
    });
  });

  describe('formatNumber', () => {
    it('should format number with thousand separators', () => {
      const result = formatNumber(1000000);
      expect(result).toContain('1');
      expect(result.length).toBeGreaterThan(6); // Has separators
    });

    it('should handle zero', () => {
      const result = formatNumber(0);
      expect(result).toBe('0');
    });

    it('should handle negative numbers', () => {
      const result = formatNumber(-1000);
      expect(result).toContain('1,000');
    });
  });
});
