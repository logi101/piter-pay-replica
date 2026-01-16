import { test, expect } from '@playwright/test';

test.describe('Tasks Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/tasks');
  });

  test('should display page title', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'משימות למעקב' })).toBeVisible();
  });

  test('should display subtitle', async ({ page }) => {
    await expect(page.getByText('נהל את המשימות הפיננסיות שלך')).toBeVisible();
  });

  test('should display new task button', async ({ page }) => {
    await expect(page.getByRole('button', { name: /משימה חדשה/ })).toBeVisible();
  });

  test('should display status filter tabs', async ({ page }) => {
    await expect(page.getByRole('button', { name: /הכל/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /ממתין/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /בביצוע/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /הושלם/ })).toBeVisible();
  });

  test('should show empty state when no tasks', async ({ page }) => {
    await expect(page.getByText('אין משימות להצגה')).toBeVisible();
  });

  test('should open add task form', async ({ page }) => {
    await page.getByRole('button', { name: /משימה חדשה/ }).click();

    await expect(page.getByPlaceholder('כותרת המשימה')).toBeVisible();
    await expect(page.getByPlaceholder(/תיאור/)).toBeVisible();
  });

  test('should add new task', async ({ page }) => {
    // Open form
    await page.getByRole('button', { name: /משימה חדשה/ }).click();

    // Fill form
    await page.getByPlaceholder('כותרת המשימה').fill('משימה חדשה לבדיקה');
    await page.getByPlaceholder(/תיאור/).fill('תיאור המשימה');

    // Submit
    await page.getByRole('button', { name: 'הוסף משימה' }).click();

    // Task should appear
    await expect(page.getByText('משימה חדשה לבדיקה')).toBeVisible();
    await expect(page.getByText('תיאור המשימה')).toBeVisible();
  });

  test('should cancel adding task', async ({ page }) => {
    await page.getByRole('button', { name: /משימה חדשה/ }).click();
    await page.getByRole('button', { name: 'ביטול' }).click();

    await expect(page.getByPlaceholder('כותרת המשימה')).not.toBeVisible();
  });

  test('should have priority selector', async ({ page }) => {
    await page.getByRole('button', { name: /משימה חדשה/ }).click();

    // Check select exists
    const prioritySelect = page.locator('select').first();
    await expect(prioritySelect).toBeVisible();
  });

  test('should have date picker', async ({ page }) => {
    await page.getByRole('button', { name: /משימה חדשה/ }).click();

    const dateInput = page.locator('input[type="date"]');
    await expect(dateInput).toBeVisible();
  });

  test('should change task status', async ({ page }) => {
    // Add a task first
    await page.getByRole('button', { name: /משימה חדשה/ }).click();
    await page.getByPlaceholder('כותרת המשימה').fill('לשינוי סטטוס');
    await page.getByRole('button', { name: 'הוסף משימה' }).click();

    // Change status using the select in the task row
    const statusSelect = page.locator('select').filter({ hasText: /ממתין/ }).first();
    await statusSelect.selectOption('in_progress');

    // Status should change
    await expect(statusSelect).toHaveValue('in_progress');
  });

  test('should filter tasks by status', async ({ page }) => {
    // Add a task
    await page.getByRole('button', { name: /משימה חדשה/ }).click();
    await page.getByPlaceholder('כותרת המשימה').fill('משימה לסינון');
    await page.getByRole('button', { name: 'הוסף משימה' }).click();

    // Task should be visible in "all"
    await expect(page.getByText('משימה לסינון')).toBeVisible();

    // Filter by pending
    await page.getByRole('button', { name: /ממתין/ }).click();

    // Task should still be visible (it's pending by default)
    await expect(page.getByText('משימה לסינון')).toBeVisible();
  });

  test('should display task count badges', async ({ page }) => {
    // Add a task
    await page.getByRole('button', { name: /משימה חדשה/ }).click();
    await page.getByPlaceholder('כותרת המשימה').fill('משימה לספירה');
    await page.getByRole('button', { name: 'הוסף משימה' }).click();

    // Check filter buttons have count
    const allButton = page.getByRole('button', { name: /הכל/ });
    await expect(allButton).toContainText('1');
  });
});

test.describe('Tasks Page - Status Styling', () => {
  test('pending tasks should show pending status', async ({ page }) => {
    await page.goto('/tasks');

    // Add a pending task
    await page.getByRole('button', { name: /משימה חדשה/ }).click();
    await page.getByPlaceholder('כותרת המשימה').fill('ממתין');
    await page.getByRole('button', { name: 'הוסף משימה' }).click();

    // Check the select shows pending
    const statusSelect = page.locator('select').filter({ hasText: /ממתין/ });
    await expect(statusSelect).toBeVisible();
  });

  test('completed tasks should show completed status', async ({ page }) => {
    await page.goto('/tasks');

    // Add and complete a task
    await page.getByRole('button', { name: /משימה חדשה/ }).click();
    await page.getByPlaceholder('כותרת המשימה').fill('הושלם');
    await page.getByRole('button', { name: 'הוסף משימה' }).click();

    // Change status to completed
    const statusSelect = page.locator('select').filter({ hasText: /ממתין/ }).first();
    await statusSelect.selectOption('completed');

    // Status should be completed
    await expect(statusSelect).toHaveValue('completed');
  });
});
