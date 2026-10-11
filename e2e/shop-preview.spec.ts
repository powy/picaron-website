// Cart preview on the shop page: desktop sidebar, mobile bottom bar, and the
// "Boutique" menu badge that replaced the separate cart icon.

import { expect, test } from '@playwright/test';

test.describe('desktop', () => {
  test.use({ viewport: { width: 1440, height: 1000 } });

  test('the sidebar previews the cart and leads to checkout', async ({ page }) => {
    await page.goto('/fr/boutique');
    const preview = page.getByTestId('cart-preview');
    await expect(preview).toContainText('Votre panier est vide');

    // No separate cart link in the menu any more, and no badge while empty.
    const nav = page.locator('nav');
    await expect(nav.locator('a[href="/fr/panier"]')).toHaveCount(0);
    await expect(nav.getByTestId('nav-cart-badge')).toHaveCount(0);

    await page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
    await expect(page.getByRole('button', { name: /Ajouté au panier/ })).toBeVisible();
    await expect(preview.getByTestId('cart-preview-line-boucaniers')).toBeVisible();
    await expect(page.getByTestId('cart-preview-subtotal')).toHaveText('69,00 €');
    await expect(nav.getByTestId('nav-cart-badge')).toHaveText('1');

    // Quantity controls update the subtotal and the menu badge.
    await preview.getByRole('button', { name: /Augmenter la quantité/ }).click();
    await expect(page.getByTestId('cart-preview-subtotal')).toHaveText('138,00 €');
    await expect(nav.getByTestId('nav-cart-badge')).toHaveText('2');
    await preview.getByRole('button', { name: /Diminuer la quantité/ }).click();
    await expect(page.getByTestId('cart-preview-subtotal')).toHaveText('69,00 €');

    // The product sheet is still fully there next to the preview.
    await expect(page.getByText(/Jeu de stratégie en simultané/)).toBeVisible();

    await preview.getByRole('link', { name: 'Voir le panier et commander' }).click();
    await expect(page).toHaveURL(/\/fr\/panier$/);
    await expect(page.getByText('Boucaniers').first()).toBeVisible();
  });

  test('removing the last item empties the preview', async ({ page }) => {
    await page.goto('/fr/boutique');
    await page.getByRole('button', { name: 'Ajouter au panier' }).nth(1).click(); // Armand
    const preview = page.getByTestId('cart-preview');
    await expect(preview.getByTestId('cart-preview-line-armand')).toBeVisible();
    await preview.getByRole('button', { name: /Retirer cet article/ }).click();
    await expect(preview).toContainText('Votre panier est vide');
  });
});

test.describe('mobile', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the bottom bar appears once the cart has items', async ({ page }) => {
    await page.goto('/fr/boutique');
    await expect(page.getByTestId('cart-preview')).toBeHidden();
    await expect(page.getByTestId('cart-preview-bar')).toHaveCount(0);

    await page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
    const bar = page.getByTestId('cart-preview-bar');
    await expect(bar).toContainText('1 article');
    await expect(bar).toContainText('69,00 €');

    await bar.getByRole('link', { name: 'Voir le panier' }).click();
    await expect(page).toHaveURL(/\/fr\/panier$/);
  });
});
