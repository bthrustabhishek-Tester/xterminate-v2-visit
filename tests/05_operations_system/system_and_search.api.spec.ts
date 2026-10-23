import { test, expect } from '@playwright/test';
import { BASE_URL, getAuthHeaders } from '../../helpers/apiAuthHelper';

/**
 * Module 05: System Configuration & Universal Search API Contracts
 * =================================================================
 * Validates:
 * - GET /api/v2/configuration (global system settings)
 * - GET /api/v2/custom-fields/schema/visits (custom fields schema)
 * - GET /api/v2/setting/master/unit (master units of measurement)
 * - GET /api/v2/global-search/modules (searchable module registry)
 * - GET /api/v2/global-search (universal search query)
 */

let headers: { [key: string]: string };

test.describe('Module 05: System Configuration & Universal Search API Contracts', () => {
  test.beforeEach(async ({ request }) => {
    if (!headers) {
      headers = await getAuthHeaders(request);
    }
  });

  test('TC-SYS-API-001: GET /api/v2/configuration returns global system settings', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/configuration`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-SYS-API-002: GET /api/v2/custom-fields/schema/visits returns custom fields schema for visit creation', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/custom-fields/schema/visits?view=create`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-SYS-API-003: GET /api/v2/setting/master/unit returns unit of measure master list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/setting/master/unit`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-SYS-API-004: GET /api/v2/global-search/modules returns searchable modules list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/global-search/modules`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-SYS-API-005: GET /api/v2/global-search returns matched records across modules', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/global-search?query=test`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });
});
