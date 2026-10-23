import { test, expect } from '@playwright/test';
import { BASE_URL, getAuthHeaders } from '../../helpers/apiAuthHelper';

/**
 * Module 03: Visit (Jobs) v2 Services & Scheduling APIs
 * =====================================================
 * Validates:
 * - GET /api/v2/job/options (visit priorities, ticket types and statuses)
 * - GET /api/v2/job/stats (counter metric badges for visits)
 * - GET /api/v2/tags/visit (available system tags for visits)
 * - POST /api/v2/job/recurrence/preview (calculates recurrence occurrences)
 * - POST /api/v2/job/availability (slot availability calculation engine)
 */

let headers: { [key: string]: string };

test.describe('Module 03: Visit (Jobs) v2 Services & Scheduling APIs', () => {
  test.beforeEach(async ({ request }) => {
    if (!headers) {
      headers = await getAuthHeaders(request);
    }
  });

  test('TC-VISIT-API-001: GET /api/v2/job/options returns visit priorities, ticket types and statuses', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/job/options`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data).toHaveProperty('ticket_types');
  });

  test('TC-VISIT-API-002: GET /api/v2/job/stats returns counter metric badges for visits', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/job/stats`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
    expect(body.data).toHaveProperty('overview');
  });

  test('TC-VISIT-API-003: GET /api/v2/tags/visit returns available system tags', async ({ request }) => {
    const res = await request.get(`${BASE_URL}/api/v2/tags/visit`, { headers });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-VISIT-API-004: POST /api/v2/job/recurrence/preview calculates recurrence occurrences', async ({ request }) => {
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
      visit_id: null
    };

    const res = await request.post(`${BASE_URL}/api/v2/job/recurrence/preview`, {
      headers,
      data: previewPayload
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
  });

  test('TC-VISIT-API-005: POST /api/v2/job/availability returns slot availability check', async ({ request }) => {
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
});
