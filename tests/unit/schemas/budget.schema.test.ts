import { describe, it, expect } from 'vitest';
import {
  BudgetPeriodSchema,
  CreateBudgetSchema,
  UpdateBudgetSchema,
  BudgetAlertThresholdSchema,
} from '@/schemas';

describe('Budget Schemas', () => {
  describe('BudgetPeriodSchema', () => {
    it('should accept valid periods', () => {
      expect(BudgetPeriodSchema.parse('weekly')).toBe('weekly');
      expect(BudgetPeriodSchema.parse('monthly')).toBe('monthly');
      expect(BudgetPeriodSchema.parse('yearly')).toBe('yearly');
    });

    it('should reject invalid periods', () => {
      expect(() => BudgetPeriodSchema.parse('daily')).toThrow();
      expect(() => BudgetPeriodSchema.parse('')).toThrow();
    });
  });

  describe('CreateBudgetSchema', () => {
    it('should accept valid budget input', () => {
      const input = {
        category: 'food',
        amount: 2000,
      };
      const result = CreateBudgetSchema.parse(input);
      expect(result.category).toBe('food');
      expect(result.amount).toBe(2000);
      expect(result.period).toBe('monthly'); // default
    });

    it('should accept all fields', () => {
      const input = {
        category: 'transportation',
        amount: 500,
        period: 'weekly',
      };
      const result = CreateBudgetSchema.parse(input);
      expect(result.period).toBe('weekly');
    });

    it('should reject empty category', () => {
      const input = {
        category: '',
        amount: 1000,
      };
      expect(() => CreateBudgetSchema.parse(input)).toThrow();
    });

    it('should reject negative amount', () => {
      const input = {
        category: 'food',
        amount: -100,
      };
      expect(() => CreateBudgetSchema.parse(input)).toThrow();
    });

    it('should reject zero amount', () => {
      const input = {
        category: 'food',
        amount: 0,
      };
      expect(() => CreateBudgetSchema.parse(input)).toThrow();
    });

    it('should reject category over 100 characters', () => {
      const input = {
        category: 'a'.repeat(101),
        amount: 1000,
      };
      expect(() => CreateBudgetSchema.parse(input)).toThrow();
    });
  });

  describe('UpdateBudgetSchema', () => {
    it('should accept partial updates', () => {
      expect(UpdateBudgetSchema.parse({ amount: 3000 })).toEqual({ amount: 3000 });
      expect(UpdateBudgetSchema.parse({ period: 'yearly' })).toEqual({ period: 'yearly' });
    });

    it('should accept empty object', () => {
      expect(UpdateBudgetSchema.parse({})).toEqual({});
    });

    it('should validate fields when provided', () => {
      expect(() => UpdateBudgetSchema.parse({ amount: -100 })).toThrow();
    });
  });

  describe('BudgetAlertThresholdSchema', () => {
    it('should accept valid thresholds', () => {
      const input = {
        warning: 75,
        critical: 90,
      };
      const result = BudgetAlertThresholdSchema.parse(input);
      expect(result.warning).toBe(75);
      expect(result.critical).toBe(90);
    });

    it('should use defaults', () => {
      const result = BudgetAlertThresholdSchema.parse({});
      expect(result.warning).toBe(80);
      expect(result.critical).toBe(95);
    });

    it('should reject values over 100', () => {
      expect(() => BudgetAlertThresholdSchema.parse({ warning: 101 })).toThrow();
    });

    it('should reject negative values', () => {
      expect(() => BudgetAlertThresholdSchema.parse({ warning: -10 })).toThrow();
    });
  });
});
