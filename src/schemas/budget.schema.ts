import { z } from 'zod';

/**
 * Budget validation schemas
 */

export const BudgetPeriodSchema = z.enum(['weekly', 'monthly', 'yearly']);

export const BudgetSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  category: z.string().min(1, 'Category is required').max(100),
  amount: z.number().positive('Budget amount must be positive'),
  period: BudgetPeriodSchema,
  project_id: z.string().default('piterpay'),
  created_at: z.string().datetime(),
});

export const CreateBudgetSchema = z.object({
  category: z.string().min(1, 'Category is required').max(100),
  amount: z.number().positive('Budget amount must be positive'),
  period: BudgetPeriodSchema.default('monthly'),
});

export const UpdateBudgetSchema = z.object({
  category: z.string().min(1).max(100).optional(),
  amount: z.number().positive('Budget amount must be positive').optional(),
  period: BudgetPeriodSchema.optional(),
});

export const BudgetAlertThresholdSchema = z.object({
  warning: z.number().min(0).max(100).default(80),
  critical: z.number().min(0).max(100).default(95),
});

// Type exports from schemas
export type BudgetSchemaType = z.infer<typeof BudgetSchema>;
export type CreateBudgetSchemaType = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudgetSchemaType = z.infer<typeof UpdateBudgetSchema>;
export type BudgetAlertThresholdSchemaType = z.infer<typeof BudgetAlertThresholdSchema>;
