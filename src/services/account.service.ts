import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import { CreateAccountSchema, UpdateAccountSchema } from '@/schemas';
import type {
  Account,
  CreateAccountInput,
  UpdateAccountInput,
  AccountSummary,
  AccountTypeSummary,
  AccountBalance,
} from '@/types';

const PROJECT_ID = 'piterpay';

/**
 * Account Service
 * Handles all account-related database operations
 */
export const accountService = {
  /**
   * Get all accounts for the current user
   */
  async getAll(): Promise<Account[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_accounts')
      .select('*')
      .order('name');

    if (error) {
      console.error('[AccountService] Error fetching accounts:', error);
      throw error;
    }

    return data || [];
  },

  /**
   * Get a single account by ID
   */
  async getById(id: string): Promise<Account | null> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data, error } = await supabase
      .from('piterpay_accounts')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[AccountService] Error fetching account:', error);
      throw error;
    }

    return data;
  },

  /**
   * Create a new account
   */
  async create(userId: string, input: CreateAccountInput): Promise<Account> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = CreateAccountSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_accounts')
      .insert({
        user_id: userId,
        ...validated,
        project_id: PROJECT_ID,
      })
      .select()
      .single();

    if (error) {
      console.error('[AccountService] Error creating account:', error);
      throw error;
    }

    return data;
  },

  /**
   * Update an existing account
   */
  async update(id: string, input: UpdateAccountInput): Promise<Account> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const validated = UpdateAccountSchema.parse(input);

    const { data, error } = await supabase
      .from('piterpay_accounts')
      .update(validated)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[AccountService] Error updating account:', error);
      throw error;
    }

    return data;
  },

  /**
   * Delete an account
   */
  async delete(id: string): Promise<void> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { error } = await supabase
      .from('piterpay_accounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[AccountService] Error deleting account:', error);
      throw error;
    }
  },

  /**
   * Update account balance
   */
  async updateBalance(
    id: string,
    amount: number,
    operation: 'add' | 'subtract' | 'set'
  ): Promise<Account> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // Get current account
    const account = await this.getById(id);
    if (!account) {
      throw new Error('Account not found');
    }

    let newBalance: number;
    switch (operation) {
      case 'add':
        newBalance = account.balance + amount;
        break;
      case 'subtract':
        newBalance = account.balance - amount;
        break;
      case 'set':
        newBalance = amount;
        break;
    }

    const { data, error } = await supabase
      .from('piterpay_accounts')
      .update({ balance: newBalance })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[AccountService] Error updating balance:', error);
      throw error;
    }

    return data;
  },

  /**
   * Get account summary with totals by type
   */
  async getSummary(userId: string): Promise<AccountSummary> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    const { data: accounts, error } = await supabase
      .from('piterpay_accounts')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('[AccountService] Error fetching accounts:', error);
      throw error;
    }

    const accountList = accounts || [];
    const total_balance = accountList.reduce((sum, acc) => sum + acc.balance, 0);

    // Group by type
    const typeMap = new Map<string, { count: number; total: number }>();
    accountList.forEach(acc => {
      const existing = typeMap.get(acc.type) || { count: 0, total: 0 };
      typeMap.set(acc.type, {
        count: existing.count + 1,
        total: existing.total + acc.balance,
      });
    });

    const by_type: AccountTypeSummary[] = Array.from(typeMap.entries()).map(
      ([type, data]) => ({
        type: type as Account['type'],
        count: data.count,
        total_balance: data.total,
      })
    );

    return {
      total_balance,
      by_type,
      accounts: accountList,
    };
  },

  /**
   * Get account balances with last transaction date
   */
  async getBalances(userId: string): Promise<AccountBalance[]> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    // Get accounts
    const { data: accounts, error: accError } = await supabase
      .from('piterpay_accounts')
      .select('id, name, balance, currency')
      .eq('user_id', userId);

    if (accError) {
      console.error('[AccountService] Error fetching accounts:', accError);
      throw accError;
    }

    // Get last transaction dates
    const { data: transactions, error: txError } = await supabase
      .from('piterpay_transactions')
      .select('account_id, date')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (txError) {
      console.error('[AccountService] Error fetching transactions:', txError);
      throw txError;
    }

    // Map last transaction date to accounts
    const lastTxMap = new Map<string, string>();
    (transactions || []).forEach(tx => {
      if (tx.account_id && !lastTxMap.has(tx.account_id)) {
        lastTxMap.set(tx.account_id, tx.date);
      }
    });

    return (accounts || []).map(acc => ({
      account_id: acc.id,
      account_name: acc.name,
      balance: acc.balance,
      currency: acc.currency,
      last_transaction_date: lastTxMap.get(acc.id) || null,
    }));
  },

  /**
   * Transfer money between accounts
   */
  async transfer(
    fromAccountId: string,
    toAccountId: string,
    amount: number
  ): Promise<{ from: Account; to: Account }> {
    if (!isSupabaseConfigured()) {
      throw new Error('Supabase is not configured');
    }

    if (amount <= 0) {
      throw new Error('Transfer amount must be positive');
    }

    // Update source account
    const from = await this.updateBalance(fromAccountId, amount, 'subtract');

    // Update destination account
    const to = await this.updateBalance(toAccountId, amount, 'add');

    return { from, to };
  },
};
