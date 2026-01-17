import { describe, it, expect } from 'vitest';
import {
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek,
  toISODateString,
  parseISODate,
  isSameDay,
  isCurrentMonth,
  getDaysInMonth,
  addDays,
  addMonths,
} from '@/utils/date';

describe('Date Utils', () => {
  describe('getStartOfMonth', () => {
    it('should return the first day of the month', () => {
      const date = new Date('2024-01-15');
      const result = getStartOfMonth(date);
      expect(result.getDate()).toBe(1);
      expect(result.getMonth()).toBe(0); // January
      expect(result.getFullYear()).toBe(2024);
    });

    it('should use current date if not provided', () => {
      const result = getStartOfMonth();
      expect(result.getDate()).toBe(1);
    });
  });

  describe('getEndOfMonth', () => {
    it('should return the last day of the month', () => {
      const date = new Date('2024-01-15');
      const result = getEndOfMonth(date);
      expect(result.getDate()).toBe(31);
      expect(result.getMonth()).toBe(0);
    });

    it('should handle February correctly', () => {
      const date = new Date('2024-02-15');
      const result = getEndOfMonth(date);
      expect(result.getDate()).toBe(29); // 2024 is a leap year
    });
  });

  describe('getStartOfWeek', () => {
    it('should return Sunday of the current week', () => {
      const date = new Date('2024-01-17'); // Wednesday
      const result = getStartOfWeek(date);
      expect(result.getDay()).toBe(0); // Sunday
    });
  });

  describe('getEndOfWeek', () => {
    it('should return Saturday of the current week', () => {
      const date = new Date('2024-01-17'); // Wednesday
      const result = getEndOfWeek(date);
      expect(result.getDay()).toBe(6); // Saturday
    });
  });

  describe('toISODateString', () => {
    it('should format date as YYYY-MM-DD', () => {
      const date = new Date('2024-01-15T12:00:00');
      const result = toISODateString(date);
      expect(result).toBe('2024-01-15');
    });
  });

  describe('parseISODate', () => {
    it('should parse ISO date string to Date', () => {
      const result = parseISODate('2024-01-15');
      expect(result.getFullYear()).toBe(2024);
      expect(result.getMonth()).toBe(0);
      expect(result.getDate()).toBe(15);
    });
  });

  describe('isSameDay', () => {
    it('should return true for same day', () => {
      const date1 = new Date('2024-01-15T10:00:00');
      const date2 = new Date('2024-01-15T20:00:00');
      expect(isSameDay(date1, date2)).toBe(true);
    });

    it('should return false for different days', () => {
      const date1 = new Date('2024-01-15');
      const date2 = new Date('2024-01-16');
      expect(isSameDay(date1, date2)).toBe(false);
    });
  });

  describe('isCurrentMonth', () => {
    it('should return true for current month', () => {
      const now = new Date();
      expect(isCurrentMonth(now)).toBe(true);
    });

    it('should return false for different month', () => {
      const date = new Date();
      date.setMonth(date.getMonth() - 1);
      expect(isCurrentMonth(date)).toBe(false);
    });
  });

  describe('getDaysInMonth', () => {
    it('should return correct days for January', () => {
      expect(getDaysInMonth(2024, 0)).toBe(31);
    });

    it('should return correct days for February in leap year', () => {
      expect(getDaysInMonth(2024, 1)).toBe(29);
    });

    it('should return correct days for February in non-leap year', () => {
      expect(getDaysInMonth(2023, 1)).toBe(28);
    });
  });

  describe('addDays', () => {
    it('should add days correctly', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, 5);
      expect(result.getDate()).toBe(20);
    });

    it('should handle month overflow', () => {
      const date = new Date('2024-01-30');
      const result = addDays(date, 5);
      expect(result.getMonth()).toBe(1); // February
    });

    it('should handle negative days', () => {
      const date = new Date('2024-01-15');
      const result = addDays(date, -5);
      expect(result.getDate()).toBe(10);
    });
  });

  describe('addMonths', () => {
    it('should add months correctly', () => {
      const date = new Date('2024-01-15');
      const result = addMonths(date, 2);
      expect(result.getMonth()).toBe(2); // March
    });

    it('should handle year overflow', () => {
      const date = new Date('2024-11-15');
      const result = addMonths(date, 3);
      expect(result.getFullYear()).toBe(2025);
      expect(result.getMonth()).toBe(1); // February
    });
  });
});
