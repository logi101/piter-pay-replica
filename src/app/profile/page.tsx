"use client";

import { useState } from "react";
import { User, Mail, Phone, Calendar, MapPin, Bell, Shield, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PushNotificationSettings } from "@/components/PushNotificationSettings";

export default function ProfilePage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "משתמש",
    email: "ew5933070@gmail.com",
    phone: "",
    birthDate: "",
    address: "",
    notifications: true,
    twoFactor: false,
  });

  const handleSave = () => {
    setIsEditing(false);
    // Save profile logic here
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
        <div className="text-right mb-6">
          <h1 className="text-2xl font-bold text-slate-900">פרופיל לקוח</h1>
          <p className="text-slate-500 mt-1">
            נהל את פרטי החשבון שלך
          </p>
        </div>

        {/* Profile Card */}
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">פרטים אישיים</CardTitle>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="bg-emerald-500 hover:bg-emerald-600"
            >
              {isEditing ? "שמור שינויים" : "ערוך פרופיל"}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center">
                <User className="w-12 h-12 text-emerald-600" />
              </div>
              <div className="text-right">
                <h3 className="text-xl font-bold text-slate-900">{profile.name}</h3>
                <p className="text-slate-500">{profile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-medium text-slate-700 flex items-center gap-2 justify-end">
                  שם מלא
                  <User className="w-4 h-4" />
                </label>
                <Input
                  id="profile-name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-email" className="text-sm font-medium text-slate-700 flex items-center gap-2 justify-end">
                  אימייל
                  <Mail className="w-4 h-4" />
                </label>
                <Input
                  id="profile-email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-phone" className="text-sm font-medium text-slate-700 flex items-center gap-2 justify-end">
                  טלפון
                  <Phone className="w-4 h-4" />
                </label>
                <Input
                  id="profile-phone"
                  type="tel"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                  placeholder="050-000-0000"
                  className="text-right"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-birthdate" className="text-sm font-medium text-slate-700 flex items-center gap-2 justify-end">
                  תאריך לידה
                  <Calendar className="w-4 h-4" />
                </label>
                <Input
                  id="profile-birthdate"
                  type="date"
                  value={profile.birthDate}
                  onChange={(e) => setProfile({ ...profile, birthDate: e.target.value })}
                  disabled={!isEditing}
                  className="text-right"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label htmlFor="profile-address" className="text-sm font-medium text-slate-700 flex items-center gap-2 justify-end">
                  כתובת
                  <MapPin className="w-4 h-4" />
                </label>
                <Input
                  id="profile-address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                  placeholder="הזן כתובת"
                  className="text-right"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">הגדרות חשבון</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Push Notifications */}
            <PushNotificationSettings />

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.notifications}
                  onChange={(e) => setProfile({ ...profile, notifications: e.target.checked })}
                  className="sr-only peer"
                  aria-label="התראות אימייל"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="font-medium text-slate-900">התראות אימייל</p>
                  <p className="text-sm text-slate-500">קבל התראות על פעילות בחשבון</p>
                </div>
                <Mail className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={profile.twoFactor}
                  onChange={(e) => setProfile({ ...profile, twoFactor: e.target.checked })}
                  className="sr-only peer"
                  aria-label="אימות דו-שלבי"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:ring-2 peer-focus:ring-emerald-300 rounded-full peer peer-checked:bg-emerald-500 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-5"></div>
              </label>
              <div className="flex items-center gap-3 text-right">
                <div>
                  <p className="font-medium text-slate-900">אימות דו-שלבי</p>
                  <p className="text-sm text-slate-500">הגן על החשבון עם אימות נוסף</p>
                </div>
                <Shield className="w-5 h-5 text-slate-400" />
              </div>
            </div>

            <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
              מחק חשבון
            </Button>
          </CardContent>
        </Card>
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
