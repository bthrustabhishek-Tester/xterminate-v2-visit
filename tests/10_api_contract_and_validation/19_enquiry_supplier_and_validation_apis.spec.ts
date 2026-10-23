/**
 * Module 19: Enquiry, Supplier, Customer Validation & Asset APIs
 * ======================================================================
 * Discovered from real network interactions.
 * Fully self-contained: zero external file dependencies.
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';
const BEARER_TOKEN =
  process.env.BEARER_TOKEN ||
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
  'eyJpc3MiOiJodHRwczovL2Rldi14dGVybWluYXRlLXYyLmJ1c2luZXNzdGhydXN0LmNvbS5zZy9hcGkvdjIvYXV0aC9sb2dpbiIs' +
  'ImlhdCI6MTc5MjY1NjM4OSwiZXhwIjoxODI0MTkyMzg5LCJuYmYiOjE3OTI2NTYzODksImp0aSI6IjZoNlkxcmJqcWszcXdHMzAiLCJzdWIiOjIsInBydiI6IjcxYWY0NTllMDUwOGE3NzY0NDY4MDAxMmM4ZDMzODgyMzIyNTQ0YmUiLCJ0dnIiOjB9.' +
  'Dl1jO33anroXzLlC4evK6kw6yBpAgkfu-x59Ck3O7h8';

const headers = {
  Accept: 'application/json',
  Authorization: `Bearer ${BEARER_TOKEN}`,
};

test.describe('Module 19: Enquiry, Supplier, Customer Validation & Asset APIs (13 Scenarios)', () => {
  // 1. Customer Summary & Validation
  test('TC-API-V2-020: GET /api/v2/customer/summary returns monthly customer volume stats', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/summary?period=month`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-021: GET /api/v2/customer/groups returns available customer groups', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/groups`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data) || typeof body.data === 'object').toBeTruthy();
  });

  test('TC-API-V2-022: GET /api/v2/phone/check validates phone number formatting and duplication', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/phone/check?mobile=%2B65-91234567`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toBeDefined();
  });

  test('TC-API-V2-023: GET /api/v2/validate/customer/any-field performs real-time field uniqueness check', async ({ request }) => {
    const res = await request.get(
      `${BASE_URL}/api/v2/validate/customer/any-field?filter_type=contact&field=company_name&value=UniqueTestCo123`,
      { headers }
    );
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body).toBeDefined();
  });

  test('TC-API-V2-024: GET /api/v2/tags/customer returns customer tags list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/tags/customer`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  // 2. Enquiry Module APIs
  test('TC-API-V2-025: GET /api/v2/enquiry returns paginated enquiries', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/enquiry?current_page=1&per_page=20`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-026: GET /api/v2/enquiry/options returns enquiry categories, lead sources, and priorities', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/enquiry/options?enquiry=0&duplicate=0`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-027: GET /api/v2/enquiry/summary returns monthly enquiry metrics', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/enquiry/summary?period=month`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-028: GET /api/v2/tags/enquiry returns registered enquiry tags', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/tags/enquiry`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  // 3. Supplier Module APIs
  test('TC-API-V2-029: GET /api/v2/supplier returns paginated suppliers list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/supplier?current_page=1&per_page=20`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-030: GET /api/v2/supplier/options returns supplier categories and terms options', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/supplier/options`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-031: GET /api/v2/supplier/summary returns monthly supplier metrics', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/supplier/summary?period=month`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  // 4. Global Search
  test('TC-API-V2-032: GET /api/v2/global-search returns matched records across modules', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/global-search?query=Daniel&module=customer`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });
});
