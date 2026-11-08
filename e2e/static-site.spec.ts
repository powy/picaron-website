// What the static build can get wrong and pages.spec.ts does not see: text in
// the right language, public/_redirects, the 404 status, robots.txt and moving
// between pages without a full reload.

import { expect, test } from '@playwright/test';

test('server-rendered text follows the page language', async ({ page }) => {
  await page.goto('/en/boucaniers/presentation');
  await expect(page.getByText('Player rating on')).toBeVisible();

  await page.goto('/fr/boucaniers/presentation');
  await expect(page.getByText('Note des joueurs sur')).toBeVisible();
});

test('the footer follows the page language and shows the current year', async ({ page }) => {
  const year = new Date().getFullYear();

  await page.goto('/en/equipe');
  await expect(page.locator('footer')).toContainText(`© ${year} Picaron. All rights reserved.`);
  await expect(page.locator('footer').getByRole('link', { name: 'Privacy policy' })).toBeVisible();

  await page.goto('/fr/equipe');
  await expect(page.locator('footer')).toContainText(`© ${year} Picaron. Tous droits réservés.`);
  await expect(page.locator('footer').getByRole('link', { name: 'Politique de confidentialité' })).toBeVisible();
});

const REDIRECTS = [
  ['/', '/fr/boucaniers/presentation'],
  ['/en', '/en/boucaniers/presentation'],
  ['/en/boucaniers', '/en/boucaniers/presentation'],
  ['/boutique', '/fr/boutique'],
  ['/boucaniers/faq', '/fr/boucaniers/faq'],
];

for (const [from, to] of REDIRECTS) {
  test(`${from} redirects to ${to}`, async ({ request }) => {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers().location).toBe(to);
  });
}

const NOT_FOUND_PAGES = [
  ['/fr/nope', 'fr', 'Page introuvable', 'Retour à l\'accueil'],
  ['/en/nope', 'en', 'Page not found', 'Back to the home page'],
  ['/en/boucaniers/nope', 'en', 'Page not found', 'Back to the home page'],
  ['/nope', 'fr', 'Page introuvable', 'Retour à l\'accueil'],
];

for (const [path, locale, title, link] of NOT_FOUND_PAGES) {
  test(`${path} shows the 404 page in ${locale}`, async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));

    const response = await page.goto(path);
    expect(response?.status()).toBe(404);
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByRole('heading', { name: title })).toBeVisible();
    // The URL stays as typed: the page must not bounce to /introuvable.
    await page.waitForLoadState('load');
    await expect(page).toHaveURL(new RegExp(`${path}$`));

    await page.getByRole('link', { name: link }).click();
    await expect(page).toHaveURL(new RegExp(`/${locale}/boucaniers/presentation$`));
    expect(errors).toEqual([]);
  });
}

test('robots.txt blocks indexing outside production', async ({ request }) => {
  const response = await request.get('/robots.txt');
  expect(await response.text()).toContain('Disallow: /');
});

test('links change page without a full reload', async ({ page }) => {
  await page.goto('/en/equipe');
  await page.evaluate(() => {
    (window as Window & { sameDocument?: boolean }).sameDocument = true;
  });

  await page.getByRole('link', { name: 'Contact', exact: true }).first().click();
  await expect(page).toHaveURL(/\/en\/contact$/);
  expect(await page.evaluate(() => (window as Window & { sameDocument?: boolean }).sameDocument)).toBe(true);
});

test('the logo keeps the page language', async ({ page }) => {
  await page.goto('/en/equipe');
  await page.locator('nav a').first().click();
  await expect(page).toHaveURL(/\/en\/boucaniers\/presentation$/);
});
