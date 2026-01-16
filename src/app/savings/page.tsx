"use client";

import { useState } from "react";
import { Settings, BarChart3, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

interface StatCard {
  id: string;
  title: string;
  subtitle: string;
  amount: number;
  additionalInfo?: string;
  color: "green" | "gray" | "blue" | "orange" | "purple" | "violet";
}

const statCards: StatCard[] = [
  {
    id: "income",
    title: "סה\"כ הכנסות",
    subtitle: "לחץ לעריכת מקורות הכנסה",
    amount: 0,
    color: "green",
  },
  {
    id: "fixed",
    title: "סך ההוצאות הקבועות",
    subtitle: "לחץ לצפייה בפירוט",
    amount: 0,
    color: "gray",
  },
  {
    id: "variable",
    title: "תקציב הוצאות משתנות",
    subtitle: "לחץ לצפייה בפירוט",
    amount: 0,
    additionalInfo: "יתרה: ₪0",
    color: "blue",
  },
  {
    id: "periodic",
    title: "הוצאות תקופתיות נצברות",
    subtitle: "למימוש במהלך השנה",
    amount: 0,
    additionalInfo: "סה\"כ נצבר: ₪0",
    color: "orange",
  },
  {
    id: "goals",
    title: "יעדים להגשמה",
    subtitle: "יעדי חיסכון לטווח הארוך",
    amount: 0,
    additionalInfo: "סה\"כ נצבר: ₪0",
    color: "purple",
  },
  {
    id: "security",
    title: "קרן ביטחון",
    subtitle: "טווח מומלץ: ₪0 - ₪0",
    amount: 0,
    additionalInfo: "סה\"כ נצבר: ₪0",
    color: "violet",
  },
];

const colorClasses = {
  green: "stat-card-green",
  gray: "stat-card-gray",
  blue: "stat-card-blue",
  orange: "stat-card-orange",
  purple: "stat-card-purple",
  violet: "stat-card-violet",
};

export default function SavingsPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"manage" | "reports">("manage");

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
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">
            לוח הבקרה - חסכונות והשקעות
          </h1>
          <p className="text-slate-500 mt-1">
            נהל את החסכונות וההשקעות שלך
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 justify-start">
          <button
            onClick={() => setActiveTab("manage")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "manage"
                ? "bg-emerald-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            <Settings className="w-4 h-4" />
            ניהול חסכונות
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              activeTab === "reports"
                ? "bg-emerald-500 text-white"
                : "bg-white text-slate-600 hover:bg-slate-50"
            )}
          >
            <BarChart3 className="w-4 h-4" />
            דוחות וביצועים
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statCards.map((card) => (
            <div
              key={card.id}
              className={cn("stat-card cursor-pointer", colorClasses[card.color])}
            >
              <div className="flex flex-col h-full">
                <div className="text-right">
                  <h3 className="font-bold text-lg">{card.title}</h3>
                  <p className="text-sm opacity-80">{card.subtitle}</p>
                </div>
                <div className="mt-auto pt-4">
                  <p className="text-3xl font-bold">
                    {formatCurrency(card.amount)}
                  </p>
                  {card.additionalInfo && (
                    <p className="text-sm opacity-80 mt-1">{card.additionalInfo}</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
