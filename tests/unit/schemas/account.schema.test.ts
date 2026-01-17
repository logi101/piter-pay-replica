import { describe, it, expect } from 'vitest';
import {
  AccountTypeSchema,
  CurrencySchema,
  CreateAccountSchema,
  UpdateAccountSchema,
} from '@/schemas';

describe('Account Schemas', () => {
  describe('AccountTypeSchema', () => {
    it('should accept valid account types', () => {
      expect(AccountTypeSchema.parse('checking')).toBe('checking');
      expect(AccountTypeSchema.parse('savings')).toBe('savings');
      expect(AccountTypeSchema.parse('credit')).toBe('credit');
      expect(AccountTypeSchema.parse('cash')).toBe('cash');
    });

    it('should reject invalid account types', () => {
      expect(() => AccountTypeSchema.parse('invalid')).toThrow();
      expect(() => AccountTypeSchema.parse('')).toThrow();
    });
  });

  describe('CurrencySchema', () => {
    it('should accept valid currencies', () => {
      expect(CurrencySchema.parse('ILS')).toBe('ILS');
      expect(CurrencySchema.parse('USD')).toBe('USD');
      expect(CurrencySchema.parse('EUR')).toBe('EUR');
      expect(CurrencySchema.parse('GBP')).toBe('GBP');
    });

    it('should reject invalid currencies', () => {
      expect(() => CurrencySchema.parse('XXX')).toThrow();
      expect(() => CurrencySchema.parse('ils')).toThrow(); // lowercase
    });
  });

  describe('CreateAccountSchema', () => {
    it('should accept valid account input', () => {
      const input = {
        name: 'My Checking',
        type: 'checking',
      };
      const result = CreateAccountSchema.parse(input);
      expect(result.name).toBe('My Checking');
      expect(result.type).toBe('checking');
      expect(result.balance).toBe(0); // default
      expect(result.currency).toBe('ILS'); // default
    });

    it('should accept all fields', () => {
      const input = {
        name: 'Savings Account',
        type: 'savings',
        balance: 1000,
        currency: 'USD',
      };
      const result = CreateAccountSchema.parse(input);
      expect(result.balance).toBe(1000);
      expect(result.currency).toBe('USD');
    });

    it('should reject empty name', () => {
      const input = {
        name: '',
        type: 'checking',
      };
      expect(() => CreateAccountSchema.parse(input)).toThrow();
    });

    it('should reject name over 100 characters', () => {
      const input = {
        name: 'a'.repeat(101),
        type: 'checking',
      };
      expect(() => CreateAccountSchema.parse(input)).toThrow();
    });

    it('should allow negative balance (for credit accounts)', () => {
      const input = {
        name: 'Credit Card',
        type: 'credit',
        balance: -500,
      };
      const result = CreateAccountSchema.parse(input);
      expect(result.balance).toBe(-500);
    });
  });

  describe('UpdateAccountSchema', () => {
    it('should accept partial updates', () => {
      expect(UpdateAccountSchema.parse({ name: 'New Name' })).toEqual({ name: 'New Name' });
      expect(UpdateAccountSchema.parse({ balance: 500 })).toEqual({ balance: 500 });
    });

    it('should accept empty object', () => {
      expect(UpdateAccountSchema.parse({})).toEqual({});
    });

    it('should validate fields when provided', () => {
      expect(() => UpdateAccountSchema.parse({ name: '' })).toThrow();
    });
  });
});
