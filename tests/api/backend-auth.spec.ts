import { test, expect } from '@playwright/test';
import { AuthApi } from '../../src/api/auth.api';

test.describe('Backend Authentication API Suite (DemoBlaze REST Endpoints)', () => {
  let authApi: AuthApi;
  const uniqueUsername = `testuser_api_${Date.now()}`;
  const testPassword = 'Password123!';

  test.beforeEach(async ({ request }) => {
    authApi = new AuthApi(request);
  });

  test('API_AUTH_01: Successfully register a new user via /signup endpoint', async () => {
    // Act & Assert: Call sign up and verify response succeeds
    await expect(authApi.signUp(uniqueUsername, testPassword)).resolves.not.toThrow();
  });

  test('API_AUTH_02: Successfully authenticate user via /login endpoint and receive Auth_token', async () => {
    // Ensure user exists first
    try {
      await authApi.signUp(uniqueUsername, testPassword);
    } catch (e) {
      // Ignore if user already exists from previous runs
    }

    // Act: Authenticate via API login
    const token = await authApi.login(uniqueUsername, testPassword);

    // Assert: Verify token string is returned and non-empty
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
    expect(token.length).toBeGreaterThan(0);
  });

  test('API_AUTH_03: Fail authentication with invalid password via /login endpoint', async () => {
    const response = await authApi.post('https://api.demoblaze.com/login', {
      data: {
        username: uniqueUsername,
        password: btoa('WrongPassword123!'),
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);
    const bodyText = await response.text();
    
    // DemoBlaze returns error message text in body for invalid credentials
    expect(bodyText).toContain('Wrong password');
  });
});
