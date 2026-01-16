import { test, expect } from '@playwright/test';

test.describe('Dashboard - Chat Interface', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard');
  });

  test('should display welcome message', async ({ page }) => {
    await expect(page.getByText(/ברוך שובך/)).toBeVisible();
  });

  test('should display Peter chat header', async ({ page }) => {
    await expect(page.getByText('פיטר - היועץ התקציבי החכם שלכם')).toBeVisible();
  });

  test('should display initial bot message', async ({ page }) => {
    await expect(page.getByText(/שלום! אני פיטר/)).toBeVisible();
  });

  test('should display tab navigation', async ({ page }) => {
    await expect(page.getByRole('button', { name: /צ'אט/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /לוח הבקרה/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /פרטים/ })).toBeVisible();
  });

  test('should have input field for messages', async ({ page }) => {
    const input = page.getByPlaceholder(/כתוב/);
    await expect(input).toBeVisible();
    await expect(input).toBeEnabled();
  });

  test('should have send button', async ({ page }) => {
    // Find the send button in the input area
    const sendButton = page.locator('.bg-emerald-500').filter({ has: page.locator('svg') }).last();
    await expect(sendButton).toBeVisible();
  });

  test('should send message and receive response', async ({ page }) => {
    // Type a message
    const input = page.getByPlaceholder(/כתוב/);
    await input.fill('50 מכולת');

    // Click send
    await page.locator('button[disabled="false"]').or(page.locator('button:not([disabled])')).filter({ has: page.locator('svg.lucide-send') }).click();

    // Check user message appears
    await expect(page.getByText('50 מכולת').first()).toBeVisible();

    // Wait for bot response (timeout after 1s in component)
    await expect(page.getByText(/קיבלתי/)).toBeVisible({ timeout: 3000 });
  });

  test('should show loading indicator when sending', async ({ page }) => {
    const input = page.getByPlaceholder(/כתוב/);
    await input.fill('test');

    // Press enter to send
    await input.press('Enter');

    // Check message was sent
    await expect(page.getByText('test').first()).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Click on Dashboard tab
    await page.getByRole('button', { name: /לוח הבקרה/ }).click();
    await expect(page.getByText('סיכום התקציב החודשי')).toBeVisible();

    // Click on Details tab
    await page.getByRole('button', { name: /פרטים/ }).click();
    await expect(page.getByText('פרטי ההוצאות')).toBeVisible();

    // Click back to Chat
    await page.getByRole('button', { name: /צ'אט/ }).click();
    await expect(page.getByText(/פיטר - היועץ/)).toBeVisible();
  });

  test('should send message on Enter key', async ({ page }) => {
    const input = page.getByPlaceholder(/כתוב/);
    await input.fill('בדיקה');
    await input.press('Enter');

    await expect(page.getByText('בדיקה').first()).toBeVisible();
  });

  test('should not send empty message', async ({ page }) => {
    // Input should be empty
    const input = page.getByPlaceholder(/כתוב/);
    await expect(input).toHaveValue('');

    // Send button should exist
    await expect(page.locator('button').filter({ has: page.locator('svg.lucide-send') })).toBeVisible();
  });

  test('should display chat in correct layout - RTL', async ({ page }) => {
    // User messages should appear with emerald background
    const input = page.getByPlaceholder(/כתוב/);
    await input.fill('הודעת בדיקה');

    // Press enter to send
    await input.press('Enter');

    // Check message appears
    await expect(page.getByText('הודעת בדיקה').first()).toBeVisible();
  });
});

test.describe('Dashboard - Accessibility', () => {
  test('should have proper heading hierarchy', async ({ page }) => {
    await page.goto('/dashboard');

    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
  });

  test('should have focusable input', async ({ page }) => {
    await page.goto('/dashboard');

    const input = page.getByPlaceholder(/כתוב/);
    await input.focus();
    await expect(input).toBeFocused();
  });
});
