import { test, expect } from '@playwright/test';

test.describe('Budget Settings Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/budget');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'הגדרות תקציב' })).toBeVisible();
  });

  test('should display subtitle', async ({ page }) => {
    await expect(page.getByText('הגדר את קטגוריות התקציב שלך')).toBeVisible();
  });

  test('should display all category tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'הכנסות' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'הוצאות קבועות' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'הוצאות משתנות' })).toBeVisible();
  });

  test('should switch between category tabs', async ({ page }) => {
    // Click on fixed expenses
    await page.getByRole('button', { name: 'הוצאות קבועות' }).click();

    // Tab should be active (has shadow)
    const fixedTab = page.getByRole('button', { name: 'הוצאות קבועות' });
    await expect(fixedTab).toHaveClass(/shadow-sm/);
  });

  test('should display add category button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /הוסף קטגוריה/ })).toBeVisible();
  });

  test('should show add form when clicking add button', async ({ page }) => {
    // Click add category
    await page.getByRole('button', { name: /הוסף קטגוריה/ }).click();

    // Form should appear
    await expect(page.getByPlaceholder('שם הקטגוריה')).toBeVisible();
    await expect(page.getByPlaceholder('סכום')).toBeVisible();
  });

  test('should add new category', async ({ page }) => {
    // Click add category
    await page.getByRole('button', { name: /הוסף קטגוריה/ }).click();

    // Fill form
    await page.getByPlaceholder('שם הקטגוריה').fill('קטגוריה חדשה');
    await page.getByPlaceholder('סכום').fill('1000');

    // Submit - use the specific button in the form (not הוסף קטגוריה)
    await page.locator('button', { hasText: 'הוסף' }).filter({ hasNotText: 'קטגוריה' }).click();

    // New category should appear
    await expect(page.getByText('קטגוריה חדשה')).toBeVisible();
  });

  test('should cancel adding category', async ({ page }) => {
    // Click add category
    await page.getByRole('button', { name: /הוסף קטגוריה/ }).click();

    // Click cancel
    await page.getByRole('button', { name: 'ביטול' }).click();

    // Form should disappear
    await expect(page.getByPlaceholder('שם הקטגוריה')).not.toBeVisible();
  });

  test('should delete category', async ({ page }) => {
    // Switch to a tab with no initial categories first
    await page.getByRole('button', { name: 'קרן ביטחון' }).click();

    // Now add a category
    await page.getByRole('button', { name: /הוסף קטגוריה/ }).click();
    await page.getByPlaceholder('שם הקטגוריה').fill('למחיקה');
    await page.getByPlaceholder('סכום').fill('500');
    await page.locator('button', { hasText: 'הוסף' }).filter({ hasNotText: 'קטגוריה' }).click();

    // Verify it was added
    await expect(page.getByText('למחיקה')).toBeVisible();

    // Find the category row containing "למחיקה" and click its delete button
    const categoryRow = page.locator('.rounded-lg').filter({ hasText: 'למחיקה' });
    await categoryRow.locator('button.text-red-500').click();

    // Should be gone
    await expect(page.getByText('למחיקה')).not.toBeVisible();
  });

  test('should display total for active category', async ({ page }) => {
    await expect(page.getByText(/סה״כ:/)).toBeVisible();
  });

  test('should display empty state when no categories', async ({ page }) => {
    // Switch to a tab with no categories
    await page.getByRole('button', { name: 'קרן ביטחון' }).click();

    await expect(page.getByText('אין קטגוריות מוגדרות עדיין')).toBeVisible();
  });

  test('category items should have edit and delete buttons', async ({ page }) => {
    // Add a category first
    await page.getByRole('button', { name: /הוסף קטגוריה/ }).click();
    await page.getByPlaceholder('שם הקטגוריה').fill('לעריכה');
    await page.getByPlaceholder('סכום').fill('500');
    await page.locator('button', { hasText: 'הוסף' }).filter({ hasNotText: 'קטגוריה' }).click();

    // Check category was added
    await expect(page.getByText('לעריכה')).toBeVisible();

    // Check edit and delete buttons exist by their styling classes (use .first() to avoid strict mode)
    await expect(page.locator('button.text-red-500').first()).toBeVisible(); // delete (red)
    await expect(page.locator('button.text-slate-400').first()).toBeVisible(); // edit (slate)
  });
});

test.describe('Budget Settings - Tab Colors', () => {
  test('tabs should be switchable', async ({ page }) => {
    await page.goto('/budget');

    // Income tab
    await page.getByRole('button', { name: 'הכנסות' }).click();
    await expect(page.getByRole('button', { name: 'הכנסות' })).toHaveClass(/shadow-sm/);

    // Variable expenses
    await page.getByRole('button', { name: 'הוצאות משתנות' }).click();
    await expect(page.getByRole('button', { name: 'הוצאות משתנות' })).toHaveClass(/shadow-sm/);
  });
});
