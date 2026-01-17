"use client";

import { useState } from "react";
import { Shield, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
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
            href="/about"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לאודות
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-3 justify-end">
              מדיניות פרטיות
              <Shield className="w-6 h-6 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-right space-y-4 text-slate-600">
            <h2 className="text-lg font-semibold text-slate-900">1. מידע שאנו אוספים</h2>
            <p>
              אנו אוספים מידע שאתה מספק לנו ישירות, כגון פרטי חשבון, נתוני הוצאות
              והעדפות אישיות.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">2. שימוש במידע</h2>
            <p>
              המידע משמש לספק את שירותי האפליקציה, לשפר את החוויה ולהתאים את התובנות
              לצרכיך האישיים.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">3. אבטחת מידע</h2>
            <p>
              אנו משתמשים בטכנולוגיות הצפנה מתקדמות להגנה על המידע שלך. הנתונים
              מאוחסנים בשרתים מאובטחים.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">4. שיתוף מידע</h2>
            <p>
              איננו משתפים את המידע האישי שלך עם צדדים שלישיים למטרות שיווקיות.
              המידע ישותף רק במקרים הנדרשים על פי חוק.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">5. זכויותיך</h2>
            <p>
              יש לך זכות לגשת למידע שלך, לעדכן אותו או לבקש את מחיקתו בכל עת
              דרך הגדרות החשבון.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">6. יצירת קשר</h2>
            <p>
              לשאלות בנוגע לפרטיות, ניתן לפנות אלינו דרך עמוד יצירת הקשר.
            </p>

            <div className="pt-4 text-sm text-slate-400">
              עודכן לאחרונה: ינואר 2026
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
