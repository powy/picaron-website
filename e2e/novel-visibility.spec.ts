// The novel stays in view: product shortcuts on the shop page, and every
// product keeps its row in the cart, even at 0.

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

test('the cart keeps both products, even at 0', async ({ page }) => {
  await page.goto('/fr/boutique');
  await page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
  await page.goto('/fr/panier');

  // The novel was not added, but it is offered in the cart.
  await expect(page.getByText('Armand ou Les Rêveurs du Nouveau Monde')).toBeVisible();
  await page.getByRole('button', { name: 'Augmenter la quantité' }).last().click();
  await expect(page.getByTestId('cart-free-novels')).toBeVisible();

  // Down to 0, the game keeps its row and the order can no longer be placed.
  await page.getByRole('button', { name: 'Diminuer la quantité' }).first().click();
  await page.getByRole('button', { name: 'Diminuer la quantité' }).last().click();
  await expect(page.getByRole('img', { name: 'Boucaniers' })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Passer commande' })).toBeDisabled();
});
