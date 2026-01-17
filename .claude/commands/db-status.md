# /db-status - Check Database Status

Check the status of Supabase database and tables.

## Via Supabase Dashboard
1. Go to https://supabase.com/dashboard
2. Select project: gjodmuxsdkjqhkqjkmnp
3. Navigate to Table Editor

## Via SQL
```sql
-- Check PiterPay tables
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name LIKE 'piterpay_%';

-- Check row counts
SELECT
  'piterpay_users' as table_name, COUNT(*) as count FROM piterpay_users
UNION ALL
SELECT
  'piterpay_transactions', COUNT(*) FROM piterpay_transactions
UNION ALL
SELECT
  'piterpay_accounts', COUNT(*) FROM piterpay_accounts
UNION ALL
SELECT
  'piterpay_budgets', COUNT(*) FROM piterpay_budgets;

-- Check RLS policies
SELECT tablename, policyname, cmd, qual
FROM pg_policies
WHERE tablename LIKE 'piterpay_%';
```

## PiterPay Tables
- `piterpay_users` - User profiles
- `piterpay_transactions` - Financial transactions
- `piterpay_accounts` - Bank accounts
- `piterpay_budgets` - Budget tracking
- `push_subscriptions` - Push notification subscriptions

## Connection Info
- URL: https://gjodmuxsdkjqhkqjkmnp.supabase.co
- Project ID: piterpay (for data isolation)
