import { test, expect } from '@playwright/test';
import { BASE_URL, getAuthHeaders } from '../../helpers/apiAuthHelper';

/**
 * Module 05: Operations — Enquiry & Supplier API Contracts
 * =========================================================
 * Validates:
 * - Enquiry Listing, Options, Monthly Summary & Tags
 * - Supplier Listing, Options & Monthly Summary
 */

let headers: { [key: string]: string };

test.describe('Module 05: Operations — Enquiry & Supplier API Contracts', () => {
  test.beforeEach(async ({ request }) => {
    if (!headers) {
      headers = await getAuthHeaders(request);
    }
  });

  // 1. Enquiry APIs
  test('TC-OPS-API-001: GET /api/v2/enquiry returns paginated enquiries', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/enquiry?per_page=10&current_page=1`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-OPS-API-002: GET /api/v2/enquiry/options returns enquiry categories, lead sources, and priorities', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/enquiry/options`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-OPS-API-003: GET /api/v2/enquiry/summary returns monthly enquiry metrics', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/enquiry/summary?period=month`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-OPS-API-004: GET /api/v2/tags/enquiry returns registered enquiry tags', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/tags/enquiry`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  // 2. Supplier APIs
  test('TC-OPS-API-005: GET /api/v2/supplier returns paginated suppliers list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/supplier?per_page=10&current_page=1`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-OPS-API-006: GET /api/v2/supplier/options returns supplier categories and terms options', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/supplier/options`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-OPS-API-007: GET /api/v2/supplier/summary returns monthly supplier metrics', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/supplier/summary?period=month`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });
});
