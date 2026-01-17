# PiterPay Project Guide Skill

## Overview
This skill provides guidance for developing and maintaining the PiterPay financial management PWA.

## Project Context
PiterPay is a Progressive Web App for personal finance management built with:
- **Frontend**: Next.js 16+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **PWA**: next-pwa with push notifications

## Key Principles

### 1. Security First
- **NEVER** use SERVICE_ROLE_KEY
- All access via ANON_KEY + User Authentication
- Multi-tenant isolation with `project_id = 'piterpay'`
- RLS policies enforce data isolation

### 2. Code Organization
```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
│   ├── ui/        # shadcn/ui components
│   └── layout/    # Layout components
├── hooks/         # Custom React hooks
├── services/      # Business logic services
├── schemas/       # Zod validation schemas
├── types/         # TypeScript type definitions
├── utils/         # Utility functions
├── constants/     # Application constants
└── integrations/  # External service integrations
```

### 3. Naming Conventions
- **Files**: kebab-case (`push-notifications.ts`)
- **Components**: PascalCase (`PushNotificationSettings.tsx`)
- **Hooks**: camelCase with `use` prefix (`usePushNotifications.ts`)
- **Types**: PascalCase with descriptive names
- **Constants**: SCREAMING_SNAKE_CASE

### 4. Database Tables
All PiterPay tables are prefixed with `piterpay_`:
- `piterpay_users` - User profiles
- `piterpay_transactions` - Financial transactions
- `piterpay_accounts` - Bank accounts and cards
- `piterpay_budgets` - Budget tracking
- `push_subscriptions` - Push notification subscriptions

## Common Tasks

### Adding a New Feature
1. Create types in `src/types/`
2. Create Zod schemas in `src/schemas/`
3. Implement service layer in `src/services/`
4. Create UI components in `src/components/`
5. Add page in `src/app/`
6. Write tests in `tests/`

### Database Operations
```typescript
import { supabase } from '@/integrations/supabase/client';

// Always include project_id for inserts
const { data, error } = await supabase
  .from('piterpay_transactions')
  .insert({
    ...transactionData,
    project_id: 'piterpay'
  });
```

## Testing
```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/specific-test.spec.ts
```

## Development Commands
```bash
# Start dev server
npm run dev -- -p 5178

# Build for production
npm run build

# Type check
npx tsc --noEmit
```
