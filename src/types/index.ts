/**
 * Central type exports
 */

// User types
export type {
  PiterPayUser,
  UserProfile,
  AuthState,
  LoginCredentials,
  SignupCredentials,
  AuthAction,
} from './user';

// Transaction types
export type {
  Transaction,
  TransactionWithAccount,
  TransactionType,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilter,
  TransactionSummary,
  CategorySummary,
} from './transaction';

// Account types
export type {
  Account,
  AccountType,
  CreateAccountInput,
  UpdateAccountInput,
  AccountSummary,
  AccountTypeSummary,
  AccountBalance,
} from './account';

// Budget types
export type {
  Budget,
  BudgetPeriod,
  CreateBudgetInput,
  UpdateBudgetInput,
  BudgetStatus,
  BudgetSummary,
  BudgetAlert,
} from './budget';

// Common types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiResponse<T> {
  data: T | null;
  error: ApiError | null;
}
