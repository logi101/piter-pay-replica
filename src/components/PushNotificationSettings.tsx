"use client";

import { useState } from "react";
import { Bell, BellOff, Smartphone, AlertCircle, CheckCircle2, Loader2, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { usePushNotifications } from "@/hooks/usePushNotifications";

export function PushNotificationSettings() {
  const {
    isSupported,
    isSubscribed,
    permission,
    isLoading,
    isiOS,
    isPWA,
    isConfigured,
    subscribe,
    unsubscribe
  } = usePushNotifications();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleToggle = async () => {
    setError(null);
    setSuccess(null);

    try {
      if (isSubscribed) {
        await unsubscribe();
        setSuccess("התראות בוטלו בהצלחה");
      } else {
        await subscribe();
        setSuccess("התראות הופעלו בהצלחה!");
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "שגיאה לא ידועה";
      setError(errorMessage);
    }
  };

  // VAPID key not configured
  if (!isConfigured) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Settings className="w-5 h-5 text-yellow-600" />
            <div className="flex-1">
              <p className="font-medium text-yellow-800">התראות Push לא מוגדרות</p>
              <p className="text-sm text-yellow-600">יש להגדיר VAPID_PUBLIC_KEY ב-.env.local</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // iOS not in PWA mode - show instructions
  if (isiOS && !isPWA) {
    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Smartphone className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-blue-800">התקן את האפליקציה תחילה</p>
              <ol className="text-sm text-blue-600 mt-2 space-y-1 list-decimal list-inside">
                <li>לחץ על כפתור השיתוף בספארי</li>
                <li>גלול למטה ולחץ &quot;הוסף למסך הבית&quot;</li>
                <li>פתח את האפליקציה ממסך הבית</li>
              </ol>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Not supported
  if (!isSupported) {
    return (
      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <BellOff className="w-5 h-5 text-slate-400" />
            <div className="flex-1">
              <p className="font-medium text-slate-600">התראות Push</p>
              <p className="text-sm text-slate-500">לא נתמך בדפדפן זה</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Permission denied
  if (permission === 'denied') {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div className="flex-1">
              <p className="font-medium text-red-700">התראות Push</p>
              <p className="text-sm text-red-600">ההרשאה נדחתה - עדכן בהגדרות הדפדפן</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isSubscribed ? (
              <Bell className="w-5 h-5 text-emerald-500" />
            ) : (
              <BellOff className="w-5 h-5 text-slate-400" />
            )}
            <div>
              <p className="font-medium text-slate-700">התראות Push</p>
              <p className="text-sm text-slate-500">
                {isSubscribed ? "מופעל" : "כבוי"}
              </p>
            </div>
          </div>

          <Button
            onClick={handleToggle}
            disabled={isLoading}
            variant={isSubscribed ? "outline" : "default"}
            className={isSubscribed ? "" : "bg-emerald-500 hover:bg-emerald-600"}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isSubscribed ? (
              "בטל"
            ) : (
              "הפעל"
            )}
          </Button>
        </div>

        {error && (
          <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <p className="text-sm text-emerald-600">{success}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
