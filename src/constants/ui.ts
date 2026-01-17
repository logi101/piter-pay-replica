/**
 * UI-related constants
 */

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const Z_INDEX = {
  DROPDOWN: 50,
  STICKY: 100,
  FIXED: 200,
  MODAL_BACKDROP: 300,
  MODAL: 400,
  POPOVER: 500,
  TOOLTIP: 600,
  TOAST: 700,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
} as const;

export const TOAST_DURATION = {
  SUCCESS: 3000,
  ERROR: 5000,
  WARNING: 4000,
  INFO: 3000,
} as const;

export const COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#6b7280',
  SUCCESS: '#22c55e',
  WARNING: '#f59e0b',
  ERROR: '#ef4444',
  INFO: '#3b82f6',
} as const;

export const CHART_COLORS = [
  '#3b82f6',
  '#22c55e',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
] as const;

export const ACCOUNT_TYPE_ICONS = {
  checking: '🏦',
  savings: '💰',
  credit: '💳',
  cash: '💵',
} as const;

export const TRANSACTION_TYPE_COLORS = {
  income: '#22c55e',
  expense: '#ef4444',
  transfer: '#3b82f6',
} as const;
