import { APIRequestContext, expect } from '@playwright/test';

export interface AuthLoginResponse {
  Auth_token?: string;
  errorMessage?: string;
}

export class AuthApi {
  private readonly request: APIRequestContext;
  private readonly baseUrl: string;

  constructor(request: APIRequestContext, baseUrl: string = 'https://api.demoblaze.com') {
    this.request = request;
    this.baseUrl = baseUrl;
  }

  /**
   * Call POST request create new user on DemoBlaze by API.
   * @param username User Name
   * @param password Password
   */
  async signUp(username: string, password: string): Promise<void> {
    const response = await this.request.post(`${this.baseUrl}/signup`, {
      data: {
        username: username,
        password: btoa(password), // Encrypt Base64 password
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);
  }

  /**
   * Call POST request login to DemoBlaze by API.
   * Response Auth_token string from response payload.
   * @param username User Name
   * @param password Password
   */
  async login(username: string, password: string): Promise<string> {
    const response = await this.request.post(`${this.baseUrl}/login`, {
      data: {
        username: username,
        password: btoa(password), // Encrypt Base64 password
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);

    const bodyText = await response.text();
    // DemoBlaze API responses string text format: "Auth_token: <token_string>"
    if (bodyText.includes('Auth_token:')) {
      const token = bodyText.replace('Auth_token: ', '').trim();
      return token;
    } else {
      throw new Error(`Authentication API failed with response: ${bodyText}`);
    }
  }

  /**
   * Utility inject Cookie login directly to Browser Context,
   * Skipt login with UI to decrease the execute test.
   */
  async injectAuthCookie(page: any, userToken: string): Promise<void> {
    await page.context().addCookies([
      {
        name: 'tokenp_',
        value: userToken,
        domain: 'www.demoblaze.com',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);
  }
}
