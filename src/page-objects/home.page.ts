import { Page, Locator } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class HomePage extends BasePage {
  readonly categoryPhones: Locator;
  readonly categoryLaptops: Locator;
  readonly categoryMonitors: Locator;
  readonly cartNavButton: Locator;

  constructor(page: Page) {
    super(page);
    this.categoryPhones = page.locator('a.list-group-item', { hasText: 'Phones' });
    this.categoryLaptops = page.locator('a.list-group-item', { hasText: 'Laptops' });
    this.categoryMonitors = page.locator('a.list-group-item', { hasText: 'Monitors' });
    this.cartNavButton = page.locator('#cartur');
  }

  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
    switch (category) {
      case 'Phones':
        await this.categoryPhones.click();
        break;
      case 'Laptops':
        await this.categoryLaptops.click();
        break;
      case 'Monitors':
        await this.categoryMonitors.click();
        break;
    }
  }

  async selectProduct(productName: string): Promise<void> {
    await this.page.click(`text=${productName}`);
  }

  async goToCart(): Promise<void> {
    await this.cartNavButton.click();
    await this.page.waitForURL('**/cart.html');
  }
}
