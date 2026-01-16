import { test, expect } from '@playwright/test';

test.describe('Savings Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/savings');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /לוח הבקרה/ })).toBeVisible();
  });

  test('should display subtitle', async ({ page }) => {
    await expect(page.getByText('נהל את החסכונות וההשקעות שלך')).toBeVisible();
  });

  test('should display management tabs', async ({ page }) => {
    await expect(page.getByText('ניהול חסכונות')).toBeVisible();
    await expect(page.getByText('דוחות וביצועים')).toBeVisible();
  });

  test('should display all stat cards', async ({ page }) => {
    // Check all 6 stat cards
    await expect(page.getByText('סה"כ הכנסות')).toBeVisible();
    await expect(page.getByText('סך ההוצאות הקבועות')).toBeVisible();
    await expect(page.getByText('תקציב הוצאות משתנות')).toBeVisible();
    await expect(page.getByText('הוצאות תקופתיות נצברות')).toBeVisible();
    await expect(page.getByText('יעדים להגשמה')).toBeVisible();
    await expect(page.getByText('קרן ביטחון')).toBeVisible();
  });

  test('should display currency formatted amounts', async ({ page }) => {
    // Check that stat cards show amounts with shekel symbol
    const statCards = page.locator('.stat-card');
    const count = await statCards.count();
    expect(count).toBe(6);

    // Check for shekel symbol in amounts
    await expect(page.getByText(/₪/).first()).toBeVisible();
  });

  test('should have colored stat cards', async ({ page }) => {
    // Check that cards have gradient backgrounds
    await expect(page.locator('.stat-card-green')).toBeVisible();
    await expect(page.locator('.stat-card-gray')).toBeVisible();
    await expect(page.locator('.stat-card-blue')).toBeVisible();
    await expect(page.locator('.stat-card-orange')).toBeVisible();
    await expect(page.locator('.stat-card-purple')).toBeVisible();
    await expect(page.locator('.stat-card-violet')).toBeVisible();
  });

  test('should switch between tabs', async ({ page }) => {
    // Click on reports tab
    await page.getByRole('button', { name: /דוחות וביצועים/ }).click();

    // Tab should be active (has different styling)
    const reportsTab = page.getByRole('button', { name: /דוחות וביצועים/ });
    await expect(reportsTab).toHaveClass(/bg-emerald-500/);
  });

  test('should display additional info on cards', async ({ page }) => {
    // Variable expenses card shows balance - check for יתרה text
    await expect(page.getByText(/יתרה:/)).toBeVisible();
  });

  test('stat cards should be clickable', async ({ page }) => {
    const firstCard = page.locator('.stat-card').first();
    await expect(firstCard).toHaveClass(/cursor-pointer/);
  });
});

test.describe('Savings Dashboard - Responsive', () => {
  test('should display cards in grid on desktop', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/savings');

    // Grid should have 3 columns on large screens
    const grid = page.locator('.grid');
    await expect(grid).toHaveClass(/lg:grid-cols-3/);
  });

  test('should stack cards on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/savings');

    // Grid should have 1 column on mobile
    const grid = page.locator('.grid');
    await expect(grid).toHaveClass(/grid-cols-1/);
  });
});
