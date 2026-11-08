// The novel stays in view: product shortcuts on the shop page.

import { expect, test } from '@playwright/test';

test('desktop: the shortcuts under the cart preview lead to each product', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto('/fr/boutique');
  const shortcuts = page.getByTestId('product-shortcuts');
  await expect(shortcuts).toContainText('Boucaniers');
  await shortcuts.getByRole('link', { name: /Armand/ }).click();
  await expect(page).toHaveURL(/#armand$/);
  await expect(page.getByRole('heading', { name: /Armand ou Les Rêveurs/ })).toBeInViewport();
});

test('mobile: the shortcuts sit above the products', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/en/boutique');
  const shortcuts = page.getByTestId('product-shortcuts-compact');
  await expect(shortcuts).toBeInViewport();
  await shortcuts.getByRole('link', { name: /Illustrated novella/ }).click();
  await expect(page).toHaveURL(/#armand$/);
});
