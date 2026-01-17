/**
 * Central utility exports
 */

// Re-export cn from lib for convenience
export { cn, formatCurrency as formatCurrencySimple, formatDate as formatDateSimple } from '@/lib/utils';

// Format utilities
export {
  formatCurrency,
  formatDate,
  formatShortDate,
  formatPercent,
  formatNumber,
  formatRelativeTime,
} from './format';

// Date utilities
export {
  getStartOfMonth,
  getEndOfMonth,
  getStartOfWeek,
  getEndOfWeek,
  toISODateString,
  parseISODate,
  isSameDay,
  isCurrentMonth,
  getDaysInMonth,
  addDays,
  addMonths,
  getMonthNames,
} from './date';

// Validation utilities
export {
  isValidEmail,
  isValidUUID,
  isPositiveNumber,
  isValidDateString,
  isEmpty,
  isValidPassword,
  sanitizeString,
} from './validation';
