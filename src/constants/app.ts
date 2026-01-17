/**
 * Application-wide constants
 */

export const APP_NAME = 'PiterPay';
export const APP_DESCRIPTION = 'Personal Finance Management';
export const APP_VERSION = '0.1.0';

export const PROJECT_ID = 'piterpay';

export const DEFAULT_LOCALE = 'he-IL';
export const DEFAULT_CURRENCY = 'ILS';

export const ROUTES = {
  HOME: '/',
  DASHBOARD: '/dashboard',
  BUDGET: '/budget',
  LOGIN: '/login',
  PROFILE: '/profile',
  GUIDE: '/guide',
  ABOUT: '/about',
  MONTHLY_OVERVIEW: '/monthly-overview',
  HOUSEHOLD: '/household',
  TASKS: '/tasks',
  SAVINGS: '/savings',
} as const;

export const API_ENDPOINTS = {
  TRANSACTIONS: 'piterpay_transactions',
  ACCOUNTS: 'piterpay_accounts',
  BUDGETS: 'piterpay_budgets',
  USERS: 'piterpay_users',
  PUSH_SUBSCRIPTIONS: 'push_subscriptions',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  USER_PREFERENCES: 'user_preferences',
  PUSH_SUBSCRIPTION: 'push_subscription',
  THEME: 'theme',
} as const;
