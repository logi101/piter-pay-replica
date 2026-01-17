"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, MessageCircle, LayoutDashboard, FileText } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

    // Simulate bot response
    setTimeout(() => {
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `קיבלתי את ההוצאה: "${inputValue}". נרשם בהצלחה! 📝`,
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
        {/* Welcome Message */}
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-6">
          היי ew5933070, ברוך שובך!
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
                  placeholder="כתוב '50 פלאפל' או 'החזר 30 מסעדה'..."
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
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              לוח הבקרה
            </h3>
            <p className="text-slate-500">
              כאן יופיע סיכום התקציב החודשי שלך
            </p>
          </div>
        )}

        {/* Details Tab Content */}
        {activeTab === "details" && (
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-slate-700 mb-4">
              פרטים
            </h3>
            <p className="text-slate-500">
              כאן יופיעו פרטי ההוצאות שלך
            </p>
          </div>
        )}
      </main>

      {/* Floating Chat Button */}
      <button
        className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center"
        aria-label="פתח צ'אט"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
