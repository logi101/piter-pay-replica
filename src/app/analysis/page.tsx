"use client";

import { useState } from "react";
import { BarChart3, ArrowRight, Clock } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AnalysisPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה ללוח הבקרה
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 justify-end">
              ניתוח נתונים
              <BarChart3 className="w-6 h-6 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-right space-y-6">
            <div className="flex items-center justify-center py-12">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto bg-emerald-100 rounded-full flex items-center justify-center">
                  <Clock className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">בקרוב!</h2>
                <p className="text-slate-600 max-w-md">
                  מודול ניתוח נתונים יאפשר לך לצפות בגרפים וסטטיסטיקות מפורטות
                  על ההוצאות וההכנסות שלך לאורך זמן.
                </p>
                <div className="pt-4">
                  <Link
                    href="/savings"
                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-lg hover:bg-emerald-600 transition-colors"
                  >
                    צפה בלוח הבקרה
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
