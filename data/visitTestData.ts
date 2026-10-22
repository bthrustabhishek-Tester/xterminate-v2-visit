export interface VisitModel {
  customerSearchText?: string;
  customerIndex?: number;
  billingLocationCode?: string;
  reference: string;
  jobTypes: string[];
  tags: string[];
  priority: 'Low' | 'Medium' | 'High';
  quotationText?: string;
  contractText?: string;
  invoiceText?: string;
  enquiryText?: string;
  title: string;
  descriptionText?: string;
  switches?: {
    signatureRequired?: boolean;
    showLineItemsOnPdf?: boolean;
    serviceFormMandatory?: boolean;
    scheduleNow?: boolean;
  };
  lineItem?: {
    searchAsset: string;
    assetCode: string;
    uom: string;
    rate: string;
  };
  schedule?: {
    isRecurring: boolean;
    pattern?: 'Daily' | 'Weekly' | 'Monthly';
    startDate?: string;
    startTime?: string;
    duration?: string;
    isMultiDay?: boolean;
    holdEarliestDays?: string;
    holdLatestDays?: string;
  };
  technicians?: string[];
  internalNoteTemplate?: string;
  customerNoteTemplate?: string;
}

export const visitTestData = {
  create: {
    reference: 'REF-VISIT-QA-001',
    jobTypes: ['Installation', 'Service'],
    tags: ['Complaint', 'test'],
    priority: 'Low' as const,
    quotationText: 'ENGIE/NHB/GP/26-07/',
    contractText: 'Pre-Opening Pest Proofing',
    invoiceText: 'INV-V0001408',
    enquiryText: 'ENQ065',
    title: 'Scheduled Maintenance Job',
    lineItem: {
      searchAsset: 't',
      assetCode: 'CA273',
      uom: 'Box',
      rate: '50'
    },
    schedule: {
      isRecurring: false,
      startDate: '14',
      startTime: '08:00 AM',
      duration: '1 Hour',
      holdEarliestDays: '01',
      holdLatestDays: '10'
    },
    technicians: ['falcon Tim', 'Kumar Selvam'],
    internalNoteTemplate: 'Working At Height',
    customerNoteTemplate: 'Parts On Order'
  },
  update: {
    updatedTitle: 'Urgent - Cockroach sighting',
    updatedReference: 'REF-VISIT-QA-UPDATED',
    updatedStartTime: '09:00 AM'
  }
};

/**
 * Returns dynamic test data pre-populated with a valid customer ID, name,
 * and property/site barcode fetched from the Customer API provider.
 */
export function getDynamicVisitTestData(queryOrBarcode?: string): typeof visitTestData.create & { customerId: number; billingLocationCode: string } {
  try {
    // pyrefly: ignore[missing-import]
    const { CustomerProvider } = require('../helpers/customer_provider');
    const customer = queryOrBarcode
      ? CustomerProvider.search(queryOrBarcode)[0] || CustomerProvider.pickCustomerForVisit()
      : CustomerProvider.pickCustomerForVisit();

    const autofill = CustomerProvider.getVisitAutofillData(customer);
    return {
      ...visitTestData.create,
      reference: autofill.visitReference,
      title: autofill.visitTitle,
      customerId: autofill.customerId,
      customerSearchText: autofill.customerSearchText,
      billingLocationCode: autofill.billingLocationBarcode,
    };
  } catch {
    return {
      ...visitTestData.create,
      customerId: 36,
      customerSearchText: 'Daniel Wong',
      billingLocationCode: 'L121',
    };
  }
}
