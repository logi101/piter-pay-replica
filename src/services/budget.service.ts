import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { CreateBudgetSchema, UpdateBudgetSchema } from '@/schemas';
import type {
  Budget,
  CreateBudgetInput,
  UpdateBudgetInput,
  BudgetStatus,
  BudgetSummary,
  BudgetAlert,
} from '@/types';

const PROJECT_ID = 'piterpay';
const WARNING_THRESHOLD = 80;
const CRITICAL_THRESHOLD = 95;

/**
 * Budget Service
 * Handles all budget-related database operations
 */
export const budgetService = {
  /**
   * Get all budgets for the current user
   */
  async getAll(): Promise<Budget[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_budgets')
      .select('*')
      .order('category');

    if (error) {
      console.error('[BudgetService] Error fetching budgets:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a single budget by ID
   */
  async getById(id: string): Promise<Budget | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_budgets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[BudgetService] Error fetching budget:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new budget
   */
  async create(userId: string, input: CreateBudgetInput): Promise<Budget> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = CreateBudgetSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_budgets')
      .insert({
        user_id: userId,
        ...validated,
        project_id: PROJECT_ID,
      })
      .select()
      .single();

    if (error) {
      console.error('[BudgetService] Error creating budget:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update an existing budget
   */
  async update(id: string, input: UpdateBudgetInput): Promise<Budget> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = UpdateBudgetSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_budgets')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[BudgetService] Error updating budget:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a budget
   */
  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
      .from('piterpay_budgets')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[BudgetService] Error deleting budget:', error);
      throw error;
    }
  },

  /**
   * Get budget summary with spending status
   */
  async getSummary(userId: string): Promise<BudgetSummary> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // Get all budgets
    const { data: budgets, error: budgetError } = await supabase
      .from('piterpay_budgets')
      .select('*')
      .eq('user_id', userId);

    if (budgetError) {
      console.error('[BudgetService] Error fetching budgets:', budgetError);
      throw budgetError;
    }

    // Get this month's expenses
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data: expenses, error: expenseError } = await supabase
      .from('piterpay_transactions')
      .select('category, amount')
      .eq('user_id', userId)
      .eq('type', 'expense')
      .gte('date', startOfMonth.toISOString().split('T')[0]);

    if (expenseError) {
      console.error('[BudgetService] Error fetching expenses:', expenseError);
      throw expenseError;
    }

    // Calculate spending by category
    const spendingByCategory = new Map<string, number>();
    (expenses || []).forEach(e => {
      const cat = e.category || 'Uncategorized';
      spendingByCategory.set(cat, (spendingByCategory.get(cat) || 0) + e.amount);
    });

    // Calculate budget statuses
    const budgetStatuses: BudgetStatus[] = (budgets || []).map(budget => {
      const spent = spendingByCategory.get(budget.category) || 0;
      const remaining = budget.amount - spent;
      const percentage_used = budget.amount > 0 ? (spent / budget.amount) * 100 : 0;

      return {
        budget,
        spent,
        remaining,
        percentage_used,
        is_over_budget: spent > budget.amount,
      };
    });

    const total_budgeted = budgetStatuses.reduce((sum, b) => sum + b.budget.amount, 0);
    const total_spent = budgetStatuses.reduce((sum, b) => sum + b.spent, 0);

    return {
      total_budgeted,
      total_spent,
      total_remaining: total_budgeted - total_spent,
      budgets: budgetStatuses,
    };
  },

  /**
   * Get budget alerts for categories approaching or exceeding limits
   */
  async getAlerts(userId: string): Promise<BudgetAlert[]> {
    const summary = await this.getSummary(userId);
    const alerts: BudgetAlert[] = [];

    summary.budgets.forEach(status => {
      if (status.percentage_used >= 100) {
        alerts.push({
          budget_id: status.budget.id,
          category: status.budget.category,
          percentage_used: status.percentage_used,
          alert_type: 'exceeded',
          message: `Budget for ${status.budget.category} has been exceeded by ${(status.percentage_used - 100).toFixed(1)}%`,
        });
      } else if (status.percentage_used >= CRITICAL_THRESHOLD) {
        alerts.push({
          budget_id: status.budget.id,
          category: status.budget.category,
          percentage_used: status.percentage_used,
          alert_type: 'critical',
          message: `Budget for ${status.budget.category} is ${status.percentage_used.toFixed(1)}% used`,
        });
      } else if (status.percentage_used >= WARNING_THRESHOLD) {
        alerts.push({
          budget_id: status.budget.id,
          category: status.budget.category,
          percentage_used: status.percentage_used,
          alert_type: 'warning',
          message: `Budget for ${status.budget.category} is ${status.percentage_used.toFixed(1)}% used`,
        });
      }
    });

    return alerts;
  },
};
