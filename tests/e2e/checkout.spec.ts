import { test, expect } from '@playwright/test';
import { CartPage } from '../../src/pages/cart.page';

test.describe('Cart & Checkout Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('User can add item to cart and place an order', async ({ page }) => {
    // Handle dialog alert for "Product added"
    page.once('dialog', async (dialog) => {
      expect(dialog.message()).toContain('Product added');
      await dialog.accept();
    });

    // 1. Select product and add to cart
    await page.click('text=Samsung galaxy s6');
    await page.click('text=Add to cart');

    // 2. Navigate to cart
    await page.click('#cartur');
    await expect(page.locator('.success')).toBeVisible();

    // 3. Initiate checkout
    const cartPage = new CartPage(page);
    await cartPage.placeOrderButton.click();

    // 4. Fill customer details and submit
    await cartPage.fillCheckoutForm({
      name: 'QA Engineer',
      country: 'Vietnam',
      city: 'Ho Chi Minh',
      card: '4111222233334444',
      month: '12',
      year: '2026'
    });
    await cartPage.completePurchase();

    // 5. Assert confirmation modal
    await expect(cartPage.confirmationModal).toBeVisible();
    await expect(cartPage.confirmationModal).toContainText('Thank you for your purchase!');
    await cartPage.confirmOkButton.click();
  });
});
