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

test('an unknown page answers 404', async ({ request }) => {
  const response = await request.get('/fr/nope');
  expect(response.status()).toBe(404);
});

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
