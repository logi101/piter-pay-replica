"use client";

import { useState } from "react";
import { Plus, Settings, Trash2, Edit2, MessageCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useBudgetData } from "@/hooks/useBudgetData";

type CategoryType = "income" | "fixed" | "variable" | "periodic" | "goals" | "security";

const categoryTabs: { id: CategoryType; label: string; color: string; dbCategories: string[] }[] = [
  { id: "income", label: "הכנסות", color: "text-emerald-600", dbCategories: ["משכורת", "הכנסה נוספת", "בונוס"] },
  { id: "fixed", label: "הוצאות קבועות", color: "text-slate-600", dbCategories: ["שכירות", "משכנתא", "חשבונות", "ביטוח"] },
  { id: "variable", label: "הוצאות משתנות", color: "text-blue-600", dbCategories: ["מזון", "תחבורה", "בילויים", "קניות"] },
  { id: "periodic", label: "הוצאות תקופתיות", color: "text-orange-600", dbCategories: ["חופשות", "מתנות", "תיקונים"] },
  { id: "goals", label: "יעדים", color: "text-purple-600", dbCategories: ["חיסכון", "השקעות", "קרן חירום"] },
  { id: "security", label: "קרן ביטחון", color: "text-violet-600", dbCategories: ["קרן ביטחון"] },
];

export default function BudgetPage() {
  const { user } = useAuth();
  const { budgets, summary, alerts, isLoading, createBudget, updateBudget, deleteBudget } = useBudgetData(user?.id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryType>("income");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", amount: 0 });
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState(0);

  const displayName = user?.display_name || user?.email?.split("@")[0] || "אורח";

  // Filter budgets by active tab's categories
  const activeTabConfig = categoryTabs.find((t) => t.id === activeTab);
  const filteredBudgets = budgets.filter((budget) =>
    activeTabConfig?.dbCategories.includes(budget.category)
  );

  const handleAddCategory = async () => {
    if (newCategory.name.trim()) {
      await createBudget({
        category: newCategory.name,
        amount: newCategory.amount,
        period: "monthly",
      });
      setNewCategory({ name: "", amount: 0 });
      setIsAddingNew(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    await deleteBudget(id);
  };

  const handleStartEdit = (budget: { id: string; amount: number }) => {
    setEditingId(budget.id);
    setEditAmount(budget.amount);
  };

  const handleSaveEdit = async (id: string) => {
    await updateBudget(id, { amount: editAmount });
    setEditingId(null);
  };

  const totalByTab = filteredBudgets.reduce((sum, b) => sum + b.amount, 0);

  // Get budget status from summary
  const getBudgetStatus = (budgetId: string) => {
    return summary?.budgets.find((s) => s.budget.id === budgetId);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        username={displayName}
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        username={user?.email || "guest@piterpay.com"}
      />

      <main className="max-w-6xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-900">הגדרות תקציב</h1>
            <p className="text-slate-500 mt-1">
              הגדר את קטגוריות התקציב שלך
            </p>
          </div>
          <Settings className="w-6 h-6 text-slate-400" />
        </div>

        {/* Alerts Section */}
        {alerts.length > 0 && (
          <div className="mb-6 space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.budget_id}
                className={cn(
                  "flex items-center gap-3 p-4 rounded-lg",
                  alert.alert_type === "exceeded" ? "bg-red-50 border border-red-200" :
                  alert.alert_type === "critical" ? "bg-orange-50 border border-orange-200" :
                  "bg-yellow-50 border border-yellow-200"
                )}
              >
                <AlertTriangle className={cn(
                  "w-5 h-5",
                  alert.alert_type === "exceeded" ? "text-red-500" :
                  alert.alert_type === "critical" ? "text-orange-500" :
                  "text-yellow-500"
                )} />
                <span className="text-sm text-slate-700">{alert.message}</span>
              </div>
            ))}
          </div>
        )}

        {/* Summary Cards */}
        {summary && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-500">סה״כ תקציב</p>
                <p className="text-xl font-bold text-slate-900">
                  {formatCurrency(summary.total_budgeted)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-500">נוצל</p>
                <p className="text-xl font-bold text-red-600">
                  {formatCurrency(summary.total_spent)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <p className="text-sm text-slate-500">נותר</p>
                <p className={cn(
                  "text-xl font-bold",
                  summary.total_remaining >= 0 ? "text-emerald-600" : "text-red-600"
                )}>
                  {formatCurrency(summary.total_remaining)}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categoryTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white shadow-sm border border-slate-200"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <span className={activeTab === tab.id ? tab.color : ""}>
                {tab.label}
              </span>
            </button>
          ))}
        </div>

        {/* Budget Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setIsAddingNew(true)}
                className="bg-emerald-500 hover:bg-emerald-600"
              >
                <Plus className="w-4 h-4 ml-2" />
                הוסף קטגוריה
              </Button>
            </div>
            <div className="text-right">
              <CardTitle className="text-lg">
                {categoryTabs.find((t) => t.id === activeTab)?.label}
              </CardTitle>
              <p className="text-sm text-slate-500 mt-1">
                סה״כ: {formatCurrency(totalByTab)}
              </p>
            </div>
          </CardHeader>
          <CardContent>
            {/* Add New Category Form */}
            {isAddingNew && (
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-lg mb-4">
                <Button
                  variant="outline"
                  onClick={() => setIsAddingNew(false)}
                >
                  ביטול
                </Button>
                <Button
                  onClick={handleAddCategory}
                  className="bg-emerald-500 hover:bg-emerald-600"
                >
                  הוסף
                </Button>
                <Input
                  type="number"
                  placeholder="סכום"
                  value={newCategory.amount || ""}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, amount: Number(e.target.value) })
                  }
                  className="w-32 text-right"
                />
                <Input
                  placeholder="שם הקטגוריה"
                  value={newCategory.name}
                  onChange={(e) =>
                    setNewCategory({ ...newCategory, name: e.target.value })
                  }
                  className="flex-1 text-right"
                />
              </div>
            )}

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-8 text-slate-500">
                <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-2"></div>
                טוען...
              </div>
            ) : (
              /* Categories List */
              <div className="space-y-3">
                {filteredBudgets.length === 0 ? (
                  <div className="text-center py-8 text-slate-500">
                    אין קטגוריות מוגדרות עדיין
                  </div>
                ) : (
                  filteredBudgets.map((budget) => {
                    const status = getBudgetStatus(budget.id);

                    return (
                      <div
                        key={budget.id}
                        className="p-4 bg-white border border-slate-200 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleDeleteCategory(budget.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              aria-label="מחק קטגוריה"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                            {editingId === budget.id ? (
                              <button
                                onClick={() => handleSaveEdit(budget.id)}
                                className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                                aria-label="שמור"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                onClick={() => handleStartEdit(budget)}
                                className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors"
                                aria-label="ערוך קטגוריה"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                          <div className="flex items-center gap-4">
                            {editingId === budget.id ? (
                              <Input
                                type="number"
                                value={editAmount}
                                onChange={(e) => setEditAmount(Number(e.target.value))}
                                className="w-32 text-right"
                              />
                            ) : (
                              <span className="font-bold text-slate-900">
                                {formatCurrency(budget.amount)}
                              </span>
                            )}
                            <span className="text-slate-700">{budget.category}</span>
                          </div>
                        </div>

                        {/* Progress bar for expense budgets */}
                        {status && (
                          <div className="mt-2">
                            <Progress
                              value={Math.min(status.percentage_used, 100)}
                              className={cn(
                                "h-2",
                                status.is_over_budget ? "[&>div]:bg-red-500" :
                                status.percentage_used >= 80 ? "[&>div]:bg-orange-500" :
                                "[&>div]:bg-emerald-500"
                              )}
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-1">
                              <span>נותר: {formatCurrency(status.remaining)}</span>
                              <span>
                                {formatCurrency(status.spent)} / {formatCurrency(budget.amount)}
                                {" "}({status.percentage_used.toFixed(0)}%)
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
        aria-label="פתח צ'אט"
        onClick={() => window.location.href = "/dashboard"}
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
