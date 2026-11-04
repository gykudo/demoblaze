import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class ProductPage extends BasePage {
  readonly addToCartButton: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.locator('a.btn.btn-success.btn-lg', { hasText: 'Add to cart' });
    this.productTitle = page.locator('.name');
    this.productPrice = page.locator('.price-container');
  }

  async addProductToCart(): Promise<void> {
    // Lắng nghe và xử lý alert xác nhận "Product added" từ DemoBlaze
    const dialogPromise = this.handleDialog('Product added');
    await this.addToCartButton.click();
    await dialogPromise;
  }
}
