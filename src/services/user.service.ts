import { supabase, isSupabaseConfigured, signInWithPassword, signOut, getCurrentUser } from '@/integrations/supabase/client';
import type { PiterPayUser, UserProfile, LoginCredentials } from '@/types';

const PROJECT_ID = 'piterpay';

/**
 * User Service
 * Handles all user-related operations
 */
export const userService = {
  /**
   * Sign in with email and password
   */
  async login(credentials: LoginCredentials): Promise<PiterPayUser> {
    const { user, error } = await signInWithPassword(
      credentials.email,
      credentials.password
    );

    if (error) {
      console.error('[UserService] Login error:', error);
      throw error;
    }

    if (!user) {
      throw new Error('Login failed - no user returned');
    }

    // Get or create PiterPay user profile
    const profile = await this.getOrCreateProfile(user.id, user.email || '');
    return profile;
  },

  /**
   * Sign out current user
   */
  async logout(): Promise<void> {
    await signOut();
  },

  /**
   * Get current authenticated user's profile
   */
  async getCurrentProfile(): Promise<PiterPayUser | null> {
    const authUser = await getCurrentUser();
    if (!authUser) {
      return null;
    }

    return this.getProfileByAuthId(authUser.id);
  },

  /**
   * Get user profile by auth user ID
   */
  async getProfileByAuthId(authUserId: string): Promise<PiterPayUser | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_users')
      .select('*')
      .eq('auth_user_id', authUserId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[UserService] Error fetching profile:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get user profile by ID
   */
  async getById(id: string): Promise<PiterPayUser | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[UserService] Error fetching user:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get or create PiterPay user profile
   */
  async getOrCreateProfile(
    authUserId: string,
    email: string
  ): Promise<PiterPayUser> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // Try to get existing profile
    const existing = await this.getProfileByAuthId(authUserId);
    if (existing) {
      return existing;
    }

    // Create new profile
    const { data, error } = await supabase
      .from('piterpay_users')
      .insert({
        auth_user_id: authUserId,
        email,
        project_id: PROJECT_ID,
      })
      .select()
      .single();

    if (error) {
      console.error('[UserService] Error creating profile:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update user profile
   */
  async updateProfile(
    id: string,
    updates: { display_name?: string; email?: string }
  ): Promise<PiterPayUser> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[UserService] Error updating profile:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete user profile (soft delete - mark as inactive)
   */
  async deleteProfile(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // For now, we just delete the profile
    // In production, consider soft delete
    const { error } = await supabase
      .from('piterpay_users')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[UserService] Error deleting profile:', error);
      throw error;
    }
  },

  /**
   * Get user's display profile (public info)
   */
  async getDisplayProfile(id: string): Promise<UserProfile | null> {
    const user = await this.getById(id);
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      createdAt: new Date(user.created_at),
    };
  },

  /**
   * Check if user exists by email
   */
  async existsByEmail(email: string): Promise<boolean> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_users')
      .select('id')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return false;
      }
      throw error;
    }

    return !!data;
  },

  /**
   * Get user statistics
   */
  async getStats(userId: string): Promise<{
    totalAccounts: number;
    totalTransactions: number;
    totalBudgets: number;
    memberSince: Date;
  }> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // Get user
    const user = await this.getById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Get counts in parallel
    const [accountsResult, transactionsResult, budgetsResult] = await Promise.all([
      supabase
        .from('piterpay_accounts')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabase
        .from('piterpay_transactions')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
      supabase
        .from('piterpay_budgets')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', userId),
    ]);

    return {
      totalAccounts: accountsResult.count || 0,
      totalTransactions: transactionsResult.count || 0,
      totalBudgets: budgetsResult.count || 0,
      memberSince: new Date(user.created_at),
    };
  },
};
