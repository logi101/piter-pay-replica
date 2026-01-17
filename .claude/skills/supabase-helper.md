# Supabase Helper Skill

## Overview
This skill provides guidance for working with Supabase in PiterPay.

## Connection Configuration

### Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=https://gjodmuxsdkjqhkqjkmnp.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
PITERPAY_BOT_EMAIL=bot_piterpay@non.local
PITERPAY_BOT_PASSWORD=PiterPay2024!Secure
PITERPAY_PROJECT_ID=piterpay
```

### Client Usage
```typescript
import { supabase } from '@/integrations/supabase/client';

// All operations are automatically restricted by RLS
const { data, error } = await supabase
  .from('piterpay_transactions')
  .select('*');
```

## Multi-Tenant Isolation

### Project ID Requirement
Every insert MUST include `project_id`:
```typescript
// CORRECT
await supabase.from('piterpay_transactions').insert({
  amount: 100,
  description: 'Test',
  project_id: 'piterpay'  // REQUIRED
});

// WRONG - Will fail RLS
await supabase.from('piterpay_transactions').insert({
  amount: 100,
  description: 'Test'
  // Missing project_id!
});
```

### RLS Policy Pattern
All tables use this isolation pattern:
```sql
CREATE POLICY "table_select" ON table_name
  FOR SELECT USING (project_id = get_user_project_id());

CREATE POLICY "table_insert" ON table_name
  FOR INSERT WITH CHECK (project_id = get_user_project_id());
```

## Common Operations

### Authentication
```typescript
import { signInWithPassword, signOut, getCurrentUser } from '@/integrations/supabase/client';

// Sign in
const { user, error } = await signInWithPassword(email, password);

// Get current user
const user = await getCurrentUser();

// Sign out
await signOut();
```

### CRUD Operations

#### Select
```typescript
// Get all user's transactions
const { data, error } = await supabase
  .from('piterpay_transactions')
  .select('*')
  .order('created_at', { ascending: false });

// Get with relations
const { data, error } = await supabase
  .from('piterpay_transactions')
  .select(`
    *,
    account:piterpay_accounts(*)
  `);
```

#### Insert
```typescript
const { data, error } = await supabase
  .from('piterpay_transactions')
  .insert({
    amount: 150.00,
    type: 'expense',
    category: 'food',
    description: 'Groceries',
    project_id: 'piterpay'
  })
  .select()
  .single();
```

#### Update
```typescript
const { data, error } = await supabase
  .from('piterpay_transactions')
  .update({ amount: 200.00 })
  .eq('id', transactionId)
  .select()
  .single();
```

#### Delete
```typescript
const { error } = await supabase
  .from('piterpay_transactions')
  .delete()
  .eq('id', transactionId);
```

## Table Schemas

### piterpay_users
```sql
id UUID PRIMARY KEY
auth_user_id UUID REFERENCES auth.users
email TEXT
display_name TEXT
project_id TEXT DEFAULT 'piterpay'
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

### piterpay_transactions
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES piterpay_users
account_id UUID REFERENCES piterpay_accounts
amount DECIMAL(12,2)
type TEXT (income|expense|transfer)
category TEXT
description TEXT
date DATE
project_id TEXT DEFAULT 'piterpay'
created_at TIMESTAMPTZ
```

### piterpay_accounts
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES piterpay_users
name TEXT
type TEXT (checking|savings|credit|cash)
balance DECIMAL(12,2)
currency TEXT DEFAULT 'ILS'
project_id TEXT DEFAULT 'piterpay'
created_at TIMESTAMPTZ
```

### piterpay_budgets
```sql
id UUID PRIMARY KEY
user_id UUID REFERENCES piterpay_users
category TEXT
amount DECIMAL(12,2)
period TEXT (monthly|weekly|yearly)
project_id TEXT DEFAULT 'piterpay'
created_at TIMESTAMPTZ
```

## Error Handling
```typescript
const { data, error } = await supabase.from('table').select('*');

if (error) {
  console.error('[Supabase Error]:', error.message);
  // Handle specific error codes
  if (error.code === 'PGRST116') {
    // No rows found
  } else if (error.code === '42501') {
    // RLS policy violation
  }
  throw error;
}
```

## Real-time Subscriptions
```typescript
const subscription = supabase
  .channel('transactions')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'piterpay_transactions'
    },
    (payload) => {
      console.log('Change received:', payload);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```
