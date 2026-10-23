/**
 * Customer Provider Helper (CRM > Customer API)
 * ==============================================
 * Connects to the /api/v2/customer API with increased page limits (per_page=100/500),
 * loads and normalizes all customer details (IDs, barcodes, sites, contact info),
 * and provides search, lookup, and visit autofill data for test automation.
 */

import * as fs from 'fs';
import * as path from 'path';
import { APIRequestContext } from '@playwright/test';
import { getAuthToken } from './apiAuthHelper';

export interface CustomerSite {
  id: number;
  barcode: string;
  name: string;
  address: string;
  parent?: any;
  contact?: string;
  email?: string;
  phone?: string;
}

export interface CustomerProfile {
  id: number;
  barcode: string;
  display_name: string;
  company_name: string;
  company_type: string;
  activated: boolean;
  primary_email: string;
  primary_phone: string;
  full_address: string;
  unit_no?: string;
  street_1?: string;
  street_2?: string;
  zip_code?: string;
  category?: string;
  contact_person_name: string;
  contact_person_designation?: string;
  sites: CustomerSite[];
  site_count: number;
  primary_property_id?: number;
  primary_site_barcode: string;
  primary_site_name: string;
  primary_site_address: string;
}

export interface CustomerCacheData {
  total_rows: number;
  returned_rows: number;
  per_page: number;
  customers: CustomerProfile[];
}

export interface VisitAutofillData {
  customerId: number;
  customerBarcode: string;
  customerSearchText: string;
  billingLocationBarcode: string;
  propertyId?: number;
  contactPersonName: string;
  contactPersonPhone: string;
  contactPersonEmail: string;
  visitTitle: string;
  visitReference: string;
}

const CACHE_PATH = path.resolve(__dirname, '../data/customers_cache.json');
const DEFAULT_BEARER_TOKEN =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.' +
  'eyJpc3MiOiJodHRwczovL2Rldi14dGVybWluYXRlLXYyLmJ1c2luZXNzdGhydXN0LmNvbS5zZy9hcGkvdjIvYXV0aC9sb2dpbiIs' +
  'ImlhdCI6MTc5MjY1NjM4OSwiZXhwIjoxODI0MTkyMzg5LCJuYmYiOjE3OTI2NTYzODksImp0aSI6IjZoNlkxcmJqcWszcXdHMzAiLCJzdWIiOjIsInBydiI6IjcxYWY0NTllMDUwOGE3NzY0NDY4MDAxMmM4ZDMzODgyMzIyNTQ0YmUiLCJ0dnIiOjB9.' +
  'Dl1jO33anroXzLlC4evK6kw6yBpAgkfu-x59Ck3O7h8';

export class CustomerProvider {
  private static cachedCustomers: CustomerProfile[] | null = null;

  /**
   * Loads customers from data/customers_cache.json if present.
   */
  public static loadCache(): CustomerProfile[] {
    if (this.cachedCustomers && this.cachedCustomers.length > 0) {
      return this.cachedCustomers;
    }

    if (fs.existsSync(CACHE_PATH)) {
      try {
        const raw = fs.readFileSync(CACHE_PATH, 'utf-8');
        const parsed: CustomerCacheData = JSON.parse(raw);
        if (parsed?.customers && Array.isArray(parsed.customers)) {
          this.cachedCustomers = parsed.customers;
          return this.cachedCustomers;
        }
      } catch (e) {
        console.warn(`[CustomerProvider] Warning: could not parse ${CACHE_PATH}:`, e);
      }
    }
    return [];
  }

  /**
   * Fetches customer rows live from /api/v2/customer with high page limit (e.g. per_page=100 or 500).
   */
  public static async fetchLive(
    request: APIRequestContext,
    options?: {
      baseUrl?: string;
      token?: string;
      perPage?: number;
      updateCache?: boolean;
    }
  ): Promise<CustomerProfile[]> {
    const baseUrl = (options?.baseUrl || 'https://dev-xterminate-v2.businessthrust.com.sg').replace(/\/$/, '');
    const token = options?.token || (await getAuthToken(request));
    const perPage = options?.perPage ?? 500;
    const updateCache = options?.updateCache ?? true;

    const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    const url = `${baseUrl}/api/v2/customer?current_page=1&per_page=${perPage}`;

    console.log(`[CustomerProvider] Fetching customer data: ${url}`);
    const response = await request.get(url, {
      headers: {
        Accept: 'application/json',
        Authorization: authHeader,
      },
      timeout: 35000,
    });

    if (!response.ok()) {
      throw new Error(`Failed to fetch customers: ${response.status()} ${response.statusText()}`);
    }

    const json = await response.json();
    const rows = json?.data?.rows || [];
    const totalRows = json?.data?.total_rows || rows.length;

    const normalized: CustomerProfile[] = rows.map((r: any) => {
      const sites: CustomerSite[] = r.sites || [];
      const firstSite = sites[0] || {};
      const addrParts = [
        String(r.unit_no || '').trim(),
        String(r.street_1 || '').trim(),
        String(r.street_2 || '').trim(),
        String(r.zip_code || '').trim(),
      ].filter(Boolean);

      return {
        id: r.id,
        barcode: r.barcode || '',
        display_name: r.display_name || '',
        company_name: r.company_name || '',
        company_type: r.company_type || 'personal',
        activated: Boolean(r.activated ?? true),
        primary_email: r.primary_email || r.company_email || '',
        primary_phone: r.primary_phone || r.company_number || '',
        full_address: addrParts.join(', '),
        unit_no: r.unit_no || '',
        street_1: r.street_1 || '',
        street_2: r.street_2 || '',
        zip_code: r.zip_code || '',
        category: r.category || '',
        contact_person_name: r.contact_person_name || r.display_name || '',
        contact_person_designation: r.contact_person_designation || '',
        sites,
        site_count: sites.length,
        primary_property_id: firstSite.id,
        primary_site_barcode: firstSite.barcode || '',
        primary_site_name: firstSite.name || '',
        primary_site_address: firstSite.address || '',
      };
    });

    this.cachedCustomers = normalized;

    if (updateCache) {
      try {
        const payload: CustomerCacheData = {
          total_rows: totalRows,
          returned_rows: normalized.length,
          per_page: perPage,
          customers: normalized,
        };
        fs.writeFileSync(CACHE_PATH, JSON.stringify(payload, null, 2), 'utf-8');
        console.log(`[CustomerProvider] Updated customer cache at ${CACHE_PATH} (${normalized.length} records)`);
      } catch (err) {
        console.warn('[CustomerProvider] Failed writing cache file:', err);
      }
    }

    return normalized;
  }

  /**
   * Retrieves all customers, reading cache first or falling back to empty.
   */
  public static getAll(): CustomerProfile[] {
    return this.loadCache();
  }

  /**
   * Searches customer records by any keyword across name, barcode, email, phone, and site barcode.
   */
  public static search(query: string, customerPool?: CustomerProfile[]): CustomerProfile[] {
    const list = customerPool || this.getAll();
    const q = query.trim().toLowerCase();
    if (!q) return list;

    return list.filter((c) =>
      String(c.id).includes(q) ||
      c.barcode.toLowerCase().includes(q) ||
      c.display_name.toLowerCase().includes(q) ||
      c.company_name.toLowerCase().includes(q) ||
      c.primary_email.toLowerCase().includes(q) ||
      c.primary_phone.toLowerCase().includes(q) ||
      c.primary_site_barcode.toLowerCase().includes(q)
    );
  }

  /**
   * Finds customer by exact ID.
   */
  public static getById(id: number): CustomerProfile | undefined {
    return this.getAll().find((c) => c.id === id);
  }

  /**
   * Finds customer by barcode (e.g. 'C036').
   */
  public static getByBarcode(barcode: string): CustomerProfile | undefined {
    const target = barcode.trim().toUpperCase();
    return this.getAll().find((c) => c.barcode.trim().toUpperCase() === target);
  }

  /**
   * Picks a valid customer for Visit automation.
   * Guarantees that the customer has at least 1 site/property location.
   */
  public static pickCustomerForVisit(options?: {
    requireSite?: boolean;
    preferredBarcode?: string;
  }): CustomerProfile {
    const list = this.getAll();
    if (options?.preferredBarcode) {
      const preferred = this.getByBarcode(options.preferredBarcode);
      if (preferred) return preferred;
    }

    const requireSite = options?.requireSite ?? true;
    const candidates = list.filter((c) => c.activated && (!requireSite || c.site_count > 0));

    if (!candidates.length) {
      throw new Error('[CustomerProvider] No active customer with valid site locations available.');
    }

    // Deterministic selection or random pick
    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    return chosen;
  }

  /**
   * Prepares the full autofill payload for creating a Visit in UI or via API.
   */
  public static getVisitAutofillData(customer?: CustomerProfile): VisitAutofillData {
    const cust = customer || this.pickCustomerForVisit();
    const refSuffix = Math.floor(1000 + Math.random() * 9000);

    return {
      customerId: cust.id,
      customerBarcode: cust.barcode,
      customerSearchText: cust.display_name || cust.company_name || cust.barcode,
      billingLocationBarcode: cust.primary_site_barcode || 'L026',
      propertyId: cust.primary_property_id,
      contactPersonName: cust.contact_person_name || cust.display_name,
      contactPersonPhone: cust.primary_phone,
      contactPersonEmail: cust.primary_email,
      visitTitle: `Pest Control Maintenance Visit - ${cust.display_name}`,
      visitReference: `REF-VISIT-${cust.barcode}-${refSuffix}`,
    };
  }

  /**
   * Builds an API request body for POST /api/v2/job or /api/job.
   */
  public static buildVisitApiPayload(customer?: CustomerProfile, overrides?: Record<string, any>): Record<string, any> {
    const autofill = this.getVisitAutofillData(customer);

    return {
      customer: autofill.customerId,
      property: autofill.propertyId ? String(autofill.propertyId) : '',
      billing: autofill.propertyId ? String(autofill.propertyId) : '',
      reference: autofill.visitReference,
      title: autofill.visitTitle,
      description: `<p>Automated visit for customer ${autofill.customerSearchText} (${autofill.customerBarcode}).</p>`,
      job_type: 1,
      priority: 2,
      status: 1,
      amount_to_be_collected: '0.00',
      total: '120.00',
      sub_total: '120.00',
      tax_amount: '0.00',
      discount_amount: '0.00',
      ...overrides,
    };
  }
}
