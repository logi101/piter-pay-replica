# /lint - Run Linter

Run ESLint to check code quality.

## Commands

### Check for issues
```bash
npx eslint src/
```

### Fix auto-fixable issues
```bash
npx eslint src/ --fix
```

### Check specific file
```bash
npx eslint src/components/MyComponent.tsx
```

## Configuration
ESLint config is in `eslint.config.mjs`

## Common Issues

### Missing dependencies in hooks
```typescript
// Error: React Hook useEffect has missing dependencies
useEffect(() => {
  fetchData(userId);
}, []); // Add userId to dependencies
```

### Unused variables
```typescript
// Warning: 'unused' is defined but never used
const unused = 'value'; // Remove or use the variable
```
