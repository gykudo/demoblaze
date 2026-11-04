import { test, expect } from '@playwright/test';
import { LoginModal } from '../../src/page-objects/login.modal';
import { CartPage, OrderDetails } from '../../src/page-objects/cart.page';

test.describe('DemoBlaze E2E Core Demo Flow', () => {
  let loginModal: LoginModal;
  let cartPage: CartPage;

  const orderPayload: OrderDetails = {
    name: 'Senior QA Engineer',
    country: 'Vietnam',
    city: 'Ho Chi Minh',
    card: '4532015599881122',
    month: '12',
    year: '2028',
  };

  test.beforeEach(async ({ page }) => {
    loginModal = new LoginModal(page);
    cartPage = new CartPage(page);
    await loginModal.navigateTo('/');
  });

  test('E2E: Login -> Select product -> Add to Cart -> Checkout & Verify Order', async ({ page }) => {
    // 1. Login
    await loginModal.login('testuser_qa_2026', 'Password123!');
    await loginModal.verifyUserLoggedIn('testuser_qa_2026');

    // 2. Chọn sản phẩm từ trang chủ
    await page.click('text=Samsung galaxy s6');
    await page.waitForURL('**/prod.html?idp_=1');

    // 3. Create listener get Dialog before clicking on Add to cart button
    const dialogPromise = cartPage.handleDialog('Product added');
    await page.getByRole('link', { name: 'Add to cart' }).click();
    await dialogPromise; // Wait Confirm 

    // 4. Redirect to Cart Page
    await cartPage.navigateToCart();
    await expect(page.locator('.success')).toBeVisible(); // Verify product on table

    // 5. Exxecute Place Order
    await cartPage.initiateCheckout();
    await cartPage.fillPurchaseForm(orderPayload);
    await cartPage.submitPurchase();

    // 6. Verify Purchase Successfull
    const receiptText = await cartPage.verifyPurchaseConfirmation();
    expect(receiptText).toContain('Amount: 360 USD');
    expect(receiptText).toContain(`Card Number: ${orderPayload.card}`);
    expect(receiptText).toContain(`Name: ${orderPayload.name}`);
  });
});
