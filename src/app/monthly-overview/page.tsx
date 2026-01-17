"use client";

import { useState } from "react";
import { ChevronRight, ChevronLeft, Calendar, MessageCircle, Check } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { formatCurrency, formatDate } from "@/lib/utils";

type ExpenseType = "fixed" | "variable" | "periodic";

const expenseTabs: { id: ExpenseType; label: string }[] = [
  { id: "fixed", label: "הוצאות קבועות" },
  { id: "variable", label: "הוצאות משתנות" },
  { id: "periodic", label: "הוצאות תקופתיות" },
];

export default function MonthlyOverviewPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ExpenseType>("fixed");
  const [currentDate, setCurrentDate] = useState(new Date());

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

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
            <h1 className="text-2xl font-bold text-slate-900">מעקב חודשי</h1>
            <p className="text-slate-500 mt-1">
              סקירה מפורטת של התקציב החודשי
            </p>
          </div>

          {/* Month Selector */}
          <div className="flex items-center gap-2">
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="חודש הבא"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span className="font-medium">{formatDate(currentDate)}</span>
            </div>
            <button
              onClick={prevMonth}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="חודש קודם"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Expense Type Tabs */}
        <div className="flex gap-2 mb-6 border-b border-slate-200 pb-4">
          {expenseTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "px-6 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Main Content Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">מעקב הוצאות קבועות</CardTitle>
            <Button className="bg-emerald-500 hover:bg-emerald-600">
              <Check className="w-4 h-4 ml-2" />
              אשר את כל התשלומים
            </Button>
          </CardHeader>
          <CardContent>
            {/* Summary Row */}
            <div className="grid grid-cols-3 gap-4 mb-6 text-center">
              <div>
                <p className="text-sm text-slate-500">סך הכל תכנון</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(0)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">סך הכל ביצוע</p>
                <p className="text-xl font-bold text-slate-900">{formatCurrency(0)}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">יתרה / חיסכון</p>
                <p className="text-xl font-bold text-emerald-600">{formatCurrency(0)}</p>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-right py-3 px-4 font-medium text-slate-600">פרטי הסעיף</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">סכום מתוכנן</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">סכום בפועל</th>
                    <th className="text-right py-3 px-4 font-medium text-slate-600">סטטוס</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-slate-500">
                      אין הוצאות מוגדרות עדיין
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Archive Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">ארכיון חודשי</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-slate-500">עדיין לא נוצר ארכיון חודשי</p>
              <Button className="bg-emerald-500 hover:bg-emerald-600">
                צור ארכיון לינואר 2026
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center" aria-label="פתח צ'אט">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
