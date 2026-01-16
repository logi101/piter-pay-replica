import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to dashboard (main authenticated area)
    await page.goto('/dashboard');
  });

  test('should display header with correct elements', async ({ page }) => {
    // Check header exists
    await expect(page.locator('header')).toBeVisible();

    // Check for logo text
    await expect(page.locator('header').getByText('PiterPay')).toBeVisible();
  });

  test('should open sidebar when menu button clicked', async ({ page }) => {
    // Click menu button to open sidebar
    await page.locator('header button').first().click();

    // Wait for transition (300ms) and check sidebar is visible
    const sidebar = page.locator('aside');
    await page.waitForTimeout(400);
    await expect(sidebar).toBeVisible();

    // Check sidebar items
    await expect(page.getByText('לוח הבקרה').first()).toBeVisible();
    await expect(page.getByText('מעקב חודשי').first()).toBeVisible();
  });

  test('should close sidebar when clicking X button', async ({ page }) => {
    // Open sidebar
    await page.locator('header button').first().click();
    await page.waitForTimeout(400);
    await expect(page.locator('aside')).toBeVisible();

    // Close sidebar - click the X button in the sidebar
    await page.locator('aside button').first().click();

    // Wait for close transition and verify sidebar has the closed class
    await page.waitForTimeout(400);
    const sidebar = page.locator('aside');
    const classAttr = await sidebar.getAttribute('class');
    expect(classAttr).toContain('-translate-x-full');
  });

  test('should navigate to different pages from sidebar', async ({ page }) => {
    // Open sidebar
    await page.locator('header button').first().click();

    // Wait for sidebar to be visible
    await page.waitForTimeout(400);
    await expect(page.locator('aside')).toBeVisible();

    // Navigate to Savings/Dashboard - use the link in sidebar
    await page.locator('aside a').filter({ hasText: 'לוח הבקרה' }).click();

    // Wait for navigation
    await page.waitForURL('/savings', { timeout: 5000 });
    await expect(page).toHaveURL('/savings');
  });

  test('should show logout option in sidebar', async ({ page }) => {
    // Open sidebar
    await page.locator('header button').first().click();

    // Check logout button
    await expect(page.getByText('התנתק מהמערכת')).toBeVisible();
  });

  test('should show user email in sidebar', async ({ page }) => {
    // Open sidebar
    await page.locator('header button').first().click();

    // Check user info
    await expect(page.getByText(/מחובר כ:/)).toBeVisible();
  });

  test('should have floating chat button on all pages', async ({ page }) => {
    // Check on dashboard - look for fixed positioned button
    const chatButton = page.locator('button.fixed');
    await expect(chatButton).toBeVisible();

    // Navigate to savings and check
    await page.goto('/savings');
    await expect(page.locator('button.fixed')).toBeVisible();

    // Navigate to profile and check
    await page.goto('/profile');
    await expect(page.locator('button.fixed')).toBeVisible();
  });
});

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should show hamburger menu on mobile', async ({ page }) => {
    await page.goto('/dashboard');

    // Header should be visible with menu button
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('header button').first()).toBeVisible();
  });

  test('sidebar should work on mobile', async ({ page }) => {
    await page.goto('/dashboard');

    // Open sidebar
    await page.locator('header button').first().click();

    // Sidebar should be visible
    const sidebar = page.locator('aside');
    await expect(sidebar).toBeVisible();
  });
});
