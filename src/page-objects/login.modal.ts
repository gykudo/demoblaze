import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from '../core/base.page';

export class LoginModal extends BasePage {
  readonly loginNavButton: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly userGreeting: Locator;

  constructor(page: Page) {
    super(page);
    this.loginNavButton = page.locator('#login2');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.submitButton = page.locator('#logInModal .btn-primary');
    this.userGreeting = page.locator('#nameofuser');
  }

  async openModal(): Promise<void> {
    await this.loginNavButton.click();
    await expect(this.usernameInput).toBeVisible();
  }

  async login(username: string, password: string): Promise<void> {
    await this.openModal();
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  async verifyUserLoggedIn(username: string): Promise<void> {
    await expect(this.userGreeting).toHaveText(`Welcome ${username}`, { timeout: 10000 });
  }
}
