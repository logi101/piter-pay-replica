# /test - Run Tests

Run the PiterPay test suite.

## Commands

### Run all tests
```bash
npm test
```

### Run specific test file
```bash
npx playwright test tests/e2e/dashboard.spec.ts
```

### Run in debug mode
```bash
npx playwright test --debug
```

### Run with UI
```bash
npx playwright test --ui
```

### Run with specific browser
```bash
npx playwright test --project=chromium
```

## Test Reports
- Reports are saved to `playwright-report/`
- View report: `npx playwright show-report`

## Writing Tests
See `.claude/skills/testing.md` for testing guidelines.
