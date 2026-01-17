# PiterPay - Project Documentation

## Project Overview
PiterPay is a financial management PWA (Progressive Web App) built with Next.js, TypeScript, and Tailwind CSS. It provides budget tracking, transaction management, and push notifications for iOS/Android.

---

## Supabase Configuration - MANDATORY SECURITY RULES

### Critical Security Requirements

```
+----------------------------------------------------------+
|  NEVER use SERVICE_ROLE_KEY in this project!             |
|  All access MUST go through ANON_KEY + User Auth         |
+----------------------------------------------------------+
```

### Connection Details

```typescript
// ONLY these credentials are allowed:
SUPABASE_URL = "https://gjodmuxsdkjqhkqjkmnp.supabase.co"
ANON_KEY = "eyJhbGc..." // From NEXT_PUBLIC_SUPABASE_ANON_KEY

// Bot user for backend operations:
BOT_EMAIL = "bot_piterpay@non.local"
BOT_PASSWORD = "PiterPay2024!Secure"
PROJECT_ID = "piterpay"
```

### Multi-Tenant Isolation

This project shares a Supabase instance with other projects. **All PiterPay data is isolated by `project_id = 'piterpay'`**.

| Project | project_id | Tables |
|---------|------------|--------|
| PiterPay | `piterpay` | piterpay_* |
| HireAI | (other) | candidates, positions, etc. |

### Secure Client Usage

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

// CORRECT - Use ANON_KEY only
const supabase = createClient(SUPABASE_URL, ANON_KEY);

// Authenticate before operations
await supabase.auth.signInWithPassword({
  email: BOT_EMAIL,
  password: BOT_PASSWORD
});

// All operations are now restricted by RLS to project_id='piterpay'
```

### Forbidden Patterns

```typescript
// NEVER do this:
const supabase = createClient(url, SERVICE_ROLE_KEY); // FORBIDDEN!
supabase.auth.admin.createUser(...); // FORBIDDEN - requires SERVICE_ROLE
```

---

## Database Schema

### PiterPay Tables

| Table | Description | RLS |
|-------|-------------|-----|
| `piterpay_users` | User profiles linked to auth.users | Enabled |
| `piterpay_transactions` | Income/expense/transfer records | Enabled |
| `piterpay_accounts` | Bank accounts and cards | Enabled |
| `piterpay_budgets` | Budget tracking per category | Enabled |
| `push_subscriptions` | Push notification subscriptions | Enabled |

### RLS Policy Logic

All tables use this isolation pattern:
```sql
-- User can only access their own project's data
USING (project_id = get_user_project_id())
WITH CHECK (project_id = get_user_project_id())
```

The `get_user_project_id()` function reads from `auth.jwt() -> 'app_metadata' ->> 'project_id'`.

---

## Environment Variables

### Required (.env.local)

```bash
# Supabase - ANON_KEY only (no SERVICE_ROLE!)
NEXT_PUBLIC_SUPABASE_URL=https://gjodmuxsdkjqhkqjkmnp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...

# PiterPay Bot User
PITERPAY_BOT_EMAIL=bot_piterpay@non.local
PITERPAY_BOT_PASSWORD=PiterPay2024!Secure
PITERPAY_PROJECT_ID=piterpay

# Push Notifications (VAPID)
NEXT_PUBLIC_VAPID_PUBLIC_KEY=BCmG4iaC0wmlu420clwx...
VAPID_PRIVATE_KEY=SVhy1jcLpDVdg6dJxfmbXSh5hc...
```

---

## Tech Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **PWA**: next-pwa
- **Push**: Web Push API + Service Worker

---

## Key Files

| File | Purpose |
|------|---------|
| `src/integrations/supabase/client.ts` | Secure Supabase client |
| `src/hooks/usePushNotifications.ts` | Push notification hook |
| `src/components/PushNotificationSettings.tsx` | Push settings UI |
| `public/sw-push.js` | Push service worker |
| `public/manifest.json` | PWA manifest |

---

## Security Checklist

Before any commit, verify:

- [ ] No `SERVICE_ROLE_KEY` in code
- [ ] No hardcoded secrets (use .env.local)
- [ ] All Supabase operations use authenticated client
- [ ] `project_id = 'piterpay'` in all inserts
- [ ] RLS policies not bypassed

---

## Development Commands

```bash
# Start dev server
npm run dev -- -p 5178

# Build
npm run build

# Run tests
npm test
```

---

## Edge Functions

### send-push-notification

Deployed at: `https://gjodmuxsdkjqhkqjkmnp.supabase.co/functions/v1/send-push-notification`

Required secrets (set in Supabase Dashboard):
- `VAPID_PUBLIC_KEY`
- `VAPID_PRIVATE_KEY`

---

## Contact

For questions about the shared Supabase setup, contact the admin.
