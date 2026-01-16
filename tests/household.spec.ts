import { test, expect } from '@playwright/test';

test.describe('Household Management Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/household');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'ניהול משק בית' })).toBeVisible();
  });

  test('should display subtitle', async ({ page }) => {
    await expect(page.getByText('נהל את חברי משק הבית שלך')).toBeVisible();
  });

  test('should display invite button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /הזמן חבר/ })).toBeVisible();
  });

  test('should display household info card', async ({ page }) => {
    await expect(page.getByText('משק הבית שלי')).toBeVisible();
  });

  test('should display household statistics', async ({ page }) => {
    await expect(page.getByText('חברים')).toBeVisible();
    await expect(page.getByText('מנהלים')).toBeVisible();
    await expect(page.getByText('סטטוס')).toBeVisible();
    await expect(page.getByText('פעיל')).toBeVisible();
  });

  test('should display members list', async ({ page }) => {
    // Look for the card title
    await expect(page.getByRole('heading', { name: 'חברי משק הבית' })).toBeVisible();
  });

  test('should display current user as admin', async ({ page }) => {
    // Look for the user name in the member list
    await expect(page.locator('p.font-medium').filter({ hasText: 'ew5933070' })).toBeVisible();
  });

  test('should open invite form', async ({ page }) => {
    await page.getByRole('button', { name: /הזמן חבר/ }).click();

    await expect(page.getByText('הזמן חבר חדש')).toBeVisible();
    await expect(page.getByPlaceholder(/אימייל/)).toBeVisible();
  });

  test('should add new member', async ({ page }) => {
    // Open invite form
    await page.getByRole('button', { name: /הזמן חבר/ }).click();

    // Fill email
    await page.getByPlaceholder(/אימייל/).fill('newmember@example.com');

    // Submit
    await page.getByRole('button', { name: 'שלח הזמנה' }).click();

    // New member should appear
    await expect(page.getByText('newmember@example.com')).toBeVisible();
  });

  test('should cancel invite', async ({ page }) => {
    await page.getByRole('button', { name: /הזמן חבר/ }).click();
    await page.getByRole('button', { name: 'ביטול' }).click();

    await expect(page.getByPlaceholder(/אימייל/)).not.toBeVisible();
  });

  test('should display role selector for members', async ({ page }) => {
    // Add a new member first
    await page.getByRole('button', { name: /הזמן חבר/ }).click();
    await page.getByPlaceholder(/אימייל/).fill('member@example.com');
    await page.getByRole('button', { name: 'שלח הזמנה' }).click();

    // Role selector should be visible for non-admin - look for select with role options
    await expect(page.getByRole('combobox').last()).toBeVisible();
  });

  test('should not allow deleting admin', async ({ page }) => {
    // The admin member should not have a visible delete button
    // Check that there's a shield icon for admin
    await expect(page.locator('svg.lucide-shield').first()).toBeVisible();
  });

  test('should delete non-admin member', async ({ page }) => {
    // Add a new member
    await page.getByRole('button', { name: /הזמן חבר/ }).click();
    await page.getByPlaceholder(/אימייל/).fill('todelete@example.com');
    await page.getByRole('button', { name: 'שלח הזמנה' }).click();

    // Verify added
    await expect(page.getByText('todelete@example.com')).toBeVisible();

    // Delete the member - find delete button (trash icon)
    const deleteButton = page.locator('button').filter({ has: page.locator('svg.lucide-trash-2') }).first();
    await deleteButton.click();

    // Member should be gone
    await expect(page.getByText('todelete@example.com')).not.toBeVisible();
  });

  test('should change member role', async ({ page }) => {
    // Add a member
    await page.getByRole('button', { name: /הזמן חבר/ }).click();
    await page.getByPlaceholder(/אימייל/).fill('role@example.com');
    await page.getByRole('button', { name: 'שלח הזמנה' }).click();

    // Change role to viewer
    const roleSelect = page.getByRole('combobox').last();
    await roleSelect.selectOption('viewer');

    // Role should change
    await expect(roleSelect).toHaveValue('viewer');
  });
});

test.describe('Household - Role Permissions', () => {
  test('admin should have shield icon', async ({ page }) => {
    await page.goto('/household');

    // Admin should have shield icon
    await expect(page.locator('svg.lucide-shield')).toBeVisible();
  });

  test('role options should be available', async ({ page }) => {
    await page.goto('/household');

    // Add a member to see role options
    await page.getByRole('button', { name: /הזמן חבר/ }).click();
    await page.getByPlaceholder(/אימייל/).fill('test@example.com');
    await page.getByRole('button', { name: 'שלח הזמנה' }).click();

    const roleSelect = page.getByRole('combobox').last();
    await expect(roleSelect).toBeVisible();

    // Check options exist
    await expect(roleSelect.locator('option')).toHaveCount(3);
  });
});
