import { Page, expect } from '@playwright/test';

export class DialogHandler {
  /**
   * Listens for the next browser dialog event, verifies its message text if provided,
   * and accepts the dialog alert.
   * @param page Playwright Page instance
   * @param expectedMessage Optional expected message string to validate
   * @returns The dialog message text
   */
  static async handleDialog(page: Page, expectedMessage?: string): Promise<string> {
    return new Promise((resolve) => {
      page.once('dialog', async (dialog) => {
        const message = dialog.message();
        if (expectedMessage) {
          expect(message).toContain(expectedMessage);
        }
        await dialog.accept();
        resolve(message);
      });
    });
  }

  /**
   * Listens for the next browser dialog event, verifies its message text,
   * and dismisses (cancels) the dialog.
   * @param page Playwright Page instance
   * @param expectedMessage Optional expected message string to validate
   * @returns The dialog message text
   */
  static async dismissDialog(page: Page, expectedMessage?: string): Promise<string> {
    return new Promise((resolve) => {
      page.once('dialog', async (dialog) => {
        const message = dialog.message();
        if (expectedMessage) {
          expect(message).toContain(expectedMessage);
        }
        await dialog.dismiss();
        resolve(message);
      });
    });
  }
}
