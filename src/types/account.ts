/**
 * Account-related type definitions
 */

export type AccountType = 'checking' | 'savings' | 'credit' | 'cash';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  type: AccountType;
  balance: number;
  currency: string;
  project_id: string;
  created_at: string;
}

export interface CreateAccountInput {
  name: string;
  type: AccountType;
  balance?: number;
  currency?: string;
}

export interface UpdateAccountInput {
  name?: string;
  type?: AccountType;
  balance?: number;
  currency?: string;
}

export interface AccountSummary {
  total_balance: number;
  by_type: AccountTypeSummary[];
  accounts: Account[];
}

export interface AccountTypeSummary {
  type: AccountType;
  count: number;
  total_balance: number;
}

export interface AccountBalance {
  account_id: string;
  account_name: string;
  balance: number;
  currency: string;
  last_transaction_date: string | null;
}
