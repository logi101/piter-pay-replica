"use client";

import { useState } from "react";
import { Plus, Settings, Trash2, Edit2, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";

type CategoryType = "income" | "fixed" | "variable" | "periodic" | "goals" | "security";

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  type: CategoryType;
}

const categoryTabs: { id: CategoryType; label: string; color: string }[] = [
  { id: "income", label: "הכנסות", color: "text-emerald-600" },
  { id: "fixed", label: "הוצאות קבועות", color: "text-slate-600" },
  { id: "variable", label: "הוצאות משתנות", color: "text-blue-600" },
  { id: "periodic", label: "הוצאות תקופתיות", color: "text-orange-600" },
  { id: "goals", label: "יעדים", color: "text-purple-600" },
  { id: "security", label: "קרן ביטחון", color: "text-violet-600" },
];

const initialCategories: BudgetCategory[] = [
  { id: "1", name: "משכורת", amount: 0, type: "income" },
  { id: "2", name: "שכירות", amount: 0, type: "fixed" },
  { id: "3", name: "מזון", amount: 0, type: "variable" },
];

export default function BudgetPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CategoryType>("income");
  const [categories, setCategories] = useState<BudgetCategory[]>(initialCategories);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: "", amount: 0 });

  const filteredCategories = categories.filter((cat) => cat.type === activeTab);

  const handleAddCategory = () => {
    if (newCategory.name.trim()) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: newCategory.name,
          amount: newCategory.amount,
          type: activeTab,
        },
      ]);
      setNewCategory({ name: "", amount: 0 });
      setIsAddingNew(false);
    }
  };

  const handleDeleteCategory = (id: string) => {
    setCategories(categories.filter((cat) => cat.id !== id));
  };

  const totalByType = categories
    .filter((cat) => cat.type === activeTab)
    .reduce((sum, cat) => sum + cat.amount, 0);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        username="user"
        onMenuClick={() => setIsSidebarOpen(true)}
      />
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        username="ew5933070@gmail.com"
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
                סה״כ: {formatCurrency(totalByType)}
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

            {/* Categories List */}
            <div className="space-y-2">
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  אין קטגוריות מוגדרות עדיין
                </div>
              ) : (
                filteredCategories.map((category) => (
                  <div
                    key={category.id}
                    className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-slate-900">
                        {formatCurrency(category.amount)}
                      </span>
                      <span className="text-slate-700">{category.name}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
