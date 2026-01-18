"use client";

import { useState, useEffect, useCallback } from "react";
import { budgetService } from "@/services";
import { isSupabaseConfigured } from "@/integrations/supabase/client";
import type { Budget, BudgetSummary, BudgetAlert, CreateBudgetInput, UpdateBudgetInput } from "@/types";

interface BudgetData {
  budgets: Budget[];
  summary: BudgetSummary | null;
  alerts: BudgetAlert[];
  isLoading: boolean;
  error: string | null;
  createBudget: (input: CreateBudgetInput) => Promise<Budget>;
  updateBudget: (id: string, input: UpdateBudgetInput) => Promise<Budget>;
  deleteBudget: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
}

// Mock data for demo mode
const mockBudgets: Budget[] = [
  { id: "1", user_id: "demo", category: "משכורת", amount: 15000, period: "monthly", project_id: "piterpay", created_at: new Date().toISOString() },
  { id: "2", user_id: "demo", category: "שכירות", amount: 4000, period: "monthly", project_id: "piterpay", created_at: new Date().toISOString() },
  { id: "3", user_id: "demo", category: "מזון", amount: 3000, period: "monthly", project_id: "piterpay", created_at: new Date().toISOString() },
  { id: "4", user_id: "demo", category: "תחבורה", amount: 2000, period: "monthly", project_id: "piterpay", created_at: new Date().toISOString() },
  { id: "5", user_id: "demo", category: "בילויים", amount: 1500, period: "monthly", project_id: "piterpay", created_at: new Date().toISOString() },
  { id: "6", user_id: "demo", category: "חשבונות", amount: 1200, period: "monthly", project_id: "piterpay", created_at: new Date().toISOString() },
];

const mockSummary: BudgetSummary = {
  total_budgeted: 26700,
  total_spent: 8500,
  total_remaining: 18200,
  budgets: [
    {
      budget: mockBudgets[1],
      spent: 4000,
      remaining: 0,
      percentage_used: 100,
      is_over_budget: false,
    },
    {
      budget: mockBudgets[2],
      spent: 2500,
      remaining: 500,
      percentage_used: 83,
      is_over_budget: false,
    },
    {
      budget: mockBudgets[3],
      spent: 1800,
      remaining: 200,
      percentage_used: 90,
      is_over_budget: false,
    },
    {
      budget: mockBudgets[4],
      spent: 1200,
      remaining: 300,
      percentage_used: 80,
      is_over_budget: false,
    },
  ],
};

const mockAlerts: BudgetAlert[] = [
  {
    budget_id: "3",
    category: "תחבורה",
    percentage_used: 90,
    alert_type: "critical",
    message: "תקציב תחבורה עומד להסתיים - 90% נוצל",
  },
];

export function useBudgetData(userId?: string): BudgetData {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [summary, setSummary] = useState<BudgetSummary | null>(null);
  const [alerts, setAlerts] = useState<BudgetAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      if (!isSupabaseConfigured() || !userId) {
        // Demo mode - use mock data
        setBudgets(mockBudgets);
        setSummary(mockSummary);
        setAlerts(mockAlerts);
        return;
      }

      // Fetch real data from Supabase
      const [allBudgets, budgetSummary, budgetAlerts] = await Promise.all([
        budgetService.getAll(),
        budgetService.getSummary(userId),
        budgetService.getAlerts(userId),
      ]);

      setBudgets(allBudgets);
      setSummary(budgetSummary);
      setAlerts(budgetAlerts);
    } catch (err) {
      console.error("[useBudgetData] Error fetching data:", err);
      setError("שגיאה בטעינת נתוני התקציב");
      // Fall back to mock data
      setBudgets(mockBudgets);
      setSummary(mockSummary);
      setAlerts(mockAlerts);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createBudget = useCallback(async (input: CreateBudgetInput): Promise<Budget> => {
    if (!isSupabaseConfigured() || !userId) {
      // Demo mode - create locally
      const newBudget: Budget = {
        id: Date.now().toString(),
        user_id: "demo",
        category: input.category,
        amount: input.amount,
        period: input.period || "monthly",
        project_id: "piterpay",
        created_at: new Date().toISOString(),
      };
      setBudgets((prev) => [...prev, newBudget]);
      return newBudget;
    }

    const budget = await budgetService.create(userId, input);
    await fetchData(); // Refresh all data
    return budget;
  }, [userId, fetchData]);

  const updateBudget = useCallback(async (id: string, input: UpdateBudgetInput): Promise<Budget> => {
    if (!isSupabaseConfigured() || !userId) {
      // Demo mode - update locally
      setBudgets((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...input } : b))
      );
      const updated = budgets.find((b) => b.id === id);
      return { ...updated!, ...input };
    }

    const budget = await budgetService.update(id, input);
    await fetchData(); // Refresh all data
    return budget;
  }, [userId, budgets, fetchData]);

  const deleteBudget = useCallback(async (id: string): Promise<void> => {
    if (!isSupabaseConfigured() || !userId) {
      // Demo mode - delete locally
      setBudgets((prev) => prev.filter((b) => b.id !== id));
      return;
    }

    await budgetService.delete(id);
    await fetchData(); // Refresh all data
  }, [userId, fetchData]);

  return {
    budgets,
    summary,
    alerts,
    isLoading,
    error,
    createBudget,
    updateBudget,
    deleteBudget,
    refresh: fetchData,
  };
}
