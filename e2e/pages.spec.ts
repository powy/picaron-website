// Every content page loads in both languages: HTTP 200, a title, no browser
// errors, and the noindex header outside production. Cheap safety net for a
// broken page or a missing translation. The checkout steps are covered by
// checkout.spec.ts; mondial-relay-test is a PoC page loading third-party
// scripts, left out.

import { expect, test } from '@playwright/test';

const LOCALES = ['fr', 'en'] as const;

const PAGES = [
  '/boucaniers/presentation',
  '/boucaniers/comment-jouer',
  '/boucaniers/medias',
  '/boucaniers/faq',
  '/equipe',
  '/boutique',
  '/panier',
  '/contact',
  '/faq',
  '/cgv',
  '/cookies',
  '/mentions-legales',
  '/politique-confidentialite',
];

for (const locale of LOCALES) {
  for (const path of PAGES) {
    test(`${locale}${path} loads`, async ({ page }) => {
      // Third-party embeds (YouTube) get an empty answer: offline and
      // deterministic, and their own console noise stays out of the test.
      await page.route(
        (url) => url.hostname !== 'localhost',
        (route) => route.fulfill({ status: 200, body: '' })
      );
      const errors: string[] = [];
      page.on('pageerror', (error) => errors.push(error.message));
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text());
      });

      const response = await page.goto(`/${locale}${path}`);
      expect(response?.status()).toBe(200);
      expect(response?.headers()['x-robots-tag']).toBe('noindex, nofollow');
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.locator('h1').first()).toBeVisible();

      // Not 'networkidle': the autoplaying videos keep the network busy.
      await page.waitForLoadState('load');
      expect(errors).toEqual([]);
    });
  }

  test(`/${locale} redirects to the presentation page`, async ({ page }) => {
    await page.goto(`/${locale}`);
    await expect(page).toHaveURL(new RegExp(`/${locale}/boucaniers/presentation$`));
  });
}
