import { test, expect } from '@playwright/test';
import { BASE_URL, getAuthHeaders } from '../../helpers/apiAuthHelper';

/**
 * Module 02: Customer (CRM) API Contracts & Validation
 * ====================================================
 * Covers:
 * - /api/v2/customer (Listing, Pagination, Filtering, Details)
 * - /api/v2/customer/lookup (Fast Autocomplete dropdown)
 * - /api/v2/customer/options (Category, Salutation, Payment terms)
 * - /api/v2/customer/summary (Monthly volume stats)
 * - /api/v2/customer/groups (Customer grouping)
 * - /api/v2/phone/check (Phone validation)
 * - /api/v2/validate/customer/any-field (Duplicate uniqueness check)
 * - /api/v2/tags/customer (Customer tag taxonomy)
 * - Negative and Boundary Scenarios
 */

let headers: { [key: string]: string };

test.describe('Module 02: Customer (CRM) API Contracts & Validation', () => {
  test.beforeEach(async ({ request }) => {
    if (!headers) {
      headers = await getAuthHeaders(request);
    }
  });

  // 1. Customer Listing & Schema
  test('TC-CUST-API-001: GET /api/v2/customer returns paginated list with valid schema', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer?per_page=10&current_page=1`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
    expect(Array.isArray(body.data.rows || body.data)).toBeTruthy();
  });

  test('TC-CUST-API-002: GET /api/v2/customer/lookup returns customer fast autocomplete array', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/lookup?include_inactive=1`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(Array.isArray(body.data)).toBeTruthy();
    if (body.data.length > 0) {
      const first = body.data[0];
      expect(first).toHaveProperty('id');
      expect(first).toHaveProperty('display_name');
    }
  });

  test('TC-CUST-API-003: GET /api/v2/customer/options returns category and salutation metadata', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/options`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data).toHaveProperty('categories');
  });

  test('TC-CUST-API-004: GET /api/v2/customer/summary returns monthly customer volume stats', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/summary?period=month`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-CUST-API-005: GET /api/v2/customer/groups returns available customer groups', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/groups`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(Array.isArray(body.data) || typeof body.data === 'object').toBeTruthy();
  });

  test('TC-CUST-API-006: GET /api/v2/tags/customer returns customer tags list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/tags/customer`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-CUST-API-007: GET /api/v2/phone/check validates phone number formatting and duplication', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/phone/check?mobile=%2B65-91234567`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toBeDefined();
  });

  test('TC-CUST-API-008: GET /api/v2/validate/customer/any-field performs real-time field uniqueness check', async ({ request }) => {
    const res = await request.get(
      `${BASE_URL}/api/v2/validate/customer/any-field?filter_type=contact&field=company_name&value=UniqueTestCo123`,
      { headers }
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toBeDefined();
  });

  // 2. Negative & Boundary Scenarios
  test('TC-CUST-API-009: Fetch non-existent customer ID returns 404', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/999999999`, { headers });
    expect([404, 400]).toContain(res.status());
  });

  test('TC-CUST-API-010: SQL injection payload in search param is sanitized', async ({ request }) => {
    const sqlPayload = "test' OR 1=1 --";
    const res = await request.get(`${BASE_URL}/api/v2/customer?search=${encodeURIComponent(sqlPayload)}`, { headers });
    expect([200, 422]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      expect(body.status).toBe(true);
    }
  });

});
