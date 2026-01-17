# Testing Skill

## Overview
This skill provides guidelines for testing the PiterPay application.

## Testing Stack
- **E2E Tests**: Playwright
- **Unit Tests**: Vitest (planned)
- **Component Tests**: React Testing Library (planned)

## Test Directory Structure
```
tests/
├── e2e/                    # End-to-end tests
│   ├── auth.spec.ts        # Authentication flows
│   ├── dashboard.spec.ts   # Dashboard functionality
│   ├── transactions.spec.ts # Transaction management
│   └── budget.spec.ts      # Budget features
├── unit/                   # Unit tests (planned)
│   ├── utils/              # Utility function tests
│   ├── schemas/            # Schema validation tests
│   └── services/           # Service layer tests
└── fixtures/               # Test data fixtures
    └── test-data.ts
```

## Writing E2E Tests

### Basic Structure
```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup before each test
    await page.goto('/');
  });

  test('should perform expected action', async ({ page }) => {
    // Arrange
    await page.fill('[data-testid="input"]', 'value');

    // Act
    await page.click('[data-testid="submit"]');

    // Assert
    await expect(page.locator('[data-testid="result"]')).toBeVisible();
  });
});
```

### Testing with Authentication
```typescript
test('authenticated user flow', async ({ page }) => {
  // Login first
  await page.goto('/login');
  await page.fill('[data-testid="email"]', 'test@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="login-button"]');

  // Wait for redirect
  await page.waitForURL('/dashboard');

  // Continue with authenticated tests
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});
```

## Test Data Isolation
Always use test-specific data to avoid conflicts:
```typescript
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!'
};
```

## Running Tests

### All Tests
```bash
npm test
# or
npx playwright test
```

### Specific Test File
```bash
npx playwright test tests/e2e/dashboard.spec.ts
```

### Debug Mode
```bash
npx playwright test --debug
```

### UI Mode
```bash
npx playwright test --ui
```

### With Specific Browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Coverage Goals
- **Critical Paths**: 100% coverage
  - Authentication
  - Transaction creation
  - Budget management
- **UI Components**: 80% coverage
- **Utility Functions**: 90% coverage

## Playwright Configuration
See `playwright.config.ts` for:
- Base URL configuration
- Browser settings
- Screenshot on failure
- Video recording settings
- Retry settings
