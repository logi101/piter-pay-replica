import { describe, it, expect } from 'vitest';
import {
  TransactionTypeSchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
  TransactionFilterSchema,
} from '@/schemas';

describe('Transaction Schemas', () => {
  describe('TransactionTypeSchema', () => {
    it('should accept valid transaction types', () => {
      expect(TransactionTypeSchema.parse('income')).toBe('income');
      expect(TransactionTypeSchema.parse('expense')).toBe('expense');
      expect(TransactionTypeSchema.parse('transfer')).toBe('transfer');
    });

    it('should reject invalid transaction types', () => {
      expect(() => TransactionTypeSchema.parse('invalid')).toThrow();
      expect(() => TransactionTypeSchema.parse('')).toThrow();
    });
  });

  describe('CreateTransactionSchema', () => {
    it('should accept valid transaction input', () => {
      const input = {
        amount: 100,
        type: 'expense',
        date: '2024-01-15',
      };
      const result = CreateTransactionSchema.parse(input);
      expect(result.amount).toBe(100);
      expect(result.type).toBe('expense');
      expect(result.date).toBe('2024-01-15');
    });

    it('should accept optional fields', () => {
      const input = {
        amount: 100,
        type: 'income',
        date: '2024-01-15',
        category: 'salary',
        description: 'Monthly salary',
        account_id: '123e4567-e89b-12d3-a456-426614174000',
      };
      const result = CreateTransactionSchema.parse(input);
      expect(result.category).toBe('salary');
      expect(result.description).toBe('Monthly salary');
    });

    it('should reject negative amounts', () => {
      const input = {
        amount: -100,
        type: 'expense',
        date: '2024-01-15',
      };
      expect(() => CreateTransactionSchema.parse(input)).toThrow();
    });

    it('should reject zero amount', () => {
      const input = {
        amount: 0,
        type: 'expense',
        date: '2024-01-15',
      };
      expect(() => CreateTransactionSchema.parse(input)).toThrow();
    });

    it('should reject invalid date format', () => {
      const input = {
        amount: 100,
        type: 'expense',
        date: '15/01/2024',
      };
      expect(() => CreateTransactionSchema.parse(input)).toThrow();
    });

    it('should reject description over 500 characters', () => {
      const input = {
        amount: 100,
        type: 'expense',
        date: '2024-01-15',
        description: 'a'.repeat(501),
      };
      expect(() => CreateTransactionSchema.parse(input)).toThrow();
    });
  });

  describe('UpdateTransactionSchema', () => {
    it('should accept partial updates', () => {
      expect(UpdateTransactionSchema.parse({ amount: 200 })).toEqual({ amount: 200 });
      expect(UpdateTransactionSchema.parse({ type: 'income' })).toEqual({ type: 'income' });
    });

    it('should accept empty object', () => {
      expect(UpdateTransactionSchema.parse({})).toEqual({});
    });

    it('should validate fields when provided', () => {
      expect(() => UpdateTransactionSchema.parse({ amount: -100 })).toThrow();
    });
  });

  describe('TransactionFilterSchema', () => {
    it('should accept valid filters', () => {
      const filter = {
        type: 'expense',
        category: 'food',
        date_from: '2024-01-01',
        date_to: '2024-01-31',
      };
      const result = TransactionFilterSchema.parse(filter);
      expect(result.type).toBe('expense');
      expect(result.category).toBe('food');
    });

    it('should accept empty filter', () => {
      expect(TransactionFilterSchema.parse({})).toEqual({});
    });

    it('should accept amount filters', () => {
      const filter = {
        min_amount: 100,
        max_amount: 500,
      };
      const result = TransactionFilterSchema.parse(filter);
      expect(result.min_amount).toBe(100);
      expect(result.max_amount).toBe(500);
    });
  });
});
