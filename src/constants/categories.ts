/**
 * Category constants and definitions
 */

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'מזון', icon: '🍽️' },
  { id: 'groceries', label: 'מכולת', icon: '🛒' },
  { id: 'transportation', label: 'תחבורה', icon: '🚗' },
  { id: 'utilities', label: 'חשבונות', icon: '💡' },
  { id: 'entertainment', label: 'בילויים', icon: '🎬' },
  { id: 'shopping', label: 'קניות', icon: '🛍️' },
  { id: 'health', label: 'בריאות', icon: '💊' },
  { id: 'education', label: 'חינוך', icon: '📚' },
  { id: 'housing', label: 'דיור', icon: '🏠' },
  { id: 'subscriptions', label: 'מנויים', icon: '📱' },
  { id: 'other', label: 'אחר', icon: '📌' },
] as const;

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'משכורת', icon: '💰' },
  { id: 'freelance', label: 'פרילנס', icon: '💼' },
  { id: 'investment', label: 'השקעות', icon: '📈' },
  { id: 'rental', label: 'שכירות', icon: '🏢' },
  { id: 'gift', label: 'מתנה', icon: '🎁' },
  { id: 'refund', label: 'החזר', icon: '↩️' },
  { id: 'other', label: 'אחר', icon: '📌' },
] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  food: '#f87171',
  groceries: '#fb923c',
  transportation: '#fbbf24',
  utilities: '#a3e635',
  entertainment: '#4ade80',
  shopping: '#2dd4bf',
  health: '#22d3ee',
  education: '#60a5fa',
  housing: '#818cf8',
  subscriptions: '#c084fc',
  salary: '#22c55e',
  freelance: '#3b82f6',
  investment: '#8b5cf6',
  rental: '#ec4899',
  gift: '#f43f5e',
  refund: '#14b8a6',
  other: '#94a3b8',
};

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number]['id'];
export type IncomeCategory = typeof INCOME_CATEGORIES[number]['id'];
