"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "@/integrations/supabase/client";
import type { PiterPayUser, Household, HouseholdProfile } from "@/types";
import { householdService } from "@/services";

interface AuthContextType {
  user: PiterPayUser | null;
  household: Household | null;
  householdProfile: HouseholdProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  hasCompletedSetup: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, displayName?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PiterPayUser | null>(null);
  const [household, setHousehold] = useState<Household | null>(null);
  const [householdProfile, setHouseholdProfile] = useState<HouseholdProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUserData = useCallback(async () => {
    if (!isSupabaseConfigured() || !user) return;

    try {
      // Fetch household if user has one
      if (user.household_id) {
        const fetchedHousehold = await householdService.getById(user.household_id);
        setHousehold(fetchedHousehold);

        if (fetchedHousehold) {
          const profile = await householdService.getProfile(fetchedHousehold.id);
          setHouseholdProfile(profile);
        }
      }
    } catch (err) {
      console.error("[AuthContext] Error refreshing user data:", err);
    }
  }, [user]);

  // Load user on mount
  useEffect(() => {
    const loadUser = async () => {
      if (!isSupabaseConfigured()) {
        // Demo mode - create mock user
        setUser({
          id: "demo-user",
          auth_user_id: "demo-auth",
          email: "demo@piterpay.com",
          display_name: "משתמש דמו",
          household_id: null,
          role: "user",
          project_id: "piterpay",
          created_at: new Date().toISOString(),
          updated_at: null,
        });
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Fetch PiterPay user profile
          const { data: piterpayUser, error: userError } = await supabase
            .from("piterpay_users")
            .select("*")
            .eq("auth_user_id", session.user.id)
            .single();

          if (userError && userError.code !== "PGRST116") {
            throw userError;
          }

          if (piterpayUser) {
            setUser(piterpayUser);
          }
        }
      } catch (err) {
        console.error("[AuthContext] Error loading user:", err);
        setError("שגיאה בטעינת המשתמש");
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();

    // Listen for auth changes
    if (isSupabaseConfigured()) {
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (event === "SIGNED_IN" && session?.user) {
            // Fetch or create PiterPay user
            const { data: piterpayUser, error } = await supabase
              .from("piterpay_users")
              .select("*")
              .eq("auth_user_id", session.user.id)
              .single();

            if (!error && piterpayUser) {
              setUser(piterpayUser);
            }
          } else if (event === "SIGNED_OUT") {
            setUser(null);
            setHousehold(null);
            setHouseholdProfile(null);
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    }
  }, []);

  // Refresh household data when user changes
  useEffect(() => {
    if (user?.household_id) {
      refreshUserData();
    }
  }, [user?.household_id, refreshUserData]);

  const login = async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      setUser({
        id: "demo-user",
        auth_user_id: "demo-auth",
        email: email,
        display_name: email.split("@")[0],
        household_id: null,
        role: "user",
        project_id: "piterpay",
        created_at: new Date().toISOString(),
        updated_at: null,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : "שגיאה בהתחברות";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, displayName?: string) => {
    if (!isSupabaseConfigured()) {
      // Demo mode
      setUser({
        id: "demo-user-new",
        auth_user_id: "demo-auth-new",
        email: email,
        display_name: displayName || email.split("@")[0],
        household_id: null,
        role: "user",
        project_id: "piterpay",
        created_at: new Date().toISOString(),
        updated_at: null,
      });
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // Create PiterPay user profile
      if (data.user) {
        const { error: profileError } = await supabase
          .from("piterpay_users")
          .insert({
            auth_user_id: data.user.id,
            email: email,
            display_name: displayName || email.split("@")[0],
            project_id: "piterpay",
          });

        if (profileError) throw profileError;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "שגיאה בהרשמה";
      setError(message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    if (!isSupabaseConfigured()) {
      setUser(null);
      setHousehold(null);
      setHouseholdProfile(null);
      return;
    }

    setIsLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setHousehold(null);
      setHouseholdProfile(null);
    } catch (err) {
      console.error("[AuthContext] Error logging out:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    household,
    householdProfile,
    isLoading,
    isAuthenticated: !!user,
    hasCompletedSetup: !!user?.household_id,
    error,
    login,
    signup,
    logout,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
