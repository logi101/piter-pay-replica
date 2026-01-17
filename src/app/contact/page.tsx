"use client";

import { useState } from "react";
import { Mail, Phone, MessageCircle, ArrowRight, Send } from "lucide-react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement form submission
    alert("ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.");
    setFormData({ name: "", email: "", subject: "", message: "" });
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
        <div className="mb-6">
          <Link
            href="/about"
            className="flex items-center gap-2 text-emerald-600 hover:text-emerald-700 transition-colors text-sm"
          >
            <ArrowRight className="w-4 h-4" />
            חזרה לאודות
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 justify-end">
                צור קשר
                <MessageCircle className="w-6 h-6 text-emerald-600" />
              </CardTitle>
            </CardHeader>
            <CardContent className="text-right space-y-6">
              <p className="text-slate-600">
                יש לך שאלה או הצעה? נשמח לשמוע ממך! ניתן לפנות אלינו באחת הדרכים הבאות:
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3 justify-end">
                  <div>
                    <p className="font-medium text-slate-900">אימייל</p>
                    <p className="text-sm text-slate-500">support@piterpay.com</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Mail className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>

                <div className="flex items-center gap-3 justify-end">
                  <div>
                    <p className="font-medium text-slate-900">טלפון</p>
                    <p className="text-sm text-slate-500">*6789</p>
                  </div>
                  <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Phone className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                  שעות פעילות: א'-ה' 09:00-18:00
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 justify-end">
                שלח הודעה
                <Send className="w-6 h-6 text-emerald-600" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-right block">שם מלא</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="הכנס את שמך"
                    required
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-right block">אימייל</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="your@email.com"
                    required
                    className="text-right"
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="text-right block">נושא</Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="במה נוכל לעזור?"
                    required
                    className="text-right"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message" className="text-right block">הודעה</Label>
                  <Textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="כתוב את הודעתך כאן..."
                    required
                    rows={4}
                    className="text-right"
                  />
                </div>

                <Button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600">
                  שלח הודעה
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
