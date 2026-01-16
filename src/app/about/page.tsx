"use client";

import { useState } from "react";
import { Info, Heart, Shield, Zap, Users, MessageCircle, ExternalLink } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: MessageCircle,
    title: "צ'אט אינטואיטיבי",
    description: "רשום הוצאות בשפה טבעית, ללא טפסים מסובכים",
  },
  {
    icon: Shield,
    title: "אבטחה מתקדמת",
    description: "הנתונים שלך מוגנים בהצפנה מתקדמת",
  },
  {
    icon: Zap,
    title: "תובנות חכמות",
    description: "קבל המלצות מותאמות אישית לחיסכון",
  },
  {
    icon: Users,
    title: "ניהול משק בית",
    description: "שתף ונהל תקציב עם בני המשפחה",
  },
];

export default function AboutPage() {
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
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🧑‍💼</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">PiterPay</h1>
          <p className="text-xl text-emerald-600 font-medium mb-4">
            היועץ החכם לניהול ההוצאות שלך
          </p>
          <p className="text-slate-500 max-w-2xl mx-auto">
            PiterPay הוא כלי חכם לניהול תקציב אישי ומשפחתי. באמצעות ממשק צ'אט פשוט
            ואינטואיטיבי, תוכלו לעקוב אחרי ההוצאות, לנהל תקציב ולקבל תובנות שיעזרו
            לכם לחסוך כסף.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="flex-1 text-right">
                    <h3 className="font-bold text-slate-900 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-slate-500">{feature.description}</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Version Info */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 justify-end">
              מידע על הגרסה
              <Info className="w-5 h-5 text-slate-400" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-right">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-900 font-medium">1.0.0</span>
                <span className="text-slate-500">גרסה</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-900 font-medium">ינואר 2026</span>
                <span className="text-slate-500">תאריך עדכון</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-emerald-600 font-medium">עדכני</span>
                <span className="text-slate-500">סטטוס</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Links */}
        <Card className="mb-6">
          <CardContent className="py-4">
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                תנאי שימוש
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                מדיניות פרטיות
              </a>
              <a
                href="#"
                className="flex items-center gap-2 text-sm text-slate-600 hover:text-emerald-600 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                צור קשר
              </a>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-slate-500 text-sm">
          <p className="flex items-center justify-center gap-1">
            נבנה עם
            <Heart className="w-4 h-4 text-red-500" />
            עבור משתמשי PiterPay
          </p>
          <p className="mt-2">© 2026 PiterPay. כל הזכויות שמורות.</p>
        </div>
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
