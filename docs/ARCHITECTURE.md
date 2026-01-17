# PiterPay Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        PiterPay PWA                              │
├─────────────────────────────────────────────────────────────────┤
│  Frontend (Next.js 16+ App Router)                              │
│  ├── Pages (src/app/)                                           │
│  ├── Components (src/components/)                               │
│  ├── Hooks (src/hooks/)                                         │
│  └── Services (src/services/)                                   │
├─────────────────────────────────────────────────────────────────┤
│  PWA Layer                                                       │
│  ├── Service Worker (public/sw-push.js)                         │
│  ├── Manifest (public/manifest.json)                            │
│  └── Push Notifications                                          │
├─────────────────────────────────────────────────────────────────┤
│  Supabase (Backend-as-a-Service)                                │
│  ├── PostgreSQL Database                                         │
│  ├── Row Level Security (RLS)                                   │
│  ├── Authentication                                              │
│  └── Edge Functions                                              │
└─────────────────────────────────────────────────────────────────┘
```

## Directory Structure

```
piter-pay-replica/
├── .claude/               # Claude AI configuration
│   ├── skills/            # Project skills
│   └── commands/          # Slash commands
├── docs/                  # Documentation
├── public/                # Static assets & PWA files
│   ├── manifest.json      # PWA manifest
│   ├── sw-push.js         # Push service worker
│   └── icons/             # App icons
├── src/
│   ├── app/               # Next.js App Router pages
│   │   ├── layout.tsx     # Root layout
│   │   ├── page.tsx       # Home page
│   │   ├── dashboard/     # Dashboard page
│   │   ├── budget/        # Budget management
│   │   ├── login/         # Authentication
│   │   └── ...
│   ├── components/        # React components
│   │   ├── ui/            # shadcn/ui components
│   │   └── layout/        # Layout components
│   ├── hooks/             # Custom React hooks
│   ├── services/          # Business logic
│   ├── schemas/           # Zod validation
│   ├── types/             # TypeScript types
│   ├── utils/             # Utility functions
│   ├── constants/         # App constants
│   └── integrations/      # External services
│       └── supabase/      # Supabase client
├── tests/                 # Test files
└── package.json
```

## Data Flow

```
User Action
    │
    ▼
React Component
    │
    ├── useState/useReducer (local state)
    │
    ├── Custom Hooks (usePushNotifications, etc.)
    │
    └── Services (business logic)
            │
            ▼
    Supabase Client
            │
            ├── Authentication check
            │
            └── RLS Policy enforcement
                    │
                    ▼
            PostgreSQL Database
                    │
                    └── project_id = 'piterpay' isolation
```

## Authentication Flow

```
1. User enters credentials
        │
        ▼
2. supabase.auth.signInWithPassword()
        │
        ▼
3. JWT token stored in browser
        │
        ▼
4. All subsequent requests include JWT
        │
        ▼
5. RLS policies check JWT claims:
   - auth.uid() → user's UUID
   - auth.jwt() → app_metadata.project_id
        │
        ▼
6. Data filtered by:
   - user_id match
   - project_id = 'piterpay'
```

## Security Layers

### Layer 1: Client-Side
- ANON_KEY only (no SERVICE_ROLE_KEY)
- Input validation with Zod schemas
- Secure credential storage

### Layer 2: Transport
- HTTPS only
- JWT in Authorization header
- Secure cookies for session

### Layer 3: Database (RLS)
- Row Level Security on all tables
- project_id isolation for multi-tenancy
- User-specific data access

## Technology Choices

| Component | Technology | Rationale |
|-----------|------------|-----------|
| Framework | Next.js 16+ | SSR, App Router, excellent DX |
| Language | TypeScript | Type safety, better tooling |
| Styling | Tailwind + shadcn/ui | Rapid development, consistent design |
| Database | Supabase | Real-time, RLS, built-in auth |
| PWA | next-pwa | Easy PWA setup with Next.js |
| Testing | Playwright | Cross-browser E2E testing |
