"use client";

import { useState } from "react";
import { Users, UserPlus, Mail, Trash2, Shield, MessageCircle } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MemberRole = "admin" | "member" | "viewer";

interface HouseholdMember {
  id: string;
  name: string;
  email: string;
  role: MemberRole;
  avatar?: string;
}

const roleConfig: Record<MemberRole, { label: string; color: string }> = {
  admin: { label: "מנהל", color: "text-emerald-600 bg-emerald-50" },
  member: { label: "חבר", color: "text-blue-600 bg-blue-50" },
  viewer: { label: "צופה", color: "text-slate-600 bg-slate-100" },
};

const initialMembers: HouseholdMember[] = [
  {
    id: "1",
    name: "ew5933070",
    email: "ew5933070@gmail.com",
    role: "admin",
  },
];

export default function HouseholdPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [members, setMembers] = useState<HouseholdMember[]>(initialMembers);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  const handleInvite = () => {
    if (inviteEmail.trim() && inviteEmail.includes("@")) {
      setMembers([
        ...members,
        {
          id: Date.now().toString(),
          name: inviteEmail.split("@")[0],
          email: inviteEmail,
          role: "member",
        },
      ]);
      setInviteEmail("");
      setIsInviting(false);
    }
  };

  const handleRemoveMember = (id: string) => {
    if (members.find((m) => m.id === id)?.role !== "admin") {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  const handleRoleChange = (id: string, newRole: MemberRole) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, role: newRole } : m))
    );
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
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={() => setIsInviting(true)}
            className="bg-emerald-500 hover:bg-emerald-600"
          >
            <UserPlus className="w-4 h-4 ml-2" />
            הזמן חבר
          </Button>
          <div className="text-right">
            <h1 className="text-2xl font-bold text-slate-900">ניהול משק בית</h1>
            <p className="text-slate-500 mt-1">
              נהל את חברי משק הבית שלך
            </p>
          </div>
        </div>

        {/* Household Info Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 justify-end">
              משק הבית שלי
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">{members.length}</p>
                <p className="text-sm text-slate-500">חברים</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-slate-900">
                  {members.filter((m) => m.role === "admin").length}
                </p>
                <p className="text-sm text-slate-500">מנהלים</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-lg">
                <p className="text-2xl font-bold text-emerald-600">פעיל</p>
                <p className="text-sm text-slate-500">סטטוס</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invite Form */}
        {isInviting && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>הזמן חבר חדש</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-slate-400" />
                <Input
                  type="email"
                  placeholder="הזן כתובת אימייל"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 text-right"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setIsInviting(false)}
                  className="flex-1"
                >
                  ביטול
                </Button>
                <Button
                  onClick={handleInvite}
                  className="flex-1 bg-emerald-500 hover:bg-emerald-600"
                >
                  שלח הזמנה
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Members List */}
        <Card>
          <CardHeader>
            <CardTitle>חברי משק הבית</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-200">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {member.role !== "admin" && (
                      <button
                        onClick={() => handleRemoveMember(member.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <select
                      value={member.role}
                      onChange={(e) =>
                        handleRoleChange(member.id, e.target.value as MemberRole)
                      }
                      disabled={member.role === "admin"}
                      className={cn(
                        "px-3 py-1 rounded-lg text-sm",
                        roleConfig[member.role].color
                      )}
                    >
                      <option value="admin">מנהל</option>
                      <option value="member">חבר</option>
                      <option value="viewer">צופה</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="font-medium text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      {member.role === "admin" ? (
                        <Shield className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <span className="text-emerald-600 font-medium">
                          {member.name[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Floating Chat Button */}
      <button className="fixed bottom-6 left-6 w-12 h-12 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors flex items-center justify-center">
        <MessageCircle className="w-6 h-6" />
      </button>
    </div>
  );
}
