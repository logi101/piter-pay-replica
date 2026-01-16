"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

interface HeaderProps {
  username?: string;
  onMenuClick: () => void;
}

export function Header({ username = "user", onMenuClick }: HeaderProps) {
  const initial = username.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
      <div className="flex items-center justify-between h-14 px-4">
        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-emerald-100 border-2 border-emerald-500 flex items-center justify-center text-sm font-medium text-emerald-700">
          {initial}
        </div>

        {/* Logo */}
        <Link href="/dashboard" className="text-xl font-bold text-emerald-600">
          PiterPay
        </Link>

        {/* Menu Button */}
        <button
          onClick={onMenuClick}
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5 text-slate-600" />
        </button>
      </div>
    </header>
  );
}
