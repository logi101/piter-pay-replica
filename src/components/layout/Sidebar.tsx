"use client";

import { X, MessageCircle, Sparkles, LayoutDashboard, Calendar, CheckSquare, Settings, BarChart3, User, Users, BookOpen, Info, LogOut, RefreshCw } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
}

const menuItems = [
  { href: "/dashboard", label: "צ'אט עם פיטר", icon: MessageCircle, active: true },
  { href: "/tinkerbell", label: "צ'אט עם ThinkerBill - לא בשימוש", icon: Sparkles, disabled: true },
  { href: "/savings", label: "לוח הבקרה", icon: LayoutDashboard },
  { href: "/monthly-overview", label: "מעקב חודשי", icon: Calendar },
  { href: "/tasks", label: "משימות למעקב", icon: CheckSquare },
  { href: "/budget", label: "הגדרות תקציב", icon: Settings },
  { href: "/analysis", label: "ניתוח נתונים - לא בשימוש", icon: BarChart3, disabled: true },
  { href: "/profile", label: "פרופיל לקוח", icon: User },
  { href: "/household", label: "ניהול משק בית", icon: Users },
  { href: "/guide", label: "מדריך למשתמש", icon: BookOpen },
  { href: "/about", label: "אודות", icon: Info },
];

export function Sidebar({ isOpen, onClose, username = "user@example.com" }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-600">PiterPay</span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="text-xs">🧑‍💼</span>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-180px)]">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.disabled ? "#" : item.href}
                onClick={item.disabled ? (e) => e.preventDefault() : onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-right",
                  isActive
                    ? "bg-emerald-50 text-emerald-700"
                    : "text-slate-600 hover:bg-slate-50",
                  item.disabled && "opacity-50 cursor-not-allowed"
                )}
              >
                <span className="flex-1 text-sm">{item.label}</span>
                <Icon className="w-5 h-5" />
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-200 bg-white">
          <p className="text-sm text-slate-500 text-center mb-3">
            מחובר כ: {username}
          </p>
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
              <span>החלף משתמש</span>
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/login"
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <span>התנתק מהמערכת</span>
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}
