import { test, expect } from '@playwright/test';
import { DeterministicValidator } from '../helpers/deterministicValidator';

test.describe('Deterministic Data Validator (Exact Matching & Normalization)', () => {
  test('Currency normalization matches varying currency notations', () => {
    const res1 = DeterministicValidator.compareField('total_amount', '$150.00', '150');
    expect(res1.isMatch).toBeTruthy();

    const res2 = DeterministicValidator.compareField('subtotal', 'S$ 1250.500', '1250.5');
    expect(res2.isMatch).toBeTruthy();
  });

  test('Date normalization matches ISO and localized formats', () => {
    const res = DeterministicValidator.compareField('due_date', '2026-10-23', '23/10/2026');
    expect(res.isMatch).toBeTruthy();
  });

  test('Phone normalization strips whitespace and dashes', () => {
    const res = DeterministicValidator.compareField('phone', '+65 8123 4567', '+65-8123-4567');
    expect(res.isMatch).toBeTruthy();
  });

  test('Empty string, null, and hyphen representations are treated as equivalent', () => {
    expect(DeterministicValidator.compareField('remarks', null, '').isMatch).toBeTruthy();
    expect(DeterministicValidator.compareField('unit_no', '-', 'N/A').isMatch).toBeTruthy();
    expect(DeterministicValidator.compareField('notes', undefined, '').isMatch).toBeTruthy();
  });

  test('Mismatched values produce detailed discrepancy reports', () => {
    const systemCustomer = {
      name: 'Alpha Pest Control Pte Ltd',
      barcode: 'CUST-001',
      total_spent: '$5000.00',
      status: 'Active'
    };

    const exportCustomer = {
      'Customer Name': 'Alpha Pest Control Pte Ltd',
      'Customer Code': 'CUST-001',
      'Total Spent': '5000',
      'Status': 'Inactive' // Mismatch
    };

    const mapping = {
      name: 'Customer Name',
      barcode: 'Customer Code',
      total_spent: 'Total Spent',
      status: 'Status'
    };

    const result = DeterministicValidator.compareRecords('CUST-001', systemCustomer, exportCustomer, mapping);
    expect(result.isMatch).toBeFalsy();
    expect(result.matchedFields).toBe(3);
    expect(result.totalFields).toBe(4);
    expect(result.discrepancies.length).toBe(1);
    expect(result.discrepancies[0].field).toBe('status');
  });
});
