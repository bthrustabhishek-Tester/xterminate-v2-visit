/**
 * Customer Test Data Fixtures
 * ===========================
 * Defines data structures and mock payloads for Customer (CRM) automation.
 */

export interface ContactPersonData {
  salutation?: string;
  firstName: string;
  lastName?: string;
  displayName?: string;
  email: string;
  phone: string;
  designation?: string;
  landline?: string;
  isPrimary?: boolean;
}

export interface CustomerLocationData {
  siteName: string;
  contactPerson?: string;
  postalCode: string;
  unitNo?: string;
  addressLine1: string;
  addressLine2?: string;
  zoneTerritory?: string;
}

export interface CustomerModel {
  customerType: 'individual' | 'company';
  salutation?: string;
  firstName?: string;
  lastName?: string;
  displayName: string;
  companyName?: string;
  email: string;
  phone: string;
  landline?: string;
  category?: string;
  paymentTerms?: string;
  accountManager?: string;
  customerReference?: string;
  otherReference?: string;
  website?: string;
  tags?: string[];
  remarks?: string;
  location?: CustomerLocationData;
  contactPersons?: ContactPersonData[];
}

const timestamp = Date.now().toString().slice(-4);

export const customerTestData: {
  validIndividual: CustomerModel;
  validCompany: CustomerModel;
  minimalCustomer: CustomerModel;
  invalidMissingRequired: Partial<CustomerModel>;
} = {
  validIndividual: {
    customerType: 'individual',
    salutation: 'Mr.',
    firstName: `Alex${timestamp}`,
    lastName: 'Tan',
    displayName: `Alex Tan QA-${timestamp}`,
    email: `alex.tan.${timestamp}@testqa.com`,
    phone: `9123${timestamp}`,
    landline: '61234567',
    category: 'Condominium',
    customerReference: `REF-CUST-${timestamp}`,
    otherReference: 'AUTO-GEN-01',
    website: 'https://testqa.com',
    remarks: 'Automated test individual customer created by Playwright.',
    location: {
      siteName: `Residence Block ${timestamp}`,
      postalCode: '560123',
      unitNo: '#12-34',
      addressLine1: '123 Orchard Boulevard',
      addressLine2: 'Tower A',
      zoneTerritory: 'Central'
    }
  },

  validCompany: {
    customerType: 'company',
    salutation: 'Mr.',
    firstName: `CorpAdmin${timestamp}`,
    lastName: 'Wong',
    displayName: `Apex Pest Solutions Pte Ltd ${timestamp}`,
    companyName: `Apex Pest Solutions Pte Ltd ${timestamp}`,
    email: `contact.apex.${timestamp}@testqa.com`,
    phone: `8123${timestamp}`,
    landline: '68765432',
    category: 'Hospitality',
    customerReference: `UEN-2024${timestamp}K`,
    otherReference: 'CORP-REF-99',
    website: 'https://apexsolutions.test',
    remarks: 'Automated test company customer created by Playwright.',
    location: {
      siteName: `HQ Office ${timestamp}`,
      postalCode: '018989',
      unitNo: '#08-01',
      addressLine1: '10 Marina Boulevard',
      addressLine2: 'Marina Bay Financial Centre',
      zoneTerritory: 'South'
    }
  },

  minimalCustomer: {
    customerType: 'individual',
    firstName: `Quick${timestamp}`,
    displayName: `Quick User ${timestamp}`,
    email: `quick.${timestamp}@testqa.com`,
    phone: `9988${timestamp}`
  },

  invalidMissingRequired: {
    customerType: 'individual',
    remarks: 'Incomplete customer missing all mandatory names and emails.'
  }
};
