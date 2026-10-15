import { test, expect } from '@playwright/test';
import { LoginPage } from '../../pages/LoginPage';

test.describe('Module 12: Advanced Filtering, Search & Sorting Scenarios (105 Scenarios)', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    // Session is automatically preserved from .auth/user.json
    await loginPage.login();
  });

  // 1-25: Search Query Variations on Visit list
  const searchTerms = [
    'Scheduled', 'Maintenance', 'Pest', 'Urgent', 'Cockroach',
    'REF-VISIT', 'CA273', 'falcon', 'Kumar', 'Orchard'
  ];

  searchTerms.forEach((term, idx) => {
    test(`TC-FILT-${(idx + 1).toString().padStart(3, '0')}: Search visit records by keyword '${term}'`, async ({ page }) => {
      const response = await page.request.get(`/api/v2/job?search=${encodeURIComponent(term)}&per_page=10`);
      expect(response.status()).toBe(200);
    });

    test(`TC-FILT-${(idx + 11).toString().padStart(3, '0')}: Search customer equipment by keyword '${term}'`, async ({ page }) => {
      const response = await page.request.get(`/api/v2/client-equipment/line-items?search=${encodeURIComponent(term)}&limit=10&customer=7`);
      expect(response.status()).toBe(200);
    });
  });

  // 21-35: Sorting by Columns
  const sortFields = ['id', 'title', 'started_at', 'finished_at', 'priority', 'status', 'created_at'];
  const sortOrders = ['asc', 'desc'];

  let sCount = 21;
  for (const field of sortFields) {
    for (const order of sortOrders) {
      if (sCount <= 35) {
        test(`TC-FILT-${sCount.toString().padStart(3, '0')}: Sort visit records by '${field}' ${order.toUpperCase()}`, async ({ page }) => {
          const response = await page.request.get(`/api/v2/job?sort_by=${field}&sort_order=${order}&per_page=10`);
          expect(response.status()).toBe(200);
        });
        sCount++;
      }
    }
  }

  // 36-105: Pagination, Status Filtering & Multi-facet Matrix
  const statusFilters = ['open', 'completed', 'in_progress', 'scheduled', 'cancelled', 'on_hold', 'all'];

  for (let p = 36; p <= 105; p++) {
    const status = statusFilters[p % statusFilters.length];
    test(`TC-FILT-${p.toString().padStart(3, '0')}: Query visit filter for status '${status}' on page ${(p % 5) + 1}`, async ({ page }) => {
      const response = await page.request.get(`/api/v2/job?status=${status}&current_page=${(p % 5) + 1}&per_page=15`);
      expect(response.status()).toBe(200);
    });
  }
});
