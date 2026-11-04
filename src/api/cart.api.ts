import { APIRequestContext, expect } from '@playwright/test';

export class CartApi {
  private readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  }

  /**
   * Fast API setup to directly inject items into user session bypassing UI operations
   */
  async addItemToCartDirectly(cookieSession: string, prodId: number = 1): Promise<void> {
    const response = await this.request.post('https://api.demoblaze.com/addtocart', {
      data: {
        id: '2edef7c6-2a62-426d-8cf7-cb722bc158b0',
        cookie: cookieSession,
        prod_id: prodId,
        flag: false,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });

    expect(response.status()).toBe(200);
  }
}
