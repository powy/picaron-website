// Scenarios A (Mondial Relay) and B (Colissimo) from
// shop update plan/LOCAL-TEST-GUIDE.md, run in the offline test mode.

import { expect, test, type Page } from '@playwright/test';

const ADDRESS = {
  lastName: 'Dupont',
  firstName: 'Jean',
  address: '10 rue de la Paix',
  postalCode: '69001',
  city: 'Lyon',
  email: 'jean.e2e@exemple.fr',
  phone: '0612345678',
};

async function addBoucaniersAndChoose(page: Page, method: 'Mondial Relay' | 'Colissimo') {
  await page.goto('/fr/boutique');
  await page.getByRole('button', { name: 'Ajouter au panier' }).first().click();
  await page.goto('/fr/panier');
  await expect(page.getByTestId('cart-shipping')).toContainText('Choisissez un mode de livraison');
  await page.getByRole('button', { name: new RegExp(method) }).click();
  // One game: 69 € + 10 € shipping (placeholder, lib/shipping.ts).
  await expect(page.getByTestId('cart-shipping')).toContainText('10,00');
  await expect(page.getByTestId('cart-total')).toContainText('79,00');
  await page.getByRole('button', { name: 'Passer commande' }).click();
  await expect(page).toHaveURL(/\/fr\/commande\/adresse/);
}

async function fillAddress(page: Page, prefix: 'billing' | 'delivery', overrides: Partial<typeof ADDRESS> = {}) {
  const values = { ...ADDRESS, ...overrides };
  for (const [key, value] of Object.entries(values)) {
    await page.locator(`#${prefix}-${key}`).fill(value);
  }
}

async function continueToPayment(page: Page) {
  await page.getByRole('button', { name: 'Continuer vers le paiement' }).click();
  await expect(page).toHaveURL(/\/fr\/commande\/paiement\?order=/);
  await expect(page.getByTestId('mock-payment-form')).toBeVisible();
  return new URL(page.url()).searchParams.get('order')!;
}

async function orderStatus(page: Page, publicId: string) {
  const response = await page.request.get(`/api/orders/${publicId}`);
  return (await response.json()).status as string;
}

async function expectMailpitEmail(page: Page, publicId: string) {
  if (!process.env.E2E_MAILPIT) return;
  const response = await page.request.get(`http://localhost:8025/api/v1/search?query=${encodeURIComponent(publicId)}`);
  const { messages_count } = await response.json();
  expect(messages_count).toBe(1);
}

test('A — Mondial Relay: successful payment', async ({ page }) => {
  await addBoucaniersAndChoose(page, 'Mondial Relay');
  await expect(page.getByRole('heading', { name: 'Adresse de facturation' })).toBeVisible();

  await fillAddress(page, 'billing');
  const submit = page.getByRole('button', { name: 'Continuer vers le paiement' });
  await expect(submit).toBeDisabled(); // no relay point yet

  await page.getByRole('button', { name: 'Rechercher' }).click();
  await page.getByRole('button', { name: 'Choisir ce point relais' }).first().click();
  await expect(page.getByText(/Point relais sélectionné/)).toBeVisible();

  const publicId = await continueToPayment(page);
  expect(await orderStatus(page, publicId)).toBe('pending');

  await page.getByRole('button', { name: 'Simuler un paiement accepté' }).click();
  await expect(page).toHaveURL(/\/fr\/commande\/succes\?order=/);
  await expect(page.getByTestId('order-status-paid')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Commande confirmée !' })).toBeVisible();
  await expect(page.getByText(/Point relais Mondial Relay/)).toBeVisible();
  expect(await orderStatus(page, publicId)).toBe('paid');
  await expectMailpitEmail(page, publicId);

  // The cart is emptied once the order is paid.
  await page.goto('/fr/panier');
  await expect(page.getByText('Votre panier est vide')).toBeVisible();
});

test('B — Colissimo: declined, insufficient funds, then retry succeeds', async ({ page }) => {
  await addBoucaniersAndChoose(page, 'Colissimo');
  await expect(page.getByRole('heading', { name: 'Adresse de livraison' }).first()).toBeVisible();

  await fillAddress(page, 'delivery');
  await page.getByLabel('Adresse de facturation différente').check();
  await fillAddress(page, 'billing', { city: 'Marseille', postalCode: '13001' });

  const publicId = await continueToPayment(page);

  await page.getByRole('button', { name: 'Simuler une carte refusée' }).click();
  await expect(page.getByTestId('payment-error')).toHaveText(/carte a été refusée/);
  expect(await orderStatus(page, publicId)).toBe('failed');

  await page.getByRole('button', { name: 'Simuler des fonds insuffisants' }).click();
  await expect(page.getByTestId('payment-error')).toHaveText(/Fonds insuffisants/);

  await page.getByRole('button', { name: 'Simuler un paiement accepté' }).click();
  await expect(page.getByTestId('order-status-paid')).toBeVisible();
  await expect(page.getByText(/Livraison à domicile Colissimo/)).toBeVisible();
  await expect(page.getByText(/69001 Lyon/)).toBeVisible();
  expect(await orderStatus(page, publicId)).toBe('paid');
  await expectMailpitEmail(page, publicId);
});

test('Abandon: the order stays pending and the payment can be resumed', async ({ page }) => {
  await addBoucaniersAndChoose(page, 'Colissimo');
  await fillAddress(page, 'delivery');
  const publicId = await continueToPayment(page);

  await page.getByRole('link', { name: 'Abandonner le paiement' }).click();
  await expect(page).toHaveURL(/\/fr\/commande\/annulation\?order=/);
  expect(await orderStatus(page, publicId)).toBe('pending');

  await page.getByRole('link', { name: 'Reprendre le paiement' }).click();
  await expect(page.getByTestId('mock-payment-form')).toBeVisible();
  await page.getByRole('button', { name: 'Simuler un paiement accepté' }).click();
  await expect(page.getByTestId('order-status-paid')).toBeVisible();
});

test('the address page shows an error when the API rejects the order', async ({ page }) => {
  await addBoucaniersAndChoose(page, 'Colissimo');
  await fillAddress(page, 'delivery');
  await page.route('**/api/orders', (route) =>
    route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":{"code":"internal_error"}}' })
  );
  await page.getByRole('button', { name: 'Continuer vers le paiement' }).click();
  await expect(page.getByText(/La commande n.a pas pu être créée/)).toBeVisible();
  await expect(page).toHaveURL(/\/fr\/commande\/adresse/);
});

test('France only: notice on the shop pages, overseas postal codes refused', async ({ page }) => {
  await page.goto('/fr/boutique');
  await expect(page.getByTestId('france-only-notice')).toContainText('France métropolitaine uniquement');
  await expect(page.getByTestId('france-only-notice').getByRole('link', { name: 'contactez-nous' })).toHaveAttribute(
    'href',
    '/fr/contact'
  );

  await addBoucaniersAndChoose(page, 'Colissimo');
  await expect(page.getByTestId('france-only-notice')).toBeVisible();

  await fillAddress(page, 'delivery', { postalCode: '97400', city: 'Saint-Denis' });
  await page.locator('#delivery-postalCode').blur();
  await expect(page.getByText(/Nous livrons uniquement en France métropolitaine/)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Continuer vers le paiement' })).toBeDisabled();

  // Corsica is mainland France for delivery: no error.
  await page.locator('#delivery-postalCode').fill('20000');
  await expect(page.getByText(/Nous livrons uniquement en France métropolitaine/)).toHaveCount(0);
  await expect(page.getByRole('button', { name: 'Continuer vers le paiement' })).toBeEnabled();
});
