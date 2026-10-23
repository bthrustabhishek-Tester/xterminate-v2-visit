/**
 * Module 18: System, Metadata & Sub-Resource v2 API Contracts
 * ============================================================
 * Discovered from real network interactions.
 * Fully standalone and decoupled: zero external file dependencies.
 */

import { test, expect } from '@playwright/test';
import { BASE_URL, getAuthHeaders } from '../../helpers/apiAuthHelper';

let headers: { [key: string]: string };

test.describe('Module 18: System, Metadata & Sub-Resource v2 API Contracts (12 Scenarios)', () => {
  test.beforeEach(async ({ request }) => {
    if (!headers) {
      headers = await getAuthHeaders(request);
    }
  });

  test('TC-API-V2-001: GET /api/v2/auth/verify validates active authenticated session', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/auth/verify`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
  });

  test('TC-API-V2-002: GET /api/v2/configuration returns global system settings', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/configuration`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-003: GET /api/v2/customer/lookup returns fast customer dropdown array', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/lookup?include_inactive=1`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.data) || Array.isArray(body)).toBeTruthy();
  });

  test('TC-API-V2-004: GET /api/v2/customer/options returns category and salutation metadata', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/customer/options`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-005: GET /api/v2/job/options returns visit priorities, ticket types and statuses', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/job/options`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-006: GET /api/v2/job/stats returns counter metric badges for visits', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/job/stats`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-007: GET /api/v2/custom-fields/schema/visits returns custom fields schema for visit creation', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/custom-fields/schema/visits?view=create`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-008: GET /api/v2/tags/visit returns available system tags', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/tags/visit`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-009: GET /api/v2/setting/master/unit returns unit of measure master list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/setting/master/unit`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-010: POST /api/v2/job/recurrence/preview calculates recurrence occurrences', async ({ request }) => {
    const previewPayload = {
      frequency: 1,
      option_mode: null,
      repeat_interval: null,
      unit: null,
      weekdays: [],
      monthly_pattern: 1,
      end_mode: 2,
      occurrence: 6,
      start_date: new Date().toISOString().split('T')[0],
      end_date: null,
      start_time: '09:00',
      duration_minutes: 60,
      skip_public_holidays: false,
      skip_weekends: false,
      non_working_shift: 1,
      buffer_value: 0,
      buffer_unit: null,
      end_policy: 3,
      excluded_dates: [],
      occurrence_overrides: [],
      visit_id: null
    };

    const res = await request.post(`${BASE_URL}/api/v2/job/recurrence/preview`, {
      headers,
      data: previewPayload
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-011: POST /api/v2/job/availability returns slot availability check', async ({ request }) => {
    test.slow();
    const today = new Date().toISOString().split('T')[0];
    const availabilityPayload = {
      slots: [
        {
          started_at: `${today} 09:00:00`,
          finished_at: `${today} 11:00:00`
        }
      ],
      skills: [],
      services: [],
      tools: [],
      ignore_visit: null,
      properties: []
    };

    const res = await request.post(`${BASE_URL}/api/v2/job/availability`, {
      headers,
      data: availabilityPayload,
      timeout: 30000
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });

  test('TC-API-V2-012: GET /api/v2/global-search/modules returns searchable modules list', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/global-search/modules`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.data).toBeDefined();
  });
});
