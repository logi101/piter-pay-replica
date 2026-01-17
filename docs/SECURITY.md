# PiterPay Security Documentation

## Security Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                     Security Layers                          │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Layer 1: Client Security                                    │
│  ├── ANON_KEY only (no SERVICE_ROLE_KEY)                     │
│  ├── Input validation (Zod schemas)                          │
│  └── Secure credential handling                              │
│                                                              │
│  Layer 2: Transport Security                                 │
│  ├── HTTPS only                                              │
│  ├── JWT authentication                                      │
│  └── Secure cookies (httpOnly, secure, sameSite)            │
│                                                              │
│  Layer 3: Database Security (RLS)                            │
│  ├── Row Level Security policies                             │
│  ├── project_id isolation                                    │
│  └── User-specific access control                            │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

## Critical Security Rules

### 1. NEVER Use SERVICE_ROLE_KEY
```typescript
// FORBIDDEN - Bypasses all security
const supabase = createClient(url, SERVICE_ROLE_KEY);

// CORRECT - Uses RLS-restricted access
const supabase = createClient(url, ANON_KEY);
```

### 2. Always Include project_id
```typescript
// WRONG - May access other projects' data
await supabase.from('table').insert({ data });

// CORRECT - Isolated to piterpay project
await supabase.from('table').insert({
  ...data,
  project_id: 'piterpay'
});
```

### 3. Validate All Inputs
```typescript
import { z } from 'zod';

const TransactionSchema = z.object({
  amount: z.number().positive(),
  type: z.enum(['income', 'expense', 'transfer']),
  description: z.string().max(500),
});

// Validate before database operation
const validated = TransactionSchema.parse(userInput);
```

## Authentication Security

### JWT Token Handling
- Tokens are automatically managed by Supabase
- Never store tokens in localStorage (use secure cookies)
- Tokens expire after session timeout

### Password Requirements
- Minimum 8 characters
- Mix of uppercase, lowercase, numbers
- Special characters encouraged

### Session Management
```typescript
// Check authentication before sensitive operations
const user = await getCurrentUser();
if (!user) {
  throw new Error('Authentication required');
}
```

## Data Protection

### Sensitive Data
| Data Type | Protection |
|-----------|------------|
| Passwords | Hashed by Supabase Auth |
| API Keys | Environment variables only |
| User data | RLS policies |
| Transactions | User-scoped access |

### Environment Variables
```bash
# .env.local - NEVER commit to git
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
VAPID_PRIVATE_KEY=...
```

### .gitignore Requirements
```
.env.local
.env*.local
*.pem
*.key
```

## RLS Policy Patterns

### Select Policy
```sql
CREATE POLICY "select_own" ON piterpay_transactions
  FOR SELECT USING (
    project_id = get_user_project_id()
    AND user_id = get_current_piterpay_user_id()
  );
```

### Insert Policy
```sql
CREATE POLICY "insert_own" ON piterpay_transactions
  FOR INSERT WITH CHECK (
    project_id = get_user_project_id()
  );
```

### Update/Delete Policy
```sql
CREATE POLICY "modify_own" ON piterpay_transactions
  FOR UPDATE USING (
    project_id = get_user_project_id()
    AND user_id = get_current_piterpay_user_id()
  );
```

## Common Vulnerabilities Prevention

### XSS (Cross-Site Scripting)
- Never render raw HTML from user input
- React escapes content by default - use this protection
- If HTML rendering is needed, sanitize with DOMPurify first

### SQL Injection
```typescript
// SAFE - Supabase uses parameterized queries
supabase.from('users').select('*').eq('id', userId)
```

### CSRF
- Supabase handles CSRF protection
- Use same-site cookies
- Validate request origin

## Security Checklist

Before every deployment:

- [ ] No SERVICE_ROLE_KEY in code
- [ ] No hardcoded credentials
- [ ] All .env variables are secrets
- [ ] RLS policies enabled on all tables
- [ ] project_id included in all inserts
- [ ] Input validation on all user inputs
- [ ] HTTPS enabled in production
- [ ] Error messages don't leak sensitive info

## Incident Response

### If Credentials are Compromised
1. Rotate affected keys immediately
2. Check Supabase audit logs
3. Notify affected users if necessary
4. Update all deployment environments

### Reporting Security Issues
- Contact project maintainer
- Do not disclose publicly until fixed
- Include reproduction steps
