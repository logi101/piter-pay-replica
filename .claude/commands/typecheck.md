# /typecheck - TypeScript Type Check

Run TypeScript compiler to check for type errors.

## Command
```bash
npx tsc --noEmit
```

## What it does
- Checks all TypeScript files for type errors
- Does not emit any JavaScript files
- Reports errors to console

## Common Errors

### Missing type
```typescript
// Error: Parameter 'x' implicitly has an 'any' type
function add(x, y) { return x + y; }

// Fix: Add types
function add(x: number, y: number): number { return x + y; }
```

### Type mismatch
```typescript
// Error: Type 'string' is not assignable to type 'number'
const amount: number = "100";

// Fix: Use correct type
const amount: number = 100;
```

### Missing property
```typescript
// Error: Property 'name' does not exist on type 'User'
interface User { id: string; }
const user: User = { id: "1", name: "John" };

// Fix: Add property to interface
interface User { id: string; name: string; }
```

## Configuration
TypeScript config is in `tsconfig.json`
