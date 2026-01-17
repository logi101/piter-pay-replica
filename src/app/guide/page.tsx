"use client";

import { useState } from "react";
import { BookOpen, ChevronDown, ChevronUp, MessageCircle, Search } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface GuideSection {
  id: string;
  title: string;
  content: string;
  icon: string;
}

const guideSections: GuideSection[] = [
  {
    id: "1",
    title: "התחלה מהירה",
    content: `ברוכים הבאים ל-PiterPay! הנה כמה צעדים פשוטים להתחיל:

1. **הגדר את התקציב שלך** - עבור להגדרות תקציב והזן את ההכנסות וההוצאות הקבועות שלך.

2. **התחל לרשום הוצאות** - פשוט כתוב "50 מכולת" או "קפה 15" בצ'אט עם פיטר.

3. **עקוב אחרי היתרה** - פיטר יעדכן אותך על היתרה שנותרה בכל קטגוריה.

4. **קבל תובנות** - שאל את פיטר "מה היתרה?" או "איפה אני עומד החודש?"`,
    icon: "🚀",
  },
  {
    id: "2",
    title: "רישום הוצאות",
    content: `**דרכים לרשום הוצאות:**

• **בסיסי:** "50 מכולת" - רושם 50 ש"ח בקטגוריית מכולת
• **עם תיאור:** "ארוחת צהריים 80 מסעדה" - כולל תיאור
• **החזר:** "החזר 30 מסעדה" - מחזיר 30 ש"ח לקטגוריה

**טיפים:**
- ניתן לכתוב את הסכום לפני או אחרי הקטגוריה
- פיטר מזהה אוטומטית קטגוריות נפוצות
- אפשר להוסיף קטגוריות חדשות בהגדרות`,
    icon: "💰",
  },
  {
    id: "3",
    title: "ניהול תקציב",
    content: `**הגדרת תקציב:**

1. **הכנסות** - הזן את כל מקורות ההכנסה החודשיים
2. **הוצאות קבועות** - שכירות, חשבונות, ביטוחים וכו'
3. **הוצאות משתנות** - מזון, בילויים, קניות וכו'
4. **הוצאות תקופתיות** - חגים, חופשות, רכישות גדולות

**המלצות:**
- הקצה 50% להוצאות הכרחיות
- 30% לרצונות
- 20% לחיסכון`,
    icon: "📊",
  },
  {
    id: "4",
    title: "שאלות נפוצות",
    content: `**שאלות שאפשר לשאול את פיטר:**

• "מה היתרה בבילויים?"
• "כמה הוצאתי החודש?"
• "איפה אני עומד מול התקציב?"
• "מה ההוצאה האחרונה שלי?"
• "סיכום חודשי"

**פקודות מיוחדות:**
• "עזרה" - רשימת כל הפקודות
• "בטל" - ביטול הפעולה האחרונה
• "היסטוריה" - צפייה בהוצאות אחרונות`,
    icon: "❓",
  },
  {
    id: "5",
    title: "ניהול משק בית",
    content: `**שיתוף עם בני משפחה:**

1. עבור ל"ניהול משק בית"
2. הזמן חברים באמצעות כתובת אימייל
3. הגדר הרשאות לכל חבר:
   - **מנהל** - גישה מלאה לכל ההגדרות
   - **חבר** - יכול לרשום הוצאות ולצפות בנתונים
   - **צופה** - צפייה בלבד

**יתרונות:**
- מעקב משותף על תקציב המשפחה
- כל אחד יכול לרשום הוצאות
- שקיפות מלאה`,
    icon: "👨‍👩‍👧‍👦",
  },
];

export default function GuidePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>("1");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSections = guideSections.filter(
    (section) =>
      section.title.includes(searchQuery) ||
      section.content.includes(searchQuery)
  );

  const toggleSection = (id: string) => {
    setExpandedSection(expandedSection === id ? null : id);
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

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-emerald-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">מדריך למשתמש</h1>
          <p className="text-slate-500 mt-1">
            למד כיצד להשתמש ב-PiterPay בצורה הטובה ביותר
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="חפש במדריך..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10 text-right"
          />
        </div>

        {/* Guide Sections */}
        <div className="space-y-4">
          {filteredSections.map((section) => (
            <Card key={section.id}>
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  {expandedSection === section.id ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                  <CardTitle className="flex items-center gap-3">
                    {section.title}
                    <span className="text-2xl">{section.icon}</span>
                  </CardTitle>
                </div>
              </CardHeader>
              {expandedSection === section.id && (
                <CardContent>
                  <div className="prose prose-slate max-w-none text-right">
                    {section.content.split("\n").map((line, i) => (
                      <p key={i} className="my-2">
                        {line.startsWith("**") ? (
                          <strong>
                            {line.replace(/\*\*/g, "")}
                          </strong>
                        ) : line.startsWith("•") || line.startsWith("-") ? (
                          <span className="block mr-4">{line}</span>
                        ) : line.match(/^\d\./) ? (
                          <span className="block mr-4">{line}</span>
                        ) : (
                          line
                        )}
                      </p>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-6">
          <CardContent className="py-6 text-center">
            <p className="text-slate-600 mb-4">
              לא מצאת את מה שחיפשת? דבר עם פיטר!
            </p>
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
              <MessageCircle className="w-5 h-5" />
              פתח צ'אט עם פיטר
            </button>
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
