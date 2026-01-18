"use client";

import { useState } from "react";
import { Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [isNewUser, setIsNewUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate login - new users go to setup, returning users to dashboard
    setTimeout(() => {
      setIsLoading(false);
      // In real implementation, check if user has household_id
      // For now, use isNewUser state
      router.push(isSignUp ? "/setup" : "/dashboard");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300 flex items-center justify-center p-4">
      <main>
        <Card className="w-full max-w-md shadow-2xl border-0">
        <CardContent className="p-8 md:p-10">
          {isSignUp ? (
            // Sign Up Form
            <div className="space-y-6">
              <button
                onClick={() => setIsSignUp(false)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 transition-colors"
              >
                <ArrowRight className="w-4 h-4" />
                חזרה להתחברות
              </button>

              <div className="text-center">
                <h1 className="text-2xl font-bold text-slate-900">
                  צור את החשבון שלך
                </h1>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    אימייל
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    סיסמה
                  </label>
                  <Input
                    type="password"
                    placeholder="מינימום 8 תווים"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">
                    אימות סיסמה
                  </label>
                  <Input
                    type="password"
                    placeholder="הזן שוב את הסיסמה"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  disabled={isLoading}
                >
                  {isLoading ? "יוצר חשבון..." : "צור חשבון"}
                </Button>
              </form>
            </div>
          ) : (
            // Sign In Form
            <div className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex justify-center">
                  <div className="w-20 h-20 relative">
                    <Image
                      src="/logo.png"
                      alt="PiterPay Logo"
                      fill
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </div>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">
                    Welcome to PiterPay -
                  </h1>
                  <h2 className="text-xl font-bold text-slate-900">
                    היועץ חכם לניהול ההוצאות
                  </h2>
                </div>
                <p className="text-slate-500">התחבר כדי להמשיך</p>
              </div>

              <button
                onClick={() => {
                  setIsLoading(true);
                  setTimeout(() => {
                    setIsLoading(false);
                    router.push("/dashboard");
                  }, 1000);
                }}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                המשך עם Google
              </button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-slate-400">או</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 text-center block">
                    אימייל
                  </label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    icon={<Mail className="w-4 h-4" />}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700 text-center block">
                    סיסמה
                  </label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<Lock className="w-4 h-4" />}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800"
                  disabled={isLoading}
                >
                  {isLoading ? "מתחבר..." : "התחבר"}
                </Button>
              </form>

              <div className="flex items-center justify-between text-sm">
                <button className="text-slate-500 hover:text-slate-700 font-medium transition-colors">
                  שכחת סיסמה?
                </button>
                <button
                  onClick={() => setIsSignUp(true)}
                  className="text-slate-500 hover:text-slate-700 transition-colors"
                >
                  אין לך חשבון? <span className="font-medium">הירשם</span>
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      </main>
    </div>
  );
}
