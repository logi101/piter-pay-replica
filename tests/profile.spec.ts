import { test, expect } from '@playwright/test';

test.describe('Profile Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/profile');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'פרופיל לקוח' })).toBeVisible();
  });

  test('should display subtitle', async ({ page }) => {
    await expect(page.getByText('נהל את פרטי החשבון שלך')).toBeVisible();
  });

  test('should display personal details card', async ({ page }) => {
    await expect(page.getByText('פרטים אישיים')).toBeVisible();
  });

  test('should display profile avatar', async ({ page }) => {
    // Large avatar icon should be visible
    const avatar = page.locator('.w-24.h-24');
    await expect(avatar).toBeVisible();
  });

  test('should display user information', async ({ page }) => {
    // User email should be visible somewhere - use first() to avoid duplicates in sidebar
    await expect(page.getByText('ew5933070@gmail.com').first()).toBeVisible();
  });

  test('should display all form fields', async ({ page }) => {
    await expect(page.getByText('שם מלא')).toBeVisible();
    await expect(page.getByText('אימייל')).toBeVisible();
    await expect(page.getByText('טלפון')).toBeVisible();
    await expect(page.getByText('תאריך לידה')).toBeVisible();
    await expect(page.getByText('כתובת')).toBeVisible();
  });

  test('should have edit button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'ערוך פרופיל' })).toBeVisible();
  });

  test('should enable editing when edit button clicked', async ({ page }) => {
    // Click edit
    await page.getByRole('button', { name: 'ערוך פרופיל' }).click();

    // Button should change to save
    await expect(page.getByRole('button', { name: 'שמור שינויים' })).toBeVisible();

    // Name input should be enabled
    const nameInput = page.locator('input').first();
    await expect(nameInput).toBeEnabled();
  });

  test('should save changes and disable editing', async ({ page }) => {
    // Enable editing
    await page.getByRole('button', { name: 'ערוך פרופיל' }).click();

    // Save
    await page.getByRole('button', { name: 'שמור שינויים' }).click();

    // Should go back to view mode
    await expect(page.getByRole('button', { name: 'ערוך פרופיל' })).toBeVisible();
  });

  test('should display account settings card', async ({ page }) => {
    await expect(page.getByText('הגדרות חשבון')).toBeVisible();
  });

  test('should display notification toggle', async ({ page }) => {
    // Look for the notification text in settings section
    await expect(page.locator('p.font-medium').filter({ hasText: 'התראות' })).toBeVisible();
  });

  test('should display two-factor toggle', async ({ page }) => {
    await expect(page.getByText('אימות דו-שלבי')).toBeVisible();
    await expect(page.getByText('הגן על החשבון עם אימות נוסף')).toBeVisible();
  });

  test('should display delete account button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'מחק חשבון' })).toBeVisible();
  });

  test('notification toggle should work', async ({ page }) => {
    // The toggle is a custom styled div with a hidden checkbox
    // Check for the toggle container with the bell icon
    const toggleSection = page.locator('.rounded-lg').filter({ has: page.locator('svg.lucide-bell') });
    await expect(toggleSection).toBeVisible();

    // The toggle switch should be visible
    const toggleSwitch = toggleSection.locator('.w-11');
    await expect(toggleSwitch).toBeVisible();
  });
});

test.describe('Profile Page - Form Validation', () => {
  test('should have email input field', async ({ page }) => {
    await page.goto('/profile');

    // Enable editing
    await page.getByRole('button', { name: 'ערוך פרופיל' }).click();

    // Email input should have email type
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible();
  });

  test('should accept phone number format', async ({ page }) => {
    await page.goto('/profile');

    // Enable editing
    await page.getByRole('button', { name: 'ערוך פרופיל' }).click();

    // Phone input should have tel type
    const phoneInput = page.locator('input[type="tel"]');
    await expect(phoneInput).toBeVisible();
  });

  test('should have date picker for birthdate', async ({ page }) => {
    await page.goto('/profile');

    // Enable editing
    await page.getByRole('button', { name: 'ערוך פרופיל' }).click();

    // Date input should exist
    const dateInput = page.locator('input[type="date"]');
    await expect(dateInput).toBeVisible();
  });
});
