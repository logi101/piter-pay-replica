# /clean - Clean Build Artifacts

Clean build artifacts and cache.

## Commands

### Clean Next.js build
```bash
rm -rf .next
```

### Clean all caches
```bash
rm -rf .next node_modules/.cache
```

### Full clean (requires npm install after)
```bash
rm -rf .next node_modules package-lock.json
npm install
```

### Clean test artifacts
```bash
rm -rf test-results playwright-report
```

## When to Clean
- Build errors that don't make sense
- After updating dependencies
- After switching branches
- When cache seems corrupted
- Before creating production build

## Full Reset
```bash
# Nuclear option - removes everything
rm -rf .next node_modules test-results playwright-report package-lock.json

# Reinstall
npm install

# Rebuild
npm run build
```
