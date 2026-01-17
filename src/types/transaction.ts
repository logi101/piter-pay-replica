/**
 * Transaction-related type definitions
 */

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string | null;
  amount: number;
  type: TransactionType;
  category: string | null;
  description: string | null;
  date: string;
  project_id: string;
  created_at: string;
}

export interface TransactionWithAccount extends Transaction {
  account?: {
    id: string;
    name: string;
    type: string;
  };
}

export interface CreateTransactionInput {
  account_id?: string;
  amount: number;
  type: TransactionType;
  category?: string;
  description?: string;
  date: string;
}

export interface UpdateTransactionInput {
  account_id?: string;
  amount?: number;
  type?: TransactionType;
  category?: string;
  description?: string;
  date?: string;
}

export interface TransactionFilter {
  type?: TransactionType;
  category?: string;
  account_id?: string;
  date_from?: string;
  date_to?: string;
  min_amount?: number;
  max_amount?: number;
}

export interface TransactionSummary {
  total_income: number;
  total_expense: number;
  net: number;
  by_category: CategorySummary[];
}

export interface CategorySummary {
  category: string;
  amount: number;
  count: number;
  percentage: number;
}
