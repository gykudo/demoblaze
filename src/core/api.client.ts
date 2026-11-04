import { APIRequestContext, request } from '@playwright/test';

export class ApiClient {
  protected requestContext: APIRequestContext | null = null;
  protected readonly baseUrl: string;

  constructor(baseUrl: string = 'https://api.demoblaze.com') {
    this.baseUrl = baseUrl;
  }

  /**
   * Initializes the Playwright APIRequestContext instance.
   */
  async init(): Promise<APIRequestContext> {
    if (!this.requestContext) {
      this.requestContext = await request.newContext({
        baseURL: this.baseUrl,
      });
    }
    return this.requestContext;
  }

  /**
   * Disposes of the APIRequestContext instance.
   */
  async dispose(): Promise<void> {
    if (this.requestContext) {
      await this.requestContext.dispose();
      this.requestContext = null;
    }
  }

  /**
   * Generic GET request wrapper.
   */
  async get(endpoint: string, options?: any) {
    const ctx = await this.init();
    return await ctx.get(endpoint, options);
  }

  /**
   * Generic POST request wrapper.
   */
  async post(endpoint: string, options?: any) {
    const ctx = await this.init();
    return await ctx.post(endpoint, options);
  }

  /**
   * Generic PUT request wrapper.
   */
  async put(endpoint: string, options?: any) {
    const ctx = await this.init();
    return await ctx.put(endpoint, options);
  }

  /**
   * Generic DELETE request wrapper.
   */
  async delete(endpoint: string, options?: any) {
    const ctx = await this.init();
    return await ctx.delete(endpoint, options);
  }
}
