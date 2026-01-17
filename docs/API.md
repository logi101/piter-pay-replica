# PiterPay API Documentation

## Overview
PiterPay uses Supabase as its backend. All API operations go through the Supabase client with RLS enforcement.

## Authentication

### Sign In
```typescript
import { signInWithPassword } from '@/integrations/supabase/client';

const { user, error } = await signInWithPassword(
  'user@example.com',
  'password123'
);
```

### Sign Out
```typescript
import { signOut } from '@/integrations/supabase/client';

await signOut();
```

### Get Current User
```typescript
import { getCurrentUser } from '@/integrations/supabase/client';

const user = await getCurrentUser();
```

## Transactions API

### List Transactions
```typescript
const { data, error } = await supabase
  .from('piterpay_transactions')
  .select('*, account:piterpay_accounts(name)')
  .order('date', { ascending: false })
  .limit(50);
```

### Create Transaction
```typescript
const { data, error } = await supabase
  .from('piterpay_transactions')
  .insert({
    user_id: userId,
    account_id: accountId,
    amount: 150.00,
    type: 'expense',
    category: 'food',
    description: 'Groceries',
    date: '2024-01-15',
    project_id: 'piterpay'
  })
  .select()
  .single();
```

### Update Transaction
```typescript
const { data, error } = await supabase
  .from('piterpay_transactions')
  .update({
    amount: 175.00,
    description: 'Updated description'
  })
  .eq('id', transactionId)
  .select()
  .single();
```

### Delete Transaction
```typescript
const { error } = await supabase
  .from('piterpay_transactions')
  .delete()
  .eq('id', transactionId);
```

## Accounts API

### List Accounts
```typescript
const { data, error } = await supabase
  .from('piterpay_accounts')
  .select('*')
  .order('name');
```

### Create Account
```typescript
const { data, error } = await supabase
  .from('piterpay_accounts')
  .insert({
    user_id: userId,
    name: 'Checking Account',
    type: 'checking',
    balance: 5000.00,
    currency: 'ILS',
    project_id: 'piterpay'
  })
  .select()
  .single();
```

### Update Balance
```typescript
const { data, error } = await supabase
  .from('piterpay_accounts')
  .update({ balance: newBalance })
  .eq('id', accountId)
  .select()
  .single();
```

## Budgets API

### List Budgets
```typescript
const { data, error } = await supabase
  .from('piterpay_budgets')
  .select('*')
  .order('category');
```

### Create Budget
```typescript
const { data, error } = await supabase
  .from('piterpay_budgets')
  .insert({
    user_id: userId,
    category: 'food',
    amount: 2000.00,
    period: 'monthly',
    project_id: 'piterpay'
  })
  .select()
  .single();
```

### Get Budget Summary
```typescript
const { data, error } = await supabase
  .rpc('get_budget_summary', { p_user_id: userId });
```

## Push Notifications API

### Subscribe to Push
```typescript
const { error } = await supabase
  .from('push_subscriptions')
  .upsert({
    user_id: userId,
    endpoint: subscription.endpoint,
    p256dh: p256dhKey,
    auth: authKey,
    project_id: 'piterpay'
  }, {
    onConflict: 'user_id,endpoint'
  });
```

### Unsubscribe from Push
```typescript
const { error } = await supabase
  .from('push_subscriptions')
  .delete()
  .eq('user_id', userId)
  .eq('endpoint', endpoint);
```

## Edge Functions

### Send Push Notification
**Endpoint**: `POST /functions/v1/send-push-notification`

**Request**:
```json
{
  "userId": "uuid",
  "title": "Budget Alert",
  "body": "You've exceeded your food budget"
}
```

**Response**:
```json
{
  "success": true,
  "message": "Notification sent"
}
```

## Error Handling

### Common Error Codes
| Code | Description | Solution |
|------|-------------|----------|
| PGRST116 | No rows found | Check query filters |
| 42501 | RLS policy violation | Check project_id and user auth |
| 23505 | Unique constraint violation | Data already exists |
| 23503 | Foreign key violation | Referenced record doesn't exist |

### Error Handling Pattern
```typescript
const { data, error } = await supabase
  .from('table')
  .select('*');

if (error) {
  if (error.code === 'PGRST116') {
    // No data found
    return [];
  }
  console.error('Database error:', error.message);
  throw error;
}

return data;
```

## Rate Limits
- Supabase enforces rate limits based on your plan
- Implement client-side caching for frequently accessed data
- Use pagination for large datasets
