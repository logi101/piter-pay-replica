"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MessageCircle, LayoutDashboard, FileText, TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatCurrency } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useDashboardData } from "@/hooks/useDashboardData";

interface Message {
  id: string;
  content: string;
  sender: "bot" | "user";
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: "1",
    content: `👋 שלום! אני פיטר - העוזר החכם שלך לניהול הוצאות.

💡 **כתוב פשוט:** "50 מכולת", "קפה 15".
**או שאל אותי:** "מה היתרה בבילויים?", "יתרה חודשית".

🎯 אני כאן כדי לעזור לך לעקוב אחר התקציב בקלות.

לרשימת הפקודות והיכולות שלי, כתוב "עזרה".

איך אוכל לעזור לך היום? 😊`,
    sender: "bot",
    timestamp: new Date(),
  },
];

type TabType = "chat" | "dashboard" | "details";

export default function DashboardPage() {
  const { user } = useAuth();
  const { transactionSummary, budgetSummary, recentTransactions } = useDashboardData(user?.id);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);

    // Parse user input and respond
    setTimeout(() => {
      let botResponse = `קיבלתי את ההוצאה: "${inputValue}". נרשם בהצלחה! 📝`;

      // Simple parsing logic
      const input = inputValue.trim().toLowerCase();
      if (input.includes("עזרה") || input === "help") {
        botResponse = `📚 **הפקודות שלי:**

**הוספת הוצאה:**
• "50 מכולת" - הוצאה של 50₪ בקטגוריית מכולת
• "קפה 15" - הוצאה של 15₪ בקטגוריית אוכל

**שאילתות:**
• "יתרה" / "מה היתרה?" - יתרה כללית
• "יתרה בבילויים" - יתרה בקטגוריה ספציפית
• "סיכום חודשי" - סיכום ההוצאות החודשיות

**אחר:**
• "עזרה" - הודעה זו`;
      } else if (input.includes("יתרה") || input.includes("סיכום")) {
        if (transactionSummary) {
          botResponse = `📊 **סיכום חודשי:**

💰 הכנסות: ${formatCurrency(transactionSummary.total_income)}
💸 הוצאות: ${formatCurrency(transactionSummary.total_expense)}
${transactionSummary.net >= 0 ? "✅" : "⚠️"} יתרה: ${formatCurrency(transactionSummary.net)}

${transactionSummary.net < 0 ? "שימו לב! ההוצאות עולות על ההכנסות החודש." : "מצוין! אתם בפלוס החודש!"}`;
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const tabs = [
    { id: "chat" as TabType, label: "💬 צ'אט עם פיטר", icon: MessageCircle },
    { id: "dashboard" as TabType, label: "לוח הבקרה", icon: LayoutDashboard },
    { id: "details" as TabType, label: "פרטים", icon: FileText },
  ];

  const displayName = user?.display_name || user?.email?.split("@")[0] || "אורח";

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

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Welcome Message */}
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">
          היי {displayName}, ברוך שובך!
        </h1>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6 justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === tab.id
                  ? "bg-white shadow-sm text-slate-900"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Chat Content */}
        {activeTab === "chat" && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {/* Chat Header */}
            <div className="bg-emerald-500 text-white p-4 flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">🧑‍💼</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">פיטר - היועץ התקציבי החכם שלכם</h2>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-slate-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex",
                    message.sender === "user" ? "justify-start" : "justify-end"
                  )}
                >
                  <div
                    className={cn(
                      "max-w-[80%] rounded-lg p-4",
                      message.sender === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-white shadow-md text-slate-700"
                    )}
                  >
                    <p className="whitespace-pre-wrap text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-end">
                  <div className="bg-white shadow-md rounded-lg p-4">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-100"></span>
                      <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-200"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-200 bg-white">
              <div className="flex gap-2 items-center">
                <button
                  className="p-2 text-slate-400 hover:text-slate-600 transition-colors"
                  aria-label="צרף קובץ"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="כתוב '50 פלאפל' או 'יתרה'..."
                  className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isLoading}
                  className="bg-emerald-500 hover:bg-emerald-600"
                  size="icon"
                  aria-label="שלח הודעה"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Tab Content */}
        {activeTab === "dashboard" && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
                  <p className="text-sm text-slate-500">הכנסות</p>
                  <p className="text-xl font-bold text-emerald-600">
                    {formatCurrency(transactionSummary?.total_income || 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <TrendingDown className="w-8 h-8 mx-auto mb-2 text-red-500" />
                  <p className="text-sm text-slate-500">הוצאות</p>
                  <p className="text-xl font-bold text-red-600">
                    {formatCurrency(transactionSummary?.total_expense || 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <Wallet className="w-8 h-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-sm text-slate-500">יתרה</p>
                  <p className={cn(
                    "text-xl font-bold",
                    (transactionSummary?.net || 0) >= 0 ? "text-emerald-600" : "text-red-600"
                  )}>
                    {formatCurrency(transactionSummary?.net || 0)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 text-center">
                  <PiggyBank className="w-8 h-8 mx-auto mb-2 text-purple-500" />
                  <p className="text-sm text-slate-500">תקציב נותר</p>
                  <p className="text-xl font-bold text-purple-600">
                    {formatCurrency(budgetSummary?.total_remaining || 0)}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Budget Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">ניצול תקציב לפי קטגוריה</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgetSummary?.budgets.map((budgetStatus) => (
                  <div key={budgetStatus.budget.id} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className={cn(
                        "font-medium",
                        budgetStatus.is_over_budget ? "text-red-600" : "text-slate-600"
                      )}>
                        {budgetStatus.percentage_used}%
                      </span>
                      <span className="text-slate-700">{budgetStatus.budget.category}</span>
                    </div>
                    <Progress
                      value={Math.min(budgetStatus.percentage_used, 100)}
                      className={cn(
                        "h-2",
                        budgetStatus.is_over_budget ? "[&>div]:bg-red-500" : "[&>div]:bg-emerald-500"
                      )}
                    />
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>נותר: {formatCurrency(budgetStatus.remaining)}</span>
                      <span>
                        {formatCurrency(budgetStatus.spent)} / {formatCurrency(budgetStatus.budget.amount)}
                      </span>
                    </div>
                  </div>
                ))}

                {(!budgetSummary?.budgets || budgetSummary.budgets.length === 0) && (
                  <div className="text-center py-8 text-slate-500">
                    <p>אין תקציבים מוגדרים</p>
                    <p className="text-sm mt-1">לחץ על &quot;הגדרות תקציב&quot; כדי להוסיף</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Expense by Category */}
            {transactionSummary?.by_category && transactionSummary.by_category.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">הוצאות לפי קטגוריה</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactionSummary.by_category.map((cat) => (
                      <div key={cat.category} className="flex items-center justify-between">
                        <span className="text-sm font-medium">{formatCurrency(cat.amount)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-slate-600">{cat.category}</span>
                          <span className="text-xs text-slate-400">({cat.percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Details Tab Content */}
        {activeTab === "details" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">פעולות אחרונות</CardTitle>
            </CardHeader>
            <CardContent>
              {recentTransactions.length > 0 ? (
                <div className="space-y-3">
                  {recentTransactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between py-3 border-b border-slate-100 last:border-0"
                    >
                      <span className={cn(
                        "font-bold",
                        tx.type === "income" ? "text-emerald-600" : "text-red-600"
                      )}>
                        {tx.type === "income" ? "+" : "-"}{formatCurrency(tx.amount)}
                      </span>
                      <div className="text-right">
                        <p className="text-sm font-medium text-slate-700">
                          {tx.description || tx.category || "ללא תיאור"}
                        </p>
                        <p className="text-xs text-slate-400">{tx.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p>אין פעולות אחרונות</p>
                  <p className="text-sm mt-1">התחל להזין הוצאות דרך הצ&#39;אט עם פיטר</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Floating Chat Button */}
      <button
        onClick={() => setActiveTab("chat")}
        className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
        aria-label="פתח צ'אט"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
