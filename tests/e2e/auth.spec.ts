import { test, expect } from '@playwright/test';
import { LoginModal } from '../../src/page-objects/login.modal';

test.describe('Authentication Feature Suite (DemoBlaze Login)', () => {
  let loginModal: LoginModal;

  test.beforeEach(async ({ page }) => {
    loginModal = new LoginModal(page);
    await loginModal.navigateTo('/');
  });

  test('TC_LOG_01: Successful login with valid credentials', async () => {
    // Sử dụng tài khoản demo hợp lệ trên hệ thống DemoBlaze hoặc tài khoản test độc lập
    const validUser = 'testuser_qa_2026';
    const validPass = 'Password123!';

    await loginModal.login(validUser, validPass);
    await loginModal.verifyUserLoggedIn(validUser);
  });

  test('TC_LOG_02: Login failure with wrong password (Negative Path)', async () => {
    const dialogPromise = loginModal.handleDialog('Wrong password.');
    await loginModal.login('testuser_qa_2026', 'IncorrectPassword');
    await dialogPromise;
    
    // Đảm bảo không hiển thị tên user trên thanh nav
    await expect(loginModal.userGreeting).not.toBeVisible();
  });

  test('TC_LOG_03: Login failure with non-existent user (Negative Path)', async () => {
    const dialogPromise = loginModal.handleDialog('User does not exist.');
    await loginModal.login('unregistered_user_99999', 'Password123!');
    await dialogPromise;
  });

  test('TC_LOG_04: Login validation with empty input fields (Edge Case)', async () => {
    const dialogPromise = loginModal.handleDialog("Please fill in the 'username' and 'password'.");
    await loginModal.openModal();
    await loginModal.submitButton.click();
    await dialogPromise;
  });
});
