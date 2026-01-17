/**
 * User-related type definitions
 */

export interface PiterPayUser {
  id: string;
  auth_user_id: string;
  email: string;
  display_name: string | null;
  project_id: string;
  created_at: string;
  updated_at: string | null;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl?: string;
  createdAt: Date;
}

export interface AuthState {
  user: PiterPayUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends LoginCredentials {
  displayName?: string;
}

export type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: PiterPayUser }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: PiterPayUser | null };
