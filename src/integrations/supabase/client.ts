import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

// ========================================
// Secure Connection Configuration
// ========================================
// IMPORTANT: Only use ANON_KEY - Never SERVICE_ROLE_KEY!
// All access is controlled through RLS + user authentication

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create Supabase client with ANON_KEY (restricted access)
export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Check if Supabase is configured
export const isSupabaseConfigured = (): boolean => {
  return SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '';
};

// ========================================
// Secure Authentication Helper
// ========================================

interface AuthResult {
  user: User | null;
  error: Error | null;
}

/**
 * Sign in with email and password
 * After sign-in, all operations through 'supabase' are restricted by RLS
 */
export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      console.error('[Supabase] Auth error:', error.message);
      return { user: null, error };
    }

    console.log(`[Supabase] Signed in as ${data.user?.email}`);
    return { user: data.user, error: null };
  } catch (err) {
    const error = err instanceof Error ? err : new Error('Unknown auth error');
    return { user: null, error };
  }
}

/**
 * Sign out current user
 */
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  console.log('[Supabase] Signed out');
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<User | null> {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser();
  return user !== null;
}

// ========================================
// Auth State Change Listener
// ========================================

export function onAuthStateChange(callback: (user: User | null) => void) {
  return supabase.auth.onAuthStateChange((event, session) => {
    callback(session?.user || null);
  });
}
