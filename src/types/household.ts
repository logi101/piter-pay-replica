/**
 * Household-related type definitions
 * Based on PiterPay specification
 */

// Housing type options
export type HousingType = 'owner' | 'renter' | 'with_parents' | 'other';

// Employment type options
export type EmploymentType = 'employed' | 'self_employed' | 'unemployed' | 'retired' | 'student';

// Member role in household
export type HouseholdMemberRole = 'admin' | 'member' | 'viewer';

/**
 * Household - represents a family unit
 */
export interface Household {
  id: string;
  name: string;
  created_by: string; // user_id of creator
  project_id: string;
  created_at: string;
  updated_at: string | null;
}

/**
 * HouseholdProfile - detailed profile of the household
 */
export interface HouseholdProfile {
  id: string;
  household_id: string;

  // Contact info
  primary_email: string;
  phone: string | null;

  // Financial info
  total_monthly_income: number;

  // Housing info
  housing_type: HousingType;
  monthly_housing_cost: number; // rent or mortgage

  // Family info
  has_spouse: boolean;
  spouse_name: string | null;
  spouse_income: number | null;
  children_count: number;
  children_ages: number[] | null;

  // Employment
  primary_employment: EmploymentType;
  secondary_employment: EmploymentType | null;

  // Metadata
  project_id: string;
  created_at: string;
  updated_at: string | null;
}

/**
 * HouseholdMember - links users to households
 */
export interface HouseholdMember {
  id: string;
  household_id: string;
  user_id: string;
  role: HouseholdMemberRole;
  joined_at: string;
  project_id: string;
}

/**
 * HouseholdInvitation - pending invitations
 */
export interface HouseholdInvitation {
  id: string;
  household_id: string;
  email: string;
  role: HouseholdMemberRole;
  invited_by: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  expires_at: string;
  created_at: string;
}

// Input types for creating/updating

export interface CreateHouseholdInput {
  name: string;
}

export interface UpdateHouseholdInput {
  name?: string;
}

export interface CreateHouseholdProfileInput {
  household_id: string;
  primary_email: string;
  phone?: string;
  total_monthly_income?: number;
  housing_type?: HousingType;
  monthly_housing_cost?: number;
  has_spouse?: boolean;
  spouse_name?: string;
  spouse_income?: number;
  children_count?: number;
  children_ages?: number[];
  primary_employment?: EmploymentType;
  secondary_employment?: EmploymentType;
}

export interface UpdateHouseholdProfileInput {
  primary_email?: string;
  phone?: string;
  total_monthly_income?: number;
  housing_type?: HousingType;
  monthly_housing_cost?: number;
  has_spouse?: boolean;
  spouse_name?: string;
  spouse_income?: number;
  children_count?: number;
  children_ages?: number[];
  primary_employment?: EmploymentType;
  secondary_employment?: EmploymentType;
}

// Setup wizard steps data
export interface HouseholdSetupStep1Data {
  householdName: string;
  primaryEmail: string;
  phone: string;
}

export interface HouseholdSetupStep2Data {
  hasSpouse: boolean;
  spouseName: string;
  spouseIncome: number;
  childrenCount: number;
  childrenAges: number[];
}

export interface HouseholdSetupStep3Data {
  housingType: HousingType;
  monthlyHousingCost: number;
  primaryEmployment: EmploymentType;
  totalMonthlyIncome: number;
}

export interface HouseholdSetupData {
  step1: HouseholdSetupStep1Data;
  step2: HouseholdSetupStep2Data;
  step3: HouseholdSetupStep3Data;
}
