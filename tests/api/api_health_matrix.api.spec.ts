import { test, expect } from '@playwright/test';
import { getAuthHeaders } from '../../helpers/apiAuthHelper';

test.describe('Dedicated API Suite: Core Service Health & Latency SLA Matrix', () => {
  const coreEndpoints = [
    { name: 'Customer Summary', url: '/api/v2/customer/summary', expectedStatus: 200 },
    { name: 'Customer Options', url: '/api/v2/customer/options', expectedStatus: 200 },
    { name: 'Visit Options', url: '/api/v2/job/options', expectedStatus: 200 },
    { name: 'Visit Stats', url: '/api/v2/job/stats', expectedStatus: 200 },
    { name: 'Quotation Options', url: '/api/v2/quotation/options', expectedStatus: 200 },
    { name: 'Invoice Options', url: '/api/v2/invoice/options', expectedStatus: 200 },
    { name: 'Enquiry Options', url: '/api/v2/enquiry/options', expectedStatus: 200 },
    { name: 'Supplier Options', url: '/api/v2/supplier/options', expectedStatus: 200 },
    { name: 'System Configuration', url: '/api/v2/configuration', expectedStatus: 200 },
    { name: 'Global Search Modules', url: '/api/v2/global-search/modules', expectedStatus: 200 },
  ];

  for (const ep of coreEndpoints) {
    test(`SLA & Contract: ${ep.name} (${ep.url}) responds < 8000ms`, async ({ request }) => {
      const authHeaders = await getAuthHeaders(request);
      const startTime = Date.now();
      const res = await request.get(ep.url, { headers: authHeaders });
      const duration = Date.now() - startTime;

      expect(res.status()).toBe(ep.expectedStatus);
      expect(duration, `Endpoint ${ep.url} took ${duration}ms, exceeding SLA`).toBeLessThan(8000);

      const json = await res.json();
      expect(json).toBeDefined();
    });
  }

  test('Security & Unauthorized Rejection: Reject requests missing Bearer Token', async ({ request }) => {
    const res = await request.get('/api/v2/customer', {
      headers: {
        'Accept': 'application/json',
      }
    });
    // Dev API returns 401 Unauthorized when token missing
    expect(res.status()).toBe(401);
  });
});
