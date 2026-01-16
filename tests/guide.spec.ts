import { test, expect } from '@playwright/test';

test.describe('User Guide Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/guide');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'מדריך למשתמש' })).toBeVisible();
  });

  test('should display subtitle', async ({ page }) => {
    await expect(page.getByText('למד כיצד להשתמש ב-PiterPay בצורה הטובה ביותר')).toBeVisible();
  });

  test('should display guide icon', async ({ page }) => {
    // Look for the book icon container
    await expect(page.locator('.w-16.h-16.bg-emerald-100')).toBeVisible();
  });

  test('should display search field', async ({ page }) => {
    await expect(page.getByPlaceholder('חפש במדריך...')).toBeVisible();
  });

  test('should display all guide sections', async ({ page }) => {
    await expect(page.getByText('התחלה מהירה')).toBeVisible();
    await expect(page.getByText('רישום הוצאות')).toBeVisible();
    await expect(page.getByText('ניהול תקציב')).toBeVisible();
    await expect(page.getByText('שאלות נפוצות')).toBeVisible();
  });

  test('should display section icons', async ({ page }) => {
    await expect(page.getByText('🚀')).toBeVisible();
    await expect(page.getByText('💰')).toBeVisible();
    await expect(page.getByText('📊')).toBeVisible();
    await expect(page.getByText('❓')).toBeVisible();
  });

  test('first section should be expanded by default', async ({ page }) => {
    // First section content should be visible
    await expect(page.getByText(/ברוכים הבאים ל-PiterPay/)).toBeVisible();
  });

  test('should expand/collapse sections on click', async ({ page }) => {
    // Click on "רישום הוצאות" section header by finding the heading
    await page.getByText('רישום הוצאות').first().click();

    // Its content should be visible
    await expect(page.getByText(/דרכים לרשום הוצאות/)).toBeVisible();
  });

  test('should filter sections by search', async ({ page }) => {
    // Search for specific term
    await page.getByPlaceholder('חפש במדריך...').fill('הוצאות');

    // Should show sections containing "הוצאות"
    await expect(page.getByText('רישום הוצאות')).toBeVisible();
  });

  test('should display contact support section', async ({ page }) => {
    await expect(page.getByText(/לא מצאת את מה שחיפשת/)).toBeVisible();
    await expect(page.getByRole('button', { name: /פתח צ'אט עם פיטר/ })).toBeVisible();
  });

  test('section should have expand/collapse functionality', async ({ page }) => {
    // Click on a collapsed section
    await page.getByText('שאלות נפוצות').first().click();

    // Content should appear
    await expect(page.getByText(/שאלות שאפשר לשאול את פיטר/)).toBeVisible();
  });
});

test.describe('Guide Page - Content', () => {
  test('quick start section should have numbered steps', async ({ page }) => {
    await page.goto('/guide');

    // Check for numbered list items in the expanded first section
    await expect(page.getByText(/הגדר את התקציב שלך/)).toBeVisible();
  });

  test('expense recording section should have examples', async ({ page }) => {
    await page.goto('/guide');

    // Expand expense section
    await page.getByText('רישום הוצאות').first().click();

    // Check for examples
    await expect(page.getByText(/50 מכולת/)).toBeVisible();
  });

  test('FAQ section should have commands', async ({ page }) => {
    await page.goto('/guide');

    // Expand FAQ section
    await page.getByText('שאלות נפוצות').first().click();

    // Check for command examples
    await expect(page.getByText(/מה היתרה/)).toBeVisible();
  });
});
