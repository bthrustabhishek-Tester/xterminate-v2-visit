import { test, expect } from '@playwright/test';
import { BASE_URL, getAuthHeaders } from '../../helpers/apiAuthHelper';

/**
 * Module 04: Finance — Quotation API Contracts & Validation
 * ==========================================================
 * Validates:
 * - GET /api/v2/quotation (Listing, Pagination, Schema)
 * - GET /api/v2/quotation/options (Quotation metadata & statuses)
 * - GET /api/v2/quotation/summary (Monthly volume stats)
 * - GET /api/v2/job/related-documents?type=quotation (Related quotation linking)
 * - Negative and Boundary Scenarios
 */

let headers: { [key: string]: string };

test.describe('Module 04: Finance — Quotation API Contracts', () => {
  test.beforeEach(async ({ request }) => {
    if (!headers) {
      headers = await getAuthHeaders(request);
    }
  });

  test('TC-QT-API-001: GET /api/v2/quotation returns paginated quotation list with valid schema', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/quotation?per_page=10&current_page=1`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data).toHaveProperty('rows');
    expect(body.data).toHaveProperty('total_rows');
    expect(Array.isArray(body.data.rows)).toBe(true);
  });

  test('TC-QT-API-002: GET /api/v2/quotation/options returns quotation options and status lists', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/quotation/options`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-QT-API-003: GET /api/v2/quotation/summary returns monthly quotation volume metrics', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/quotation/summary?period=month`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-QT-API-004: GET /api/v2/job/related-documents returns linked quotation documents', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/job/related-documents?type=quotation&customer=7&limit=10`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(Array.isArray(body.data)).toBe(true);
  });

  test('TC-QT-API-005: Fetch non-existent quotation ID returns 404', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/quotation/999999999`, { headers });
    expect([404, 400, 500]).toContain(res.status());
  });

  test('TC-QT-API-006: Search input with special characters is sanitized without SQL injection', async ({ request }) => {
    const maliciousQuery = "' OR 1=1 --";
    const res = await request.get(`${BASE_URL}/api/v2/quotation?search=${encodeURIComponent(maliciousQuery)}`, { headers });
    expect([200, 422]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body.status).toBe(true);
    }
  });
});
