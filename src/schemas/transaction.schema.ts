import { z } from 'zod';

/**
 * Transaction validation schemas
 */

export const TransactionTypeSchema = z.enum(['income', 'expense', 'transfer']);

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  account_id: z.string().uuid().nullable(),
  amount: z.number().positive('Amount must be positive'),
  type: TransactionTypeSchema,
  category: z.string().max(100).nullable(),
  description: z.string().max(500).nullable(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  project_id: z.string().default('piterpay'),
  created_at: z.string().datetime(),
});

export const CreateTransactionSchema = z.object({
  account_id: z.string().uuid().optional(),
  amount: z.number().positive('Amount must be positive'),
  type: TransactionTypeSchema,
  category: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
});

export const UpdateTransactionSchema = z.object({
  account_id: z.string().uuid().optional(),
  amount: z.number().positive('Amount must be positive').optional(),
  type: TransactionTypeSchema.optional(),
  category: z.string().max(100).optional(),
  description: z.string().max(500).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
});

export const TransactionFilterSchema = z.object({
  type: TransactionTypeSchema.optional(),
  category: z.string().optional(),
  account_id: z.string().uuid().optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  min_amount: z.number().positive().optional(),
  max_amount: z.number().positive().optional(),
});

// Type exports from schemas
export type TransactionSchemaType = z.infer<typeof TransactionSchema>;
export type CreateTransactionSchemaType = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionSchemaType = z.infer<typeof UpdateTransactionSchema>;
export type TransactionFilterSchemaType = z.infer<typeof TransactionFilterSchema>;
