import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { CreateTransactionSchema, UpdateTransactionSchema, TransactionFilterSchema } from '@/schemas';
import type {
  Transaction,
  TransactionWithAccount,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
  TransactionSummary,
} from '@/types';

const PROJECT_ID = 'piterpay';

/**
 * Transaction Service
 * Handles all transaction-related database operations
 */
export const transactionService = {
  /**
   * Get all transactions for the current user
   */
  async getAll(filter?: TransactionFilter): Promise<TransactionWithAccount[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    let query = supabase
      .from('piterpay_transactions')
      .select('*, account:piterpay_accounts(id, name, type)')
      .order('date', { ascending: false });

    if (filter) {
      const validated = TransactionFilterSchema.parse(filter);

      if (validated.type) {
        query = query.eq('type', validated.type);
      }
      if (validated.category) {
        query = query.eq('category', validated.category);
      }
      if (validated.account_id) {
        query = query.eq('account_id', validated.account_id);
      }
      if (validated.date_from) {
        query = query.gte('date', validated.date_from);
      }
      if (validated.date_to) {
        query = query.lte('date', validated.date_to);
      }
      if (validated.min_amount) {
        query = query.gte('amount', validated.min_amount);
      }
      if (validated.max_amount) {
        query = query.lte('amount', validated.max_amount);
      }
    }

    const { data, error } = await query;

    if (error) {
      console.error('[TransactionService] Error fetching transactions:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a single transaction by ID
   */
  async getById(id: string): Promise<Transaction | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[TransactionService] Error fetching transaction:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new transaction
   */
  async create(userId: string, input: CreateTransactionInput): Promise<Transaction> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = CreateTransactionSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_transactions')
      .insert({
        user_id: userId,
        ...validated,
        project_id: PROJECT_ID,
      })
      .select()
      .single();

    if (error) {
      console.error('[TransactionService] Error creating transaction:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update an existing transaction
   */
  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = UpdateTransactionSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_transactions')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[TransactionService] Error updating transaction:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete a transaction
   */
  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
      .from('piterpay_transactions')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[TransactionService] Error deleting transaction:', error);
      throw error;
    }
  },

  /**
   * Get transaction summary for the current month
   */
  async getMonthlySummary(userId: string): Promise<TransactionSummary> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('piterpay_transactions')
      .select('amount, type, category')
      .eq('user_id', userId)
      .gte('date', startOfMonth.toISOString().split('T')[0]);

    if (error) {
      console.error('[TransactionService] Error fetching summary:', error);
      throw error;
    }

    const transactions = data || [];
    const total_income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const total_expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    // Group by category
    const categoryMap = new Map<string, { amount: number; count: number }>();
    transactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        const cat = t.category || 'Uncategorized';
        const existing = categoryMap.get(cat) || { amount: 0, count: 0 };
        categoryMap.set(cat, {
          amount: existing.amount + t.amount,
          count: existing.count + 1,
        });
      });

    const by_category = Array.from(categoryMap.entries()).map(([category, data]) => ({
      category,
      amount: data.amount,
      count: data.count,
      percentage: total_expense > 0 ? (data.amount / total_expense) * 100 : 0,
    }));

    return {
      total_income,
      total_expense,
      net: total_income - total_expense,
      by_category,
    };
  },
};
