import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import {
  CreateHouseholdSchema,
  UpdateHouseholdSchema,
  CreateHouseholdProfileSchema,
  UpdateHouseholdProfileSchema,
  HouseholdSetupDataSchema,
} from '@/schemas';
import type {
  Household,
  HouseholdProfile,
  HouseholdMember,
  CreateHouseholdInput,
  UpdateHouseholdInput,
  CreateHouseholdProfileInput,
  UpdateHouseholdProfileInput,
  HouseholdSetupData,
} from '@/types';

const PROJECT_ID = 'piterpay';

/**
 * Household Service
 * Handles all household-related database operations
 */
export const householdService = {
  /**
   * Get household by ID
   */
  async getById(id: string): Promise<Household | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_households')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[HouseholdService] Error fetching household:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get household by user ID
   */
  async getByUserId(userId: string): Promise<Household | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // First get the user to find their household_id
    const { data: user, error: userError } = await supabase
      .from('piterpay_users')
      .select('household_id')
      .eq('id', userId)
      .single();

    if (userError || !user?.household_id) {
      return null;
    }

    return this.getById(user.household_id);
  },

  /**
   * Create a new household
   */
  async create(userId: string, input: CreateHouseholdInput): Promise<Household> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = CreateHouseholdSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_households')
      .insert({
        ...validated,
        created_by: userId,
        project_id: PROJECT_ID,
      })
      .select()
      .single();

    if (error) {
      console.error('[HouseholdService] Error creating household:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update a household
   */
  async update(id: string, input: UpdateHouseholdInput): Promise<Household> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = UpdateHouseholdSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_households')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[HouseholdService] Error updating household:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a household
   */
  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
      .from('piterpay_households')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[HouseholdService] Error deleting household:', error);
      throw error;
    }
  },

  /**
   * Get household profile
   */
  async getProfile(householdId: string): Promise<HouseholdProfile | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_household_profiles')
      .select('*')
      .eq('household_id', householdId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[HouseholdService] Error fetching profile:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create household profile
   */
  async createProfile(input: CreateHouseholdProfileInput): Promise<HouseholdProfile> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = CreateHouseholdProfileSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_household_profiles')
      .insert({
        ...validated,
        project_id: PROJECT_ID,
      })
      .select()
      .single();

    if (error) {
      console.error('[HouseholdService] Error creating profile:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update household profile
   */
  async updateProfile(householdId: string, input: UpdateHouseholdProfileInput): Promise<HouseholdProfile> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = UpdateHouseholdProfileSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_household_profiles')
      .update({
        ...validated,
        updated_at: new Date().toISOString(),
      })
      .eq('household_id', householdId)
      .select()
      .single();

    if (error) {
      console.error('[HouseholdService] Error updating profile:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get household members
   */
  async getMembers(householdId: string): Promise<HouseholdMember[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_household_members')
      .select('*, user:piterpay_users(id, email, display_name)')
      .eq('household_id', householdId);

    if (error) {
      console.error('[HouseholdService] Error fetching members:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Add member to household
   */
  async addMember(
    householdId: string,
    userId: string,
    role: 'admin' | 'member' | 'viewer'
  ): Promise<HouseholdMember> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_household_members')
      .insert({
        household_id: householdId,
        user_id: userId,
        role,
        project_id: PROJECT_ID,
      })
      .select()
      .single();

    if (error) {
      console.error('[HouseholdService] Error adding member:', error);
      throw error;
    }

    // Update user's household_id
    await supabase
      .from('piterpay_users')
      .update({ household_id: householdId })
      .eq('id', userId);

    return data;
  },

  /**
   * Remove member from household
   */
  async removeMember(householdId: string, userId: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
      .from('piterpay_household_members')
      .delete()
      .eq('household_id', householdId)
      .eq('user_id', userId);

    if (error) {
      console.error('[HouseholdService] Error removing member:', error);
      throw error;
    }

    // Clear user's household_id
    await supabase
      .from('piterpay_users')
      .update({ household_id: null })
      .eq('id', userId);
  },

  /**
   * Complete household setup process
   * Creates household, profile, and links user
   */
  async completeSetup(userId: string, setupData: HouseholdSetupData): Promise<{
    household: Household;
    profile: HouseholdProfile;
  }> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = HouseholdSetupDataSchema.parse(setupData);
    const { step1, step2, step3 } = validated;

    // 1. Create household
    const household = await this.create(userId, { name: step1.householdName });

    // 2. Create profile
    const profile = await this.createProfile({
      household_id: household.id,
      primary_email: step1.primaryEmail,
      phone: step1.phone,
      has_spouse: step2.hasSpouse,
      spouse_name: step2.spouseName,
      spouse_income: step2.spouseIncome,
      children_count: step2.childrenCount,
      children_ages: step2.childrenAges,
      housing_type: step3.housingType,
      monthly_housing_cost: step3.monthlyHousingCost,
      primary_employment: step3.primaryEmployment,
      total_monthly_income: step3.totalMonthlyIncome,
    });

    // 3. Add user as admin member
    await this.addMember(household.id, userId, 'admin');

    return { household, profile };
  },

  /**
   * Check if user has completed setup
   */
  async hasCompletedSetup(userId: string): Promise<boolean> {
    const household = await this.getByUserId(userId);
    return household !== null;
  },
};
