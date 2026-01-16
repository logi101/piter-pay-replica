import { test, expect } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'PiterPay' })).toBeVisible();
  });

  test('should display tagline', async ({ page }) => {
    await expect(page.getByText('היועץ החכם לניהול ההוצאות שלך')).toBeVisible();
  });

  test('should display Peter avatar', async ({ page }) => {
    // Look for the emoji avatar
    await expect(page.locator('.w-20.h-20')).toBeVisible();
  });

  test('should display description paragraph', async ({ page }) => {
    await expect(page.getByText(/PiterPay הוא כלי חכם/)).toBeVisible();
  });

  test('should display all features', async ({ page }) => {
    // Use heading role to avoid duplicates in sidebar
    await expect(page.getByRole('heading', { name: "צ'אט אינטואיטיבי" })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'אבטחה מתקדמת' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'תובנות חכמות' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'ניהול משק בית' })).toBeVisible();
  });

  test('should display feature descriptions', async ({ page }) => {
    await expect(page.getByText(/רשום הוצאות בשפה טבעית/)).toBeVisible();
    await expect(page.getByText(/הנתונים שלך מוגנים/)).toBeVisible();
    await expect(page.getByText(/קבל המלצות מותאמות/)).toBeVisible();
    await expect(page.getByText(/שתף ונהל תקציב/)).toBeVisible();
  });

  test('should display version information', async ({ page }) => {
    // Check for version info section
    await expect(page.getByText(/גרסה.*1\.0\.0/)).toBeVisible();
  });

  test('should display legal links', async ({ page }) => {
    await expect(page.getByText('תנאי שימוש')).toBeVisible();
    await expect(page.getByText('מדיניות פרטיות')).toBeVisible();
    await expect(page.getByText('צור קשר')).toBeVisible();
  });

  test('should display footer with copyright', async ({ page }) => {
    await expect(page.getByText(/© 2026 PiterPay/)).toBeVisible();
    await expect(page.getByText(/כל הזכויות שמורות/)).toBeVisible();
  });

  test('should display "built with love" message', async ({ page }) => {
    await expect(page.getByText(/נבנה עם/)).toBeVisible();
  });

  test('feature cards should have icons', async ({ page }) => {
    // Check for feature card containers
    const featureCards = page.locator('.w-12.h-12.bg-emerald-100');
    await expect(featureCards.first()).toBeVisible();
  });
});

test.describe('About Page - Links', () => {
  test('legal links should be clickable', async ({ page }) => {
    await page.goto('/about');

    // All links should be clickable
    const termsLink = page.getByText('תנאי שימוש');
    await expect(termsLink).toBeVisible();

    const privacyLink = page.getByText('מדיניות פרטיות');
    await expect(privacyLink).toBeVisible();

    const contactLink = page.getByText('צור קשר');
    await expect(contactLink).toBeVisible();
  });
});
