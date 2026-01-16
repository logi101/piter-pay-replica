import { test, expect } from '@playwright/test';

test.describe('Monthly Overview Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/monthly-overview');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'מעקב חודשי' })).toBeVisible();
  });

  test('should display subtitle', async ({ page }) => {
    await expect(page.getByText('סקירה מפורטת של התקציב החודשי')).toBeVisible();
  });

  test('should display month selector', async ({ page }) => {
    // Month selector should show chevron buttons for navigation
    await expect(page.locator('svg.lucide-chevron-right')).toBeVisible();
    await expect(page.locator('svg.lucide-chevron-left')).toBeVisible();
  });

  test('should navigate between months', async ({ page }) => {
    // Get current month display
    const monthDisplay = page.locator('.border-slate-200').filter({ has: page.locator('svg.lucide-calendar') });
    const initialMonth = await monthDisplay.textContent();

    // Click next month button (left button in the header)
    await page.locator('svg.lucide-chevron-left').click();

    // Month should change
    const newMonth = await monthDisplay.textContent();
    expect(newMonth).not.toBe(initialMonth);
  });

  test('should display expense type tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'הוצאות קבועות' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'הוצאות משתנות' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'הוצאות תקופתיות' })).toBeVisible();
  });

  test('should switch between expense tabs', async ({ page }) => {
    // Click on variable expenses
    await page.getByRole('button', { name: 'הוצאות משתנות' }).click();

    // Tab should be active
    const variableTab = page.getByRole('button', { name: 'הוצאות משתנות' });
    await expect(variableTab).toHaveClass(/bg-white/);
  });

  test('should display expense tracking card', async ({ page }) => {
    await expect(page.getByText('מעקב הוצאות קבועות')).toBeVisible();
  });

  test('should display summary row', async ({ page }) => {
    await expect(page.getByText('סך הכל תכנון')).toBeVisible();
    await expect(page.getByText('סך הכל ביצוע')).toBeVisible();
    await expect(page.getByText('יתרה / חיסכון')).toBeVisible();
  });

  test('should display table headers', async ({ page }) => {
    await expect(page.getByText('פרטי הסעיף')).toBeVisible();
    await expect(page.getByText('סכום מתוכנן')).toBeVisible();
    await expect(page.getByText('סכום בפועל')).toBeVisible();
    await expect(page.getByText('סטטוס')).toBeVisible();
  });

  test('should display empty state message', async ({ page }) => {
    await expect(page.getByText('אין הוצאות מוגדרות עדיין')).toBeVisible();
  });

  test('should display confirm all button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /אשר את כל התשלומים/ })).toBeVisible();
  });

  test('should display archive section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ארכיון חודשי' })).toBeVisible();
  });

  test('should format currency with shekel symbol', async ({ page }) => {
    // Check that amounts show ₪ symbol somewhere on the page
    await expect(page.getByText(/₪/).first()).toBeVisible();
  });
});

test.describe('Monthly Overview - Table Functionality', () => {
  test('should have responsive table', async ({ page }) => {
    await page.goto('/monthly-overview');

    const tableContainer = page.locator('.overflow-x-auto');
    await expect(tableContainer).toBeVisible();
  });

  test('should display proper table structure', async ({ page }) => {
    await page.goto('/monthly-overview');

    // Table element should exist
    await expect(page.locator('table')).toBeVisible();
    await expect(page.locator('thead')).toBeVisible();
    await expect(page.locator('tbody')).toBeVisible();
  });
});
