"use client";

import { useState, useEffect, useCallback } from "react";
import { transactionService, budgetService } from "@/services";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import type { TransactionSummary, BudgetSummary } from "@/types";

interface DashboardData {
  transactionSummary: TransactionSummary | null;
  budgetSummary: BudgetSummary | null;
  recentTransactions: Array<{
    id: string;
    description: string | null;
    amount: number;
    type: string;
    category: string | null;
    date: string;
  }>;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

// Mock data for demo mode
const mockTransactionSummary: TransactionSummary = {
  total_income: 15000,
  total_expense: 8500,
  net: 6500,
  by_category: [
    { category: "מזון", amount: 2500, count: 15, percentage: 29.4 },
    { category: "תחבורה", amount: 1800, count: 8, percentage: 21.2 },
    { category: "בילויים", amount: 1200, count: 6, percentage: 14.1 },
    { category: "חשבונות", amount: 1500, count: 4, percentage: 17.6 },
    { category: "קניות", amount: 1500, count: 10, percentage: 17.6 },
  ],
};

const mockBudgetSummary: BudgetSummary = {
  total_budgeted: 12000,
  total_spent: 8500,
  total_remaining: 3500,
  budgets: [
    {
      budget: { id: "1", user_id: "demo", category: "מזון", amount: 3000, period: "monthly", project_id: "piterpay", created_at: "" },
      spent: 2500,
      remaining: 500,
      percentage_used: 83,
      is_over_budget: false,
    },
    {
      budget: { id: "2", user_id: "demo", category: "תחבורה", amount: 2000, period: "monthly", project_id: "piterpay", created_at: "" },
      spent: 1800,
      remaining: 200,
      percentage_used: 90,
      is_over_budget: false,
    },
    {
      budget: { id: "3", user_id: "demo", category: "בילויים", amount: 1500, period: "monthly", project_id: "piterpay", created_at: "" },
      spent: 1200,
      remaining: 300,
      percentage_used: 80,
      is_over_budget: false,
    },
  ],
};

const mockRecentTransactions = [
  { id: "1", description: "סופרמרקט רמי לוי", amount: 350, type: "expense", category: "מזון", date: "2026-01-17" },
  { id: "2", description: "דלק פז", amount: 280, type: "expense", category: "תחבורה", date: "2026-01-16" },
  { id: "3", description: "משכורת", amount: 15000, type: "income", category: "משכורת", date: "2026-01-10" },
  { id: "4", description: "קפה לנדוור", amount: 45, type: "expense", category: "בילויים", date: "2026-01-15" },
  { id: "5", description: "אלקטרה", amount: 890, type: "expense", category: "קניות", date: "2026-01-14" },
];

export function useDashboardData(userId?: string): DashboardData {
  const [transactionSummary, setTransactionSummary] = useState<TransactionSummary | null>(null);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<DashboardData["recentTransactions"]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured() || !userId) {
        // Demo mode - use mock data
        setTransactionSummary(mockTransactionSummary);
        setBudgetSummary(mockBudgetSummary);
        setRecentTransactions(mockRecentTransactions);
        return;
      }

      // Fetch real data from Supabase
      const [txSummary, budgets, transactions] = await Promise.all([
        transactionService.getMonthlySummary(userId),
        budgetService.getSummary(userId),
        transactionService.getAll({ date_from: getMonthStart() }),
      ]);

      setTransactionSummary(txSummary);
      setBudgetSummary(budgets);
      setRecentTransactions(
        transactions.slice(0, 10).map((t) => ({
          id: t.id,
          description: t.description,
          amount: t.amount,
          type: t.type,
          category: t.category,
          date: t.date,
        }))
      );
    } catch (err) {
      console.error("[useDashboardData] Error fetching data:", err);
      setError("שגיאה בטעינת נתונים");
      // Fall back to mock data
      setTransactionSummary(mockTransactionSummary);
      setBudgetSummary(mockBudgetSummary);
      setRecentTransactions(mockRecentTransactions);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    transactionSummary,
    budgetSummary,
    recentTransactions,
    isLoading,
    error,
    refresh: fetchData,
  };
}

function getMonthStart(): string {
  const date = new Date();
  date.setDate(1);
  date.setHours(0, 0, 0, 0);
  return date.toISOString().split("T")[0];
}
