/**
 * Budget-related type definitions
 */

export type BudgetPeriod = 'weekly' | 'monthly' | 'yearly';

export interface Budget {
  id: string;
  user_id: string;
  category: string;
  amount: number;
  period: BudgetPeriod;
  project_id: string;
  created_at: string;
}

export interface CreateBudgetInput {
  category: string;
  amount: number;
  period: BudgetPeriod;
}

export interface UpdateBudgetInput {
  category?: string;
  amount?: number;
  period?: BudgetPeriod;
}

export interface BudgetStatus {
  budget: Budget;
  spent: number;
  remaining: number;
  percentage_used: number;
  is_over_budget: boolean;
}

export interface BudgetSummary {
  total_budgeted: number;
  total_spent: number;
  total_remaining: number;
  budgets: BudgetStatus[];
}

export interface BudgetAlert {
  budget_id: string;
  category: string;
  percentage_used: number;
  alert_type: 'warning' | 'critical' | 'exceeded';
  message: string;
}
