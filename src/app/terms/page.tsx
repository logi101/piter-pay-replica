"use client";

import { useState } from "react";
import { FileText, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
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
              תנאי שימוש
              <FileText className="w-6 h-6 text-emerald-600" />
            </CardTitle>
          </CardHeader>
          <CardContent className="text-right space-y-4 text-slate-600">
            <h2 className="text-lg font-semibold text-slate-900">1. כללי</h2>
            <p>
              ברוכים הבאים ל-PiterPay. השימוש באפליקציה מותנה בהסכמתך לתנאי השימוש המפורטים להלן.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">2. השירות</h2>
            <p>
              PiterPay מספקת כלי לניהול תקציב אישי ומשפחתי. השירות מאפשר מעקב אחר הוצאות,
              ניהול תקציב וקבלת תובנות פיננסיות.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">3. פרטיות</h2>
            <p>
              אנו מתייחסים לפרטיות המשתמשים בכובד ראש. המידע שלך מאוחסן בצורה מאובטחת
              ולא ישותף עם צדדים שלישיים ללא הסכמתך.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">4. אחריות</h2>
            <p>
              המידע המוצג באפליקציה הוא להמחשה בלבד ואינו מהווה ייעוץ פיננסי מקצועי.
              המשתמש אחראי לקבלת החלטות פיננסיות בעצמו.
            </p>

            <h2 className="text-lg font-semibold text-slate-900">5. שינויים</h2>
            <p>
              אנו שומרים את הזכות לעדכן תנאים אלו מעת לעת. עדכונים יפורסמו בעמוד זה.
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
