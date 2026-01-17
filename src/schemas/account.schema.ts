import { z } from 'zod';

/**
 * Account validation schemas
 */

export const AccountTypeSchema = z.enum(['checking', 'savings', 'credit', 'cash']);

export const CurrencySchema = z.enum(['ILS', 'USD', 'EUR', 'GBP']);

export const AccountSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  name: z.string().min(1, 'Account name is required').max(100),
  type: AccountTypeSchema,
  balance: z.number(),
  currency: CurrencySchema.default('ILS'),
  project_id: z.string().default('piterpay'),
  created_at: z.string().datetime(),
});

export const CreateAccountSchema = z.object({
  name: z.string().min(1, 'Account name is required').max(100),
  type: AccountTypeSchema,
  balance: z.number().default(0),
  currency: CurrencySchema.default('ILS'),
});

export const UpdateAccountSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  type: AccountTypeSchema.optional(),
  balance: z.number().optional(),
  currency: CurrencySchema.optional(),
});

export const AccountBalanceUpdateSchema = z.object({
  account_id: z.string().uuid(),
  amount: z.number(),
  operation: z.enum(['add', 'subtract', 'set']),
});

// Type exports from schemas
export type AccountSchemaType = z.infer<typeof AccountSchema>;
export type CreateAccountSchemaType = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountSchemaType = z.infer<typeof UpdateAccountSchema>;
export type AccountBalanceUpdateSchemaType = z.infer<typeof AccountBalanceUpdateSchema>;
