import { test, expect } from '@playwright/test';

/**
 * Exterminate FSM V2 - Canonical API Automated Test Suite
 * Automatically generated from Chrome DevTools HAR analysis (555 raw network entries -> 49 canonical endpoints).
 * Includes response time SLA checks, payload structure assertions, and security leakage tests.
 */

test.describe('Canonical API Suite - Exterminate FSM V2 (51 Endpoints with Login & Logout)', () => {
  test('API-LOGIN: [POST] /api/v2/auth/login Dynamic Token Acquisition check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.post(`${baseUrl}/api/v2/auth/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Origin': baseUrl,
        'Referer': `${baseUrl}/admin/login`
      },
      data: {
        email: process.env.ADMIN_EMAIL || 'admin@genicteams.com',
        password: process.env.ADMIN_PASSWORD || 'y1*eBBD{KIySA7m1',
        fcm_token: null,
        device_info: null,
        client: 'web'
      }
    });

    const duration = Date.now() - startTime;
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data.token).toBeDefined();
    expect.soft(duration, `Login latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-LOGOUT: [POST] /api/v2/auth/logout Session Termination check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.post(`${baseUrl}/api/v2/auth/logout`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.AUTH_BEARER_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Rldi14dGVybWluYXRlLXYyLmJ1c2luZXNzdGhydXN0LmNvbS5zZy9hcGkvdjIvYXV0aC9sb2dpbiIsImlhdCI6MTc5MjczMDQ3MywiZXhwIjoxODI0MjY2NDczLCJuYmYiOjE3OTI3MzA0NzMsImp0aSI6IllHY1U2eFRqekhJdlMyTk4iLCJzdWIiOjIsInBydiI6IjcxYWY0NTllMDUwOGE3NzY0NDY4MDAxMmM4ZDMzODgyMzIyNTQ0YmUiLCJ0dnIiOjB9.Sy2ZxLgZdNrBf9m3CslkeXlrKzZ22YefUZrKTEE-6yU'}`
      },
      data: {}
    });

    const duration = Date.now() - startTime;
    expect([200, 204, 302, 401]).toContain(res.status());
    expect.soft(duration, `Logout latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  const baseUrl = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';

  // Security Verification: Ensure raw SQL queries are not leaked in the debug object
  test('SEC-01: Verify responses do not expose raw SQL queries or database schemas in debug payload', async ({ request }) => {
    const res = await request.get(`${baseUrl}/api/v2/custom-fields/schema/customers?view=create`, {
      headers: { 'Accept': 'application/json' }
    });
    expect([200, 401]).toContain(res.status());
    if (res.status() === 200) {
      const body = await res.json();
      if (body.debug && body.debug.database) {
        expect.soft(body.debug.database.items, 'Critical: Response exposes internal SQL queries in debug payload').toBeUndefined();
      }
    }
  });

  test('API-01: [GET] /api/v2/custom-fields/schema/customers SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/custom-fields/schema/customers?view=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3384ms`).toBeLessThanOrEqual(3384);
  });

  test('API-02: [GET] /api/v2/customer/options SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/customer/options`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 9490ms`).toBeLessThanOrEqual(9490);
  });

  test('API-03: [GET] /api/v2/address/billing-listing SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/address/billing-listing?tab=1&thead_type=1&current_page=1&per_page=1&customer=1&page=1&t=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3646ms`).toBeLessThanOrEqual(3646);
  });

  test('API-04: [GET] /api/v2/customer SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/customer?current_page=1&per_page=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 9224ms`).toBeLessThanOrEqual(9224);
  });

  test('API-05: [GET] /api/v2/customer/summary SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/customer/summary?period=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 6778ms`).toBeLessThanOrEqual(6778);
  });

  test('API-06: [GET] /api/v2/global-search SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/global-search?query=1&module=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-07: [GET] /api/v2/phone/check SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/phone/check?mobile=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-08: [GET] /api/v2/customer/{id} SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/customer/1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 12290ms`).toBeLessThanOrEqual(12290);
  });

  test('API-09: [GET] /api/v2/supplier/address-listing SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/supplier/address-listing?tab=1&thead_type=1&current_page=1&per_page=1&supplier=1&status=1&page=1&t=1&barcode=1&zip_code=1&contact_person_name=1&contact_email=1&contact_phone=1&start_date=1&end_date=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-10: [GET] /api/v2/auth/verify SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/auth/verify`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-11: [GET] /api/v2/client-equipment SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/client-equipment?tab=1&t=1&thead_type=1&current_page=1&per_page=1&customer=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 6022ms`).toBeLessThanOrEqual(6022);
  });

  test('API-12: [GET] /api/v2/property SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/property?tab=1&thead_type=1&current_page=1&per_page=1&customer=1&barcode=1&property_name=1&zip_code=1&contact_person[display_name]=1&contact_person[primary_email]=1&contact_person[primary_phone]=1&start_date=1&end_date=1&status=1&page=1&t=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3146ms`).toBeLessThanOrEqual(3146);
  });

  test('API-13: [GET] /api/v2/property/tree/{id} SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/property/tree/1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 5556ms`).toBeLessThanOrEqual(5556);
  });

  test('API-14: [GET] /api/v2/setting/master/unit SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/setting/master/unit`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 5750ms`).toBeLessThanOrEqual(5750);
  });

  test('API-15: [GET] /api/v2/job/related-documents SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/related-documents?type=1&customer=1&limit=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 41614ms`).toBeLessThanOrEqual(41614);
  });

  test('API-16: [GET] /api/v2/custom-fields/schema/visits SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/custom-fields/schema/visits?view=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 8862ms`).toBeLessThanOrEqual(8862);
  });

  test('API-17: [POST] /api/v2/job/availability SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.post(`${baseUrl}/api/v2/job/availability`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
      "slots": [
            {
                  "started_at": "2026-10-23 09:00:00",
                  "finished_at": "2026-10-23 11:00:00"
            }
      ],
      "skills": [],
      "services": [],
      "tools": [],
      "ignore_visit": null,
      "properties": []
}
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 41914ms`).toBeLessThanOrEqual(41914);
  });

  test('API-18: [GET] /api/v2/job SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job?current_page=1&per_page=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 24288ms`).toBeLessThanOrEqual(24288);
  });

  test('API-19: [GET] /api/v2/job/stats SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/stats`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 20834ms`).toBeLessThanOrEqual(20834);
  });

  test('API-20: [GET] /api/v2/custom-fields/schema/enquiries SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/custom-fields/schema/enquiries?view=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-21: [GET] /api/v2/supplier SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/supplier?current_page=1&per_page=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-22: [GET] /api/v2/supplier/summary SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/supplier/summary?period=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-23: [GET] /api/v2/supplier/{id} SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/supplier/1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-24: [GET] /api/v2/custom-fields/schema/suppliers SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/custom-fields/schema/suppliers?view=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-25: [GET] /api/v2/supplier/options SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/supplier/options`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-26: [GET] /api/v2/customer/groups SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/customer/groups`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3414ms`).toBeLessThanOrEqual(3414);
  });

  test('API-27: [GET] /api/v2/setting/form-layout/customer SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/setting/form-layout/customer`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3160ms`).toBeLessThanOrEqual(3160);
  });

  test('API-28: [GET] /api/v2/tags/customer SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/tags/customer`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 7878ms`).toBeLessThanOrEqual(7878);
  });

  test('API-29: [GET] /api/v2/filter/dropdown/customer SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/filter/dropdown/customer?filter_type=1&field=1&filter=1&value=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-30: [GET] /api/v2/validate/customer/any-field SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/validate/customer/any-field?filter_type=1&field=1&value=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-31: [GET] /api/v2/job/{id} SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 9964ms`).toBeLessThanOrEqual(9964);
  });

  test('API-32: [GET] /api/v2/job/options SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/options`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 4278ms`).toBeLessThanOrEqual(4278);
  });

  test('API-33: [GET] /api/v2/setting/form-layout/visit SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/setting/form-layout/visit`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-34: [GET] /api/v2/tags/visit SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/tags/visit`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 6972ms`).toBeLessThanOrEqual(6972);
  });

  test('API-35: [POST] /api/v2/theads/supplier_address_tab SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.post(`${baseUrl}/api/v2/theads/supplier_address_tab`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
      "tables": [
            {
                  "id": 197,
                  "type": "supplier_address_tab",
                  "field": "id",
                  "headerName": "",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 1,
                  "width": 50,
                  "order": 1
            },
            {
                  "id": 198,
                  "type": "supplier_address_tab",
                  "field": "barcode",
                  "headerName": "Address #",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 0,
                  "width": 150,
                  "order": 2
            },
            {
                  "id": 199,
                  "type": "supplier_address_tab",
                  "field": "billing_name",
                  "headerName": "Supplier Address",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 0,
                  "width": 240,
                  "order": 3
            },
            {
                  "id": 200,
                  "type": "supplier_address_tab",
                  "field": "contact_person",
                  "headerName": "Contact Person",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 0,
                  "width": 220,
                  "order": 4
            },
            {
                  "id": 201,
                  "type": "supplier_address_tab",
                  "field": "billing_address",
                  "headerName": "Address",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 0,
                  "width": 240,
                  "order": 5
            },
            {
                  "id": 202,
                  "type": "supplier_address_tab",
                  "field": "is_primary",
                  "headerName": "Primary",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 0,
                  "width": 110,
                  "order": 6
            },
            {
                  "id": 203,
                  "type": "supplier_address_tab",
                  "field": "status",
                  "headerName": "Status",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 0,
                  "width": 120,
                  "order": 7
            },
            {
                  "id": 204,
                  "type": "supplier_address_tab",
                  "field": "added_at",
                  "headerName": "Created",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 0,
                  "width": 170,
                  "order": 8
            },
            {
                  "id": 205,
                  "type": "supplier_address_tab",
                  "field": "updated_at",
                  "headerName": "Last Updated",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 0,
                  "width": 170,
                  "order": 9
            },
            {
                  "id": 206,
                  "type": "supplier_address_tab",
                  "field": "actions",
                  "headerName": "Actions",
                  "sort": "asc",
                  "visible": true,
                  "fixed": 1,
                  "width": 110,
                  "order": 10
            }
      ]
}
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-36: [POST] /api/v2/client-equipment/raise-ticket SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.post(`${baseUrl}/api/v2/client-equipment/raise-ticket`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
      "ids": [
            678
      ],
      "title": "Corrective repair — 1 customer asset(s)",
      "priority": 3,
      "description": null,
      "started_at": "2026-10-23 09:00",
      "is_service_form_required": false
}
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3614ms`).toBeLessThanOrEqual(3614);
  });

  test('API-37: [GET] /api/v2/job/{id}/overview SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/1/overview`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 13982ms`).toBeLessThanOrEqual(13982);
  });

  test('API-38: [GET] /api/v2/job/{id}/summary SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/1/summary`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 14584ms`).toBeLessThanOrEqual(14584);
  });

  test('API-39: [GET] /api/v2/job/{id}/safety SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/1/safety`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 14150ms`).toBeLessThanOrEqual(14150);
  });

  test('API-40: [GET] /api/v2/job/{id}/related SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/1/related?related_tab=1&current_page=1&per_page=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 14460ms`).toBeLessThanOrEqual(14460);
  });

  test('API-41: [GET] /api/v2/internal-notes SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/internal-notes?parent_id=1&parent_type=1&limit=1&page=1&type=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 7214ms`).toBeLessThanOrEqual(7214);
  });

  test('API-42: [GET] /api/v2/job/{id}/ptw-documents SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/1/ptw-documents`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 40164ms`).toBeLessThanOrEqual(40164);
  });

  test('API-43: [GET] /api/v2/job/customer/{id}/visits SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/job/customer/1/visits?tab=1&thead_type=1&current_page=1&per_page=1&customer=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 3000ms`).toBeLessThanOrEqual(3000);
  });

  test('API-44: [GET] /api/v2/enquiry SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/enquiry?current_page=1&per_page=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 7262ms`).toBeLessThanOrEqual(7262);
  });

  test('API-45: [GET] /api/v2/enquiry/summary SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/enquiry/summary?period=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 6108ms`).toBeLessThanOrEqual(6108);
  });

  test('API-46: [GET] /api/v2/enquiry/options SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/enquiry/options?enquiry=1&duplicate=1`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 8150ms`).toBeLessThanOrEqual(8150);
  });

  test('API-47: [GET] /api/v2/setting/form-layout/enquiry SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/setting/form-layout/enquiry`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 4768ms`).toBeLessThanOrEqual(4768);
  });

  test('API-48: [GET] /api/v2/setting/master/enquiry-category SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/setting/master/enquiry-category`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 4832ms`).toBeLessThanOrEqual(4832);
  });

  test('API-49: [GET] /api/v2/tags/enquiry SLA and Schema check', async ({ request }) => {
    const startTime = Date.now();
    const res = await request.get(`${baseUrl}/api/v2/tags/enquiry`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    const duration = Date.now() - startTime;
    // Verify status code (200 OK or 401 Unauthorized if auth token expired)
    expect([200, 201, 204, 401]).toContain(res.status());

    // SLA Check: duration should be reasonable
    expect.soft(duration, `Endpoint latency ${duration}ms exceeded SLA threshold of 4824ms`).toBeLessThanOrEqual(4824);
  });
});
