import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../core/base.page';

export interface OrderDetails {
  name: string;
  country: string;
  city: string;
  card: string;
  month: string;
  year: string;
}

export class CartPage extends BasePage {
  readonly cartNavButton: Locator;
  readonly placeOrderButton: Locator;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;
  readonly sweetAlertModal: Locator;
  readonly sweetAlertText: Locator;
  readonly confirmOkButton: Locator;

  constructor(page: Page) {
    super(page);
    this.cartNavButton = page.locator('#cartur');
    this.placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.cardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');
    this.purchaseButton = page.getByRole('button', { name: 'Purchase' });
    this.sweetAlertModal = page.locator('.sweet-alert');
    this.sweetAlertText = page.locator('.sweet-alert p');
    this.confirmOkButton = page.getByRole('button', { name: 'OK' });
  }

  async navigateToCart(): Promise<void> {
    await this.cartNavButton.click();
    await this.page.waitForURL('**/cart.html');
  }

  async initiateCheckout(): Promise<void> {
    await this.placeOrderButton.click();
    await expect(this.nameInput).toBeVisible();
  }

  async fillPurchaseForm(details: OrderDetails): Promise<void> {
    await this.nameInput.fill(details.name);
    await this.countryInput.fill(details.country);
    await this.cityInput.fill(details.city);
    await this.cardInput.fill(details.card);
    await this.monthInput.fill(details.month);
    await this.yearInput.fill(details.year);
  }

  async submitPurchase(): Promise<void> {
    await this.purchaseButton.click();
  }

  async verifyPurchaseConfirmation(): Promise<string> {
    await expect(this.sweetAlertModal).toBeVisible();
    await expect(this.sweetAlertModal).toContainText('Thank you for your purchase!');
    const details = await this.sweetAlertText.innerText();
    await this.confirmOkButton.click();
    return details;
  }
}
