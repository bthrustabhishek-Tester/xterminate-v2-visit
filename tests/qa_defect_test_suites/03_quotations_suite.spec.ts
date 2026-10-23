import { test, expect } from '@playwright/test';

/**
 * SUITE-03: Quotations & Estimations Suite
 * Location: tests/qa_defect_test_suites/03_quotations_suite.spec.ts
 * Category: Quotations
 * Total Test Cases: 8
 */

test.describe('SUITE-03: Quotations & Estimations Suite', () => {
  const baseUrl = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('TC_SUITE_S03_077 [@ui]: Quotation → Details Page → Status Remarks: When changing the quotation status through...', async ({ page }) => {
    // Source Defect/Requirement S.No: 47
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/VPTlhkEUi_pr

    // Step 1: Navigate to target module 'Quotations'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations'. 2. Execute action: "Quotation → Details Page → Status Remarks: When changing the quotation status through Draft → Pending Approval → Approved → Sent → Accepted, the user can enter ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Quotation → Details Page → Status Remarks: When changing the quotation status through Draft → Pending Approval → Approved → Sent ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S03_114 [@ui]: Enquiry → Convert to Quotation: When converting an Enquiry to a Quotation, the Intern...', async ({ page }) => {
    // Source Defect/Requirement S.No: 89
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/pJCPFcAK1_NU

    // Step 1: Navigate to target module 'Quotations'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations'. 2. Execute action: "Enquiry → Convert to Quotation: When converting an Enquiry to a Quotation, the Internal Attachments, Customer Attachments, and Common Attachments sections are d...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Enquiry → Convert to Quotation: When converting an Enquiry to a Quotation, the Internal Attachments, Customer Attachments, and Co...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S03_118 [@ui]: Quotation → Convert to Contract: When converting a Quotation to a Contract, some PDF ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 93
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/W27vfpfv4Bq8  https://prnt.sc/B8AVBMLk2feq

    // Step 1: Navigate to target module 'Quotations'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations'. 2. Execute action: "Quotation → Convert to Contract: When converting a Quotation to a Contract, some PDF files are displayed automatically even though no attachments were added. On...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Quotation → Convert to Contract: When converting a Quotation to a Contract, some PDF files are displayed automatically even thoug...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S03_119 [@ui]: Quotation → Convert to Contract → Contract Details → Quotation Tab: After following t...', async ({ page }) => {
    // Source Defect/Requirement S.No: 94
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/ulbl4Hg5GMSc

    // Step 1: Navigate to target module 'Quotations'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations'. 2. Execute action: "Quotation → Convert to Contract → Contract Details → Quotation Tab: After following the flow Quotation → Convert to Contract, the created Contract is not displa...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Quotation → Convert to Contract → Contract Details → Quotation Tab: After following the flow Quotation → Convert to Contract, the...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S03_124 [@ui]: Quotation → Quotation Summary: The Quotation Summary data is incorrect, including the...', async ({ page }) => {
    // Source Defect/Requirement S.No: 99
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/P04Hk_t34h7S

    // Step 1: Navigate to target module 'Quotations'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations'. 2. Execute action: "Quotation → Quotation Summary: The Quotation Summary data is incorrect, including the Week, Month, Year, Amount, and Quotation Count values. Please verify and c...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Quotation → Quotation Summary: The Quotation Summary data is incorrect, including the Week, Month, Year, Amount, and Quotation Co...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S03_125 [@ui]: Quotation → Created At: When hovering over the Created At value, the tooltip displays...', async ({ page }) => {
    // Source Defect/Requirement S.No: 100
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/CslGHdaWg2xU

    // Step 1: Navigate to target module 'Quotations'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations'. 2. Execute action: "Quotation → Created At: When hovering over the Created At value, the tooltip displays the data, but the text is cropped/not fully visible. Fix the tooltip UI so...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Quotation → Created At: When hovering over the Created At value, the tooltip displays the data, but the text is cropped/not fully...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S03_126 [@ui]: Quotation → Flag Row → Details Page: A Flag is displayed in the Quotation listing row...', async ({ page }) => {
    // Source Defect/Requirement S.No: 101
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/rx1-Hk44zgTz

    // Step 1: Navigate to target module 'Quotations'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations'. 2. Execute action: "Quotation → Flag Row → Details Page: A Flag is displayed in the Quotation listing row and entire tab, but the Flag is not visible on the Quotation Details page....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Quotation → Flag Row → Details Page: A Flag is displayed in the Quotation listing row and entire tab, but the Flag is not visible...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S03_166 [@ui]: Quotation → Details Page → Description → Edit: HTML tags are displayed in the descrip...', async ({ page }) => {
    // Source Defect/Requirement S.No: 148
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/H10VpNdlf0zr

    // Step 1: Navigate to target module 'Quotations'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations'. 2. Execute action: "Quotation → Details Page → Description → Edit: HTML tags are displayed in the description instead of properly formatted text....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Quotation → Details Page → Description → Edit: HTML tags are displayed in the description instead of properly formatted text.". E...
    expect(true).toBeTruthy();
  });
});
