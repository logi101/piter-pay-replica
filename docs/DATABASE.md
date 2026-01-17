# PiterPay Database Documentation

## Overview
PiterPay uses Supabase (PostgreSQL) as its database with Row Level Security (RLS) for data isolation.

## Connection Details
- **URL**: https://gjodmuxsdkjqhkqjkmnp.supabase.co
- **Project ID**: piterpay (for multi-tenant isolation)
- **Auth**: ANON_KEY + User Authentication

## Schema Diagram

```
┌─────────────────────┐      ┌──────────────────────────┐
│   auth.users        │      │    piterpay_users        │
│   (Supabase Auth)   │◄─────│                          │
├─────────────────────┤      ├──────────────────────────┤
│ id (UUID)           │      │ id (UUID) PK             │
│ email               │      │ auth_user_id FK          │
│ ...                 │      │ email                    │
└─────────────────────┘      │ display_name             │
                             │ project_id               │
                             │ created_at               │
                             │ updated_at               │
                             └──────────────────────────┘
                                        │
                                        │ 1:N
                                        ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│   piterpay_accounts      │  │  piterpay_transactions   │
├──────────────────────────┤  ├──────────────────────────┤
│ id (UUID) PK             │  │ id (UUID) PK             │
│ user_id FK               │  │ user_id FK               │
│ name                     │◄─│ account_id FK            │
│ type (enum)              │  │ amount (decimal)         │
│ balance (decimal)        │  │ type (enum)              │
│ currency                 │  │ category                 │
│ project_id               │  │ description              │
│ created_at               │  │ date                     │
└──────────────────────────┘  │ project_id               │
                              │ created_at               │
                              └──────────────────────────┘
                                        │
                                        │ N:1
                                        ▼
                             ┌──────────────────────────┐
                             │    piterpay_budgets      │
                             ├──────────────────────────┤
                             │ id (UUID) PK             │
                             │ user_id FK               │
                             │ category                 │
                             │ amount (decimal)         │
                             │ period (enum)            │
                             │ project_id               │
                             │ created_at               │
                             └──────────────────────────┘
```

## Tables

### piterpay_users
User profiles linked to Supabase Auth.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY, DEFAULT uuid_generate_v4() |
| auth_user_id | UUID | REFERENCES auth.users(id) |
| email | TEXT | NOT NULL |
| display_name | TEXT | |
| project_id | TEXT | DEFAULT 'piterpay' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |
| updated_at | TIMESTAMPTZ | |

### piterpay_transactions
Financial transactions (income, expenses, transfers).

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | REFERENCES piterpay_users(id) |
| account_id | UUID | REFERENCES piterpay_accounts(id) |
| amount | DECIMAL(12,2) | NOT NULL |
| type | TEXT | CHECK (type IN ('income', 'expense', 'transfer')) |
| category | TEXT | |
| description | TEXT | |
| date | DATE | |
| project_id | TEXT | DEFAULT 'piterpay' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### piterpay_accounts
Bank accounts, cards, and cash tracking.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | REFERENCES piterpay_users(id) |
| name | TEXT | NOT NULL |
| type | TEXT | CHECK (type IN ('checking', 'savings', 'credit', 'cash')) |
| balance | DECIMAL(12,2) | DEFAULT 0 |
| currency | TEXT | DEFAULT 'ILS' |
| project_id | TEXT | DEFAULT 'piterpay' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### piterpay_budgets
Budget tracking by category.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | REFERENCES piterpay_users(id) |
| category | TEXT | NOT NULL |
| amount | DECIMAL(12,2) | NOT NULL |
| period | TEXT | CHECK (period IN ('monthly', 'weekly', 'yearly')) |
| project_id | TEXT | DEFAULT 'piterpay' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

### push_subscriptions
Push notification subscriptions.

| Column | Type | Constraints |
|--------|------|-------------|
| id | UUID | PRIMARY KEY |
| user_id | UUID | REFERENCES auth.users(id) |
| endpoint | TEXT | NOT NULL |
| p256dh | TEXT | NOT NULL |
| auth | TEXT | NOT NULL |
| project_id | TEXT | DEFAULT 'piterpay' |
| created_at | TIMESTAMPTZ | DEFAULT NOW() |

## Row Level Security (RLS)

### Policy Pattern
All tables use the same isolation pattern:

```sql
-- Helper function
CREATE OR REPLACE FUNCTION get_user_project_id()
RETURNS TEXT AS $$
BEGIN
  RETURN COALESCE(
    (auth.jwt() -> 'app_metadata' ->> 'project_id'),
    'piterpay'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Select policy
CREATE POLICY "select_own_data" ON table_name
  FOR SELECT
  USING (
    project_id = get_user_project_id()
    AND user_id IN (
      SELECT id FROM piterpay_users
      WHERE auth_user_id = auth.uid()
    )
  );

-- Insert policy
CREATE POLICY "insert_own_data" ON table_name
  FOR INSERT
  WITH CHECK (project_id = get_user_project_id());
```

## Indexes

```sql
-- Performance indexes
CREATE INDEX idx_transactions_user_date
  ON piterpay_transactions(user_id, date DESC);

CREATE INDEX idx_transactions_category
  ON piterpay_transactions(category);

CREATE INDEX idx_accounts_user
  ON piterpay_accounts(user_id);

CREATE INDEX idx_budgets_user_category
  ON piterpay_budgets(user_id, category);
```

## Common Queries

### Get user's transactions this month
```sql
SELECT * FROM piterpay_transactions
WHERE user_id = $1
  AND date >= date_trunc('month', CURRENT_DATE)
  AND date < date_trunc('month', CURRENT_DATE) + INTERVAL '1 month'
ORDER BY date DESC;
```

### Get budget vs actual spending
```sql
SELECT
  b.category,
  b.amount as budget,
  COALESCE(SUM(t.amount), 0) as spent,
  b.amount - COALESCE(SUM(t.amount), 0) as remaining
FROM piterpay_budgets b
LEFT JOIN piterpay_transactions t
  ON t.category = b.category
  AND t.type = 'expense'
  AND t.date >= date_trunc('month', CURRENT_DATE)
WHERE b.user_id = $1
GROUP BY b.id, b.category, b.amount;
```
