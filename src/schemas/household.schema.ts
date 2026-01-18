/**
 * Household-related Zod schemas for validation
 */

import { z } from 'zod';

// Enums
export const HousingTypeSchema = z.enum(['owner', 'renter', 'with_parents', 'other']);
export const EmploymentTypeSchema = z.enum(['employed', 'self_employed', 'unemployed', 'retired', 'student']);
export const HouseholdMemberRoleSchema = z.enum(['admin', 'member', 'viewer']);
export const InvitationStatusSchema = z.enum(['pending', 'accepted', 'declined', 'expired']);

// Household schemas
export const CreateHouseholdSchema = z.object({
  name: z.string().min(2, 'שם משק הבית חייב להכיל לפחות 2 תווים').max(100),
});

export const UpdateHouseholdSchema = z.object({
  name: z.string().min(2).max(100).optional(),
});

// HouseholdProfile schemas
export const CreateHouseholdProfileSchema = z.object({
  household_id: z.string().uuid(),
  primary_email: z.string().email('כתובת אימייל לא תקינה'),
  phone: z.string().optional(),
  total_monthly_income: z.number().min(0, 'הכנסה חייבת להיות חיובית').optional(),
  housing_type: HousingTypeSchema.optional(),
  monthly_housing_cost: z.number().min(0).optional(),
  has_spouse: z.boolean().optional(),
  spouse_name: z.string().optional(),
  spouse_income: z.number().min(0).optional(),
  children_count: z.number().int().min(0).max(20).optional(),
  children_ages: z.array(z.number().int().min(0).max(120)).optional(),
  primary_employment: EmploymentTypeSchema.optional(),
  secondary_employment: EmploymentTypeSchema.optional(),
});

export const UpdateHouseholdProfileSchema = z.object({
  primary_email: z.string().email().optional(),
  phone: z.string().optional(),
  total_monthly_income: z.number().min(0).optional(),
  housing_type: HousingTypeSchema.optional(),
  monthly_housing_cost: z.number().min(0).optional(),
  has_spouse: z.boolean().optional(),
  spouse_name: z.string().optional(),
  spouse_income: z.number().min(0).optional(),
  children_count: z.number().int().min(0).max(20).optional(),
  children_ages: z.array(z.number().int().min(0).max(120)).optional(),
  primary_employment: EmploymentTypeSchema.optional(),
  secondary_employment: EmploymentTypeSchema.optional(),
});

// Setup wizard step schemas
export const HouseholdSetupStep1Schema = z.object({
  householdName: z.string().min(2, 'שם משק הבית חייב להכיל לפחות 2 תווים'),
  primaryEmail: z.string().email('כתובת אימייל לא תקינה'),
  phone: z.string().optional(),
});

export const HouseholdSetupStep2Schema = z.object({
  hasSpouse: z.boolean(),
  spouseName: z.string().optional(),
  spouseIncome: z.number().min(0).default(0),
  childrenCount: z.number().int().min(0).max(20).default(0),
  childrenAges: z.array(z.number().int().min(0).max(120)).default([]),
});

export const HouseholdSetupStep3Schema = z.object({
  housingType: HousingTypeSchema,
  monthlyHousingCost: z.number().min(0),
  primaryEmployment: EmploymentTypeSchema,
  totalMonthlyIncome: z.number().min(0, 'הכנסה חייבת להיות חיובית'),
});

// Combined setup data
export const HouseholdSetupDataSchema = z.object({
  step1: HouseholdSetupStep1Schema,
  step2: HouseholdSetupStep2Schema,
  step3: HouseholdSetupStep3Schema,
});

// Invitation schema
export const CreateInvitationSchema = z.object({
  household_id: z.string().uuid(),
  email: z.string().email('כתובת אימייל לא תקינה'),
  role: HouseholdMemberRoleSchema.default('member'),
});

// Type exports from schemas
export type CreateHouseholdInput = z.infer<typeof CreateHouseholdSchema>;
export type UpdateHouseholdInput = z.infer<typeof UpdateHouseholdSchema>;
export type CreateHouseholdProfileInput = z.infer<typeof CreateHouseholdProfileSchema>;
export type UpdateHouseholdProfileInput = z.infer<typeof UpdateHouseholdProfileSchema>;
export type HouseholdSetupStep1Input = z.infer<typeof HouseholdSetupStep1Schema>;
export type HouseholdSetupStep2Input = z.infer<typeof HouseholdSetupStep2Schema>;
export type HouseholdSetupStep3Input = z.infer<typeof HouseholdSetupStep3Schema>;
export type HouseholdSetupDataInput = z.infer<typeof HouseholdSetupDataSchema>;
