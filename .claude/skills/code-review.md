# Code Review Skill

## Overview
This skill provides guidelines for reviewing PiterPay code changes.

## Review Checklist

### 1. Security Review
- [ ] No SERVICE_ROLE_KEY usage
- [ ] No hardcoded secrets or credentials
- [ ] All Supabase operations use authenticated client
- [ ] `project_id = 'piterpay'` included in all inserts
- [ ] RLS policies not bypassed
- [ ] Input validation on user inputs
- [ ] No XSS vulnerabilities in rendered content

### 2. TypeScript Quality
- [ ] Strict mode compliance (no `any` unless justified)
- [ ] Proper type definitions for all functions
- [ ] Zod schemas for runtime validation
- [ ] No type assertions without comments

### 3. React Best Practices
- [ ] Proper hook dependencies
- [ ] No unnecessary re-renders
- [ ] Proper error boundaries
- [ ] Loading states handled
- [ ] Accessibility attributes present

### 4. Code Organization
- [ ] Files in correct directories
- [ ] Naming conventions followed
- [ ] Single responsibility principle
- [ ] DRY - no code duplication

### 5. Testing
- [ ] Unit tests for utility functions
- [ ] Integration tests for services
- [ ] E2E tests for critical flows

## Common Issues to Flag

### Security
```typescript
// BAD - Never do this
const supabase = createClient(url, SERVICE_ROLE_KEY);

// GOOD
const supabase = createClient(url, ANON_KEY);
```

### TypeScript
```typescript
// BAD
const data: any = response;

// GOOD
interface ResponseData {
  id: string;
  amount: number;
}
const data: ResponseData = response;
```

### React Hooks
```typescript
// BAD - Missing dependency
useEffect(() => {
  fetchData(userId);
}, []); // userId should be in deps

// GOOD
useEffect(() => {
  fetchData(userId);
}, [userId]);
```

## Review Response Template
```
## Code Review: [PR/File Name]

### Summary
[Brief description of changes]

### Security
- [ ] Passed / [Issues found]

### Quality
- [ ] Types: Passed / [Issues]
- [ ] Tests: Passed / [Missing coverage]
- [ ] Organization: Passed / [Issues]

### Recommendations
1. [Specific improvement suggestions]

### Decision
- [ ] Approve
- [ ] Request Changes
- [ ] Needs Discussion
```
