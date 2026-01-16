import { test, expect } from '@playwright/test';

test.describe('Login Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login page correctly', async ({ page }) => {
    // Check main heading
    await expect(page.getByText('Welcome to PiterPay')).toBeVisible();

    // Check subtitle
    await expect(page.getByText('היועץ חכם לניהול ההוצאות')).toBeVisible();

    // Check email input
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();

    // Check password input
    await expect(page.locator('input[type="password"]')).toBeVisible();

    // Check login button
    await expect(page.getByRole('button', { name: 'התחבר' })).toBeVisible();
  });

  test('should toggle between login and signup forms', async ({ page }) => {
    // Click sign up link
    await page.getByText('הירשם').click();

    // Check signup form elements
    await expect(page.getByText('צור את החשבון שלך')).toBeVisible();

    // Click back to login
    await page.getByText('חזרה להתחברות').click();

    // Verify login form is back
    await expect(page.getByRole('button', { name: 'התחבר' })).toBeVisible();
  });

  test('should show email input as required', async ({ page }) => {
    // Email field should be present
    const emailInput = page.getByPlaceholder('you@example.com');
    await expect(emailInput).toBeVisible();
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('should have correct RTL layout', async ({ page }) => {
    // Check that the page has RTL direction
    const html = page.locator('html');
    await expect(html).toHaveAttribute('dir', 'rtl');
    await expect(html).toHaveAttribute('lang', 'he');
  });

  test('should display forgot password link', async ({ page }) => {
    await expect(page.getByText('שכחת סיסמה?')).toBeVisible();
  });

  test('should navigate to dashboard on login', async ({ page }) => {
    // Fill in credentials
    await page.getByPlaceholder('you@example.com').fill('test@example.com');
    await page.locator('input[type="password"]').fill('password123');

    // Click login
    await page.getByRole('button', { name: 'התחבר' }).click();

    // Wait for navigation (component has 1s timeout before redirect)
    await page.waitForURL('/dashboard', { timeout: 10000 });
    await expect(page).toHaveURL('/dashboard');
  });

  test('should have styled login button', async ({ page }) => {
    const loginButton = page.getByRole('button', { name: 'התחבר' });
    await expect(loginButton).toHaveClass(/bg-slate-900/);
  });

  test('should display Google login option', async ({ page }) => {
    await expect(page.getByText(/Google/)).toBeVisible();
  });
});

test.describe('Signup Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByText('הירשם').click();
  });

  test('should display all signup fields', async ({ page }) => {
    await expect(page.getByPlaceholder('you@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('מינימום 8 תווים')).toBeVisible();
    await expect(page.getByPlaceholder('הזן שוב את הסיסמה')).toBeVisible();
  });

  test('should have signup button', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'צור חשבון' })).toBeVisible();
  });
});
