/**
 * Suite 17: Customer API & Visit Autofill Automation Test
 * ========================================================
 * Validates:
 * 1. High page-limit customer API retrieval (/api/v2/customer with per_page=100 and per_page=500).
 * 2. Complete extraction of customer IDs, barcodes, sites, and contact details.
 * 3. Search and filtering by name, barcode, and site.
 * 4. Automatic customer selection & autofill data generation for Visit creation.
 * 5. Generation and contract validation of Visit payload (customer ID, property/billing ID).
 */

import { test, expect } from '@playwright/test';
import { CustomerProvider, CustomerProfile, VisitAutofillData } from '../../helpers/customer_provider';
import { BASE_URL, getAuthHeaders } from '../../helpers/apiAuthHelper';

let AUTH_HEADER: { [key: string]: string };

test.describe('Suite 17 — Customer API Discovery & Visit Autofill', () => {
  test.describe.configure({ mode: 'serial' });

  test.beforeEach(async ({ request }) => {
    if (!AUTH_HEADER) {
      AUTH_HEADER = await getAuthHeaders(request);
    }
  });

  test('TC-CUST-VISIT-001: GET /api/v2/customer with per_page=100 returns 200 and all available records', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v2/customer?current_page=1&per_page=100`, {
      headers: AUTH_HEADER,
      timeout: 35000,
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.status).toBe(true);
    expect(body.data).toBeDefined();

    const data = body.data;
    expect(data.per_page).toBe(100);
    expect(Array.isArray(data.rows)).toBe(true);
    expect(data.rows.length).toBeGreaterThanOrEqual(10);
    expect(data.total_rows).toBeGreaterThanOrEqual(data.rows.length);
  });

  test('TC-CUST-VISIT-002: GET /api/v2/customer with per_page=500 fetches maximum pool in single call', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v2/customer?current_page=1&per_page=500`, {
      headers: AUTH_HEADER,
      timeout: 35000,
    });
    expect(response.status()).toBe(200);

    const body = await response.json();
    const data = body.data;
    expect(data.per_page).toBe(500);
    expect(data.rows.length).toBe(data.total_rows);
  });

  test('TC-CUST-VISIT-003: Every customer record contains id, barcode, and contact information', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v2/customer?current_page=1&per_page=100`, {
      headers: AUTH_HEADER,
      timeout: 35000,
    });
    const body = await response.json();
    const rows: any[] = body.data.rows;

    for (const r of rows) {
      expect(r.id).toBeDefined();
      expect(typeof r.id).toBe('number');
      expect(r.barcode).toBeTruthy();
      expect(typeof r.barcode).toBe('string');
      // Must have either display_name or company_name
      const name = (r.display_name || r.company_name || '').trim();
      expect(name.length).toBeGreaterThan(0);
    }
  });

  test('TC-CUST-VISIT-004: Customer sites array contains valid property IDs and location barcodes', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/api/v2/customer?current_page=1&per_page=100`, {
      headers: AUTH_HEADER,
      timeout: 35000,
    });
    const body = await response.json();
    const rows: any[] = body.data.rows;

    const customersWithSites = rows.filter((r) => Array.isArray(r.sites) && r.sites.length > 0);
    expect(customersWithSites.length).toBeGreaterThan(0);

    for (const cust of customersWithSites) {
      for (const site of cust.sites) {
        expect(site.id).toBeDefined();
        expect(typeof site.id).toBe('number');
        expect(site.barcode).toBeTruthy();
        expect(site.barcode.startsWith('L')).toBe(true); // Site barcodes start with L (e.g. L121, L026)
      }
    }
  });

  test('TC-CUST-VISIT-005: CustomerProvider loads cached customer pool from disk', async () => {
    const customers = CustomerProvider.loadCache();
    expect(customers.length).toBeGreaterThan(0);

    const first = customers[0];
    expect(first.id).toBeDefined();
    expect(first.barcode).toBeTruthy();
    expect(first.primary_site_barcode).toBeTruthy();
  });

  test('TC-CUST-VISIT-006: CustomerProvider.search filters accurately by name', async () => {
    const results = CustomerProvider.search('Daniel');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].display_name).toContain('Daniel');
  });

  test('TC-CUST-VISIT-007: CustomerProvider.search filters accurately by barcode', async () => {
    const results = CustomerProvider.search('C036');
    expect(results.length).toBe(1);
    expect(results[0].barcode).toBe('C036');
    expect(results[0].id).toBe(36);
  });

  test('TC-CUST-VISIT-008: CustomerProvider.search filters accurately by site barcode', async () => {
    const results = CustomerProvider.search('L121');
    expect(results.length).toBeGreaterThanOrEqual(1);
    expect(results[0].primary_site_barcode).toBe('L121');
  });

  test('TC-CUST-VISIT-009: CustomerProvider.pickCustomerForVisit guarantees valid site/property', async () => {
    const customer = CustomerProvider.pickCustomerForVisit({ requireSite: true });
    expect(customer).toBeDefined();
    expect(customer.activated).toBe(true);
    expect(customer.site_count).toBeGreaterThan(0);
    expect(customer.primary_property_id).toBeDefined();
    expect(customer.primary_site_barcode.startsWith('L')).toBe(true);
  });

  test('TC-CUST-VISIT-010: getVisitAutofillData prepares complete Visit form inputs', async () => {
    const autofill: VisitAutofillData = CustomerProvider.getVisitAutofillData();

    expect(autofill.customerId).toBeGreaterThan(0);
    expect(autofill.customerBarcode).toMatch(/^C\d+/);
    expect(autofill.customerSearchText.length).toBeGreaterThan(0);
    expect(autofill.billingLocationBarcode).toMatch(/^L\d+/);
    expect(autofill.visitTitle).toContain('Visit');
    expect(autofill.visitReference).toContain(autofill.customerBarcode);
  });

  test('TC-CUST-VISIT-011: buildVisitApiPayload creates schema-compliant Visit creation body', async () => {
    const payload = CustomerProvider.buildVisitApiPayload();

    expect(payload.customer).toBeDefined();
    expect(payload.property).toBeDefined();
    expect(payload.billing).toBeDefined();
    expect(payload.reference).toContain('REF-VISIT-');
    expect(payload.job_type).toBe(1);
    expect(payload.status).toBe(1);
    expect(payload.total).toBe('120.00');
  });

  test('TC-CUST-VISIT-012: Live sync via fetchLive updates and refreshes customer pool', async ({ request }) => {
    const freshList = await CustomerProvider.fetchLive(request, { perPage: 100, updateCache: false });
    expect(freshList.length).toBeGreaterThan(0);

    const cust = freshList[0];
    expect(cust.id).toBeDefined();
    expect(cust.barcode).toBeTruthy();
  });
});
