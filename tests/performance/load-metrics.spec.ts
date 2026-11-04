import { test, expect } from '@playwright/test';

test.describe('Performance & Core Web Vitals Suite (DemoBlaze Metrics)', () => {
  test('PERF_01: Measure page load performance and navigation timings', async ({ page }) => {
    // Navigate to homepage and wait for network to settle
    const startTime = Date.now();
    await page.goto('/', { waitUntil: 'load' });
    const loadDuration = Date.now() - startTime;

    // Assert page loaded within acceptable threshold (e.g., under 10 seconds for public site)
    expect(loadDuration).toBeLessThan(10000);

    // Extract Navigation Timing API metrics from browser context
    const timing = await page.evaluate(() => {
      const perfEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfEntry) {
        return {
          domContentLoaded: perfEntry.domContentLoadedEventEnd - perfEntry.startTime,
          loadComplete: perfEntry.loadEventEnd - perfEntry.startTime,
          responseDuration: perfEntry.responseEnd - perfEntry.requestStart,
        };
      }
      return null;
    });

    if (timing) {
      console.log(`[Performance Metric] DOM Content Loaded: ${timing.domContentLoaded}ms`);
      console.log(`[Performance Metric] Load Complete: ${timing.loadComplete}ms`);
      console.log(`[Performance Metric] Server Response Duration: ${timing.responseDuration}ms`);
      
      expect(timing.domContentLoaded).toBeGreaterThan(0);
    }
  });

  test('PERF_02: Verify product catalog API response time under 3 seconds', async ({ request }) => {
    const startTime = Date.now();
    const response = await request.post('https://api.demoblaze.com/entries', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const duration = Date.now() - startTime;

    expect(response.status()).toBe(200);
    expect(duration).toBeLessThan(3000);
    console.log(`[API Performance] /entries catalog fetch duration: ${duration}ms`);
  });
});
