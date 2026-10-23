import { test, expect } from '@playwright/test';
import { getAuthToken } from '../../helpers/apiAuthHelper';

/**
 * Module 20: Authentication Lifecycle v2 API Contracts
 * ====================================================
 * Validates Login, Token Verification, Session Management,
 * Logout, and Token Revocation Blacklisting behaviors.
 */

const BASE_URL = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';
const AUTH_EMAIL = 'admin@genicteams.com';
const AUTH_PASSWORD = process.env.ADMIN_PASSWORD || 'y1*eBBD{KIySA7m1';

test.describe('Module 20: Authentication Lifecycle v2 API Contracts', () => {
  test.describe.configure({ mode: 'serial' });

  test('TC-API-AUTH-001: POST /api/v2/auth/login with valid credentials returns 200 and access token', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/v2/auth/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        email: AUTH_EMAIL,
        password: AUTH_PASSWORD,
        fcm_token: null,
        device_info: null,
        client: 'web'
      }
    });

    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();
    expect(typeof body.data.token).toBe('string');
    expect(body.data.token.length).toBeGreaterThan(20);
    expect(body.data.user).toBeDefined();
    expect(body.data.user.email).toBe(AUTH_EMAIL);
  });

  test('TC-API-AUTH-002: POST /api/v2/auth/login with invalid password rejects authentication', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/v2/auth/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        email: AUTH_EMAIL,
        password: 'DefinitivelyIncorrectPassword123!',
        client: 'web'
      }
    });

    expect([400, 401, 422]).toContain(res.status());
    const body = await res.json();
    expect(body.status).toBeFalsy();
  });

  test('TC-API-AUTH-003: POST /api/v2/auth/login with empty payload returns validation errors', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/v2/auth/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {}
    });

    expect([400, 422]).toContain(res.status());
    const body = await res.json();
    expect(body.status).toBeFalsy();
  });

  test('TC-API-AUTH-004: GET /api/v2/auth/verify with valid token validates active session', async ({ request }) => {
    const token = await getAuthToken(request);

    // Verify session
    const verifyRes = await request.get(`${BASE_URL}/api/v2/auth/verify`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    expect(verifyRes.status()).toBe(200);
    const verifyBody = await verifyRes.json();
    expect(verifyBody.status).toBe(true);
    expect(verifyBody.data).toBeDefined();
  });

  test('TC-API-AUTH-005 & TC-API-AUTH-006: Complete Logout Lifecycle & Token Revocation', async ({ request }) => {
    // Step 1: Login to get dedicated ephemeral token
    const loginRes = await request.post(`${BASE_URL}/api/v2/auth/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        email: AUTH_EMAIL,
        password: AUTH_PASSWORD,
        client: 'web'
      }
    });
    expect(loginRes.status()).toBe(200);
    const ephemeralToken = (await loginRes.json()).data.token;

    // Step 2: Verify token is active
    const preCheck = await request.get(`${BASE_URL}/api/v2/auth/verify`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${ephemeralToken}`
      }
    });
    expect(preCheck.status()).toBe(200);

    // Step 3: TC-API-AUTH-005 - Call Logout API
    const logoutRes = await request.post(`${BASE_URL}/api/v2/auth/logout`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ephemeralToken}`
      },
      data: {}
    });

    expect(logoutRes.status()).toBe(200);
    const logoutBody = await logoutRes.json();
    expect(logoutBody.status).toBe(true);
    expect(logoutBody.message).toMatch(/logged out/i);

    // Step 4: TC-API-AUTH-006 - Verify token is blacklisted and cannot be reused
    const postCheck = await request.get(`${BASE_URL}/api/v2/auth/verify`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${ephemeralToken}`
      }
    });

    expect([401, 403]).toContain(postCheck.status());
  });

  test('TC-API-AUTH-007: POST /api/v2/auth/logout without token rejects request as unauthorized', async ({ request }) => {
    const res = await request.post(`${BASE_URL}/api/v2/auth/logout`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {}
    });

    expect([401, 403]).toContain(res.status());
  });

});
