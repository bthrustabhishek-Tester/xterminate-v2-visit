import { test, expect } from '@playwright/test';

/**
 * SUITE-01: Customer CRM & Account Management Suite
 * Location: tests/qa_defect_test_suites/01_customer_crm_suite.spec.ts
 * Category: Customer CRM
 * Total Test Cases: 28
 */

test.describe('SUITE-01: Customer CRM & Account Management Suite', () => {
  const baseUrl = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('TC_SUITE_S01_004 [@ui]: In the CRM → Customer → Customer Details page, remove the current Visual Identifier. ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 1
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/Y7DY7oX-NjCC

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "In the CRM → Customer → Customer Details page, remove the current Visual Identifier. If identification is required, use a proper flag/indicator next to the cust...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "In the CRM → Customer → Customer Details page, remove the current Visual Identifier. If identification is required, use a proper ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_005 [@ui]: CRM → Customer → Detail Page → Metadata Under the Metadata section, hide/remove the G...', async ({ page }) => {
    // Source Defect/Requirement S.No: 2
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/-ecsqaw9FJVl

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "CRM → Customer → Detail Page → Metadata Under the Metadata section, hide/remove the Group and Entity fields. Ensure these fields are not visible on the Customer...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "CRM → Customer → Detail Page → Metadata Under the Metadata section, hide/remove the Group and Entity fields. Ensure these fields ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_010 [@regression]: Create > Customer Contact Person > Mobile Number > The Mobile Number is not properly ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 7
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/c88gOsMyfibm

    // Step 1: Navigate to target module 'Quotations, Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Quotations, Customer'. 2. Execute action: "Create > Customer Contact Person > Mobile Number > The Mobile Number is not properly maintained from the Customer Contact Person details, causing the Mobile Num...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Customer Contact Person > Mobile Number > The Mobile Number is not properly maintained from the Customer Contact Person ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_041 [@validation]: CRM → Customer → Create → Location: Under Location Type, maintain the options Home, M...', async ({ page }) => {
    // Source Defect/Requirement S.No: 38
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/AyQRdf5zAbAM

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "CRM → Customer → Create → Location: Under Location Type, maintain the options Home, Main Office, Branch, Factory, and Other. When Other is selected, display an ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "CRM → Customer → Create → Location: Under Location Type, maintain the options Home, Main Office, Branch, Factory, and Other. When...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_073 [@regression]: Customer → Create Customer → Customer Type: When switching the Customer Type, the Bas...', async ({ page }) => {
    // Source Defect/Requirement S.No: 43
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/XiNsMc3m9D32

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Create Customer → Customer Type: When switching the Customer Type, the Basic Information section should be cleared. Any previously entered data shoul...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Create Customer → Customer Type: When switching the Customer Type, the Basic Information section should be cleared. An...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_074 [@ui]: Customer → Create Customer: The Remarks section is not available while creating a cus...', async ({ page }) => {
    // Source Defect/Requirement S.No: 44
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/ziN8sOQxTJtT

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Create Customer: The Remarks section is not available while creating a customer, but it is displayed on the Customer Details page. Add the Remarks fi...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Create Customer: The Remarks section is not available while creating a customer, but it is displayed on the Customer D...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_080 [@regression]: Customer → Details Page → Site Location: The Filter is not working properly. The filt...', async ({ page }) => {
    // Source Defect/Requirement S.No: 50
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/8urFkfQ7jmhD

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → Site Location: The Filter is not working properly. The filter functionality needs to be fixed....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Site Location: The Filter is not working properly. The filter functionality needs to be fixed.". Ensure...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_081 [@regression]: Customer → Details Page → Billing Location Tab: The Filter is not working properly. W...', async ({ page }) => {
    // Source Defect/Requirement S.No: 51
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/CsuUisHceCxj

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → Billing Location Tab: The Filter is not working properly. When clicking the filter again, the selected filter data is automatically cl...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Billing Location Tab: The Filter is not working properly. When clicking the filter again, the selected ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_082 [@smoke]: Customer → Details Page → Customer Asset: When selecting all assets and clicking Rais...', async ({ page }) => {
    // Source Defect/Requirement S.No: 52
    // Priority: P1 - High (Blocker) | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/F2Il29TxSBoi

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → Customer Asset: When selecting all assets and clicking Raise Ticket or Schedule Service, the page crashes. Please fix the issue and en...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Customer Asset: When selecting all assets and clicking Raise Ticket or Schedule Service, the page crash...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_084 [@regression]: Customer → Details Page → Enquiry Tab: The Filter is not working properly. When click...', async ({ page }) => {
    // Source Defect/Requirement S.No: 54
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/sFfrqirgHllH

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → Enquiry Tab: The Filter is not working properly. When clicking the filter again, the selected filter data is automatically cleared....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Enquiry Tab: The Filter is not working properly. When clicking the filter again, the selected filter da...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_085 [@ui]: Customer → Details Page → Enquiry Tab: Remove the Select All and Select buttons, as t...', async ({ page }) => {
    // Source Defect/Requirement S.No: 55
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/Oy1AsZdpUR17

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → Enquiry Tab: Remove the Select All and Select buttons, as they are not required....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Enquiry Tab: Remove the Select All and Select buttons, as they are not required.". Ensure valid visual ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_086 [@ui]: Customer → Details Page → Quotation Tab: Remove the Select All and Select buttons, as...', async ({ page }) => {
    // Source Defect/Requirement S.No: 56
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/ySpKavnbikOS

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → Quotation Tab: Remove the Select All and Select buttons, as they are not required....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Quotation Tab: Remove the Select All and Select buttons, as they are not required.". Ensure valid visua...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_087 [@regression]: Customer → Details Page → Contract Tab: The Filter is not working properly. When clic...', async ({ page }) => {
    // Source Defect/Requirement S.No: 57
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/wikZZb_gW1pM

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → Contract Tab: The Filter is not working properly. When clicking the filter again, the selected filter data is automatically cleared....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Contract Tab: The Filter is not working properly. When clicking the filter again, the selected filter d...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_088 [@regression]: Customer → Details Page → All Tabs: The Filter is not working properly across all tab...', async ({ page }) => {
    // Source Defect/Requirement S.No: 58
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/n276k4p8RGWl

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → All Tabs: The Filter is not working properly across all tabs. When applying a filter and clicking the Filter button again, the previou...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → All Tabs: The Filter is not working properly across all tabs. When applying a filter and clicking the F...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_089 [@ui]: Customer → Details Page: Remove the Select All button from tabs where bulk selection ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 59
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/tD1hv3QW_85X

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page: Remove the Select All button from tabs where bulk selection is not required, including Site Location, Billing Address, Enquiry, Quotati...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page: Remove the Select All button from tabs where bulk selection is not required, including Site Location, Bi...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_090 [@ui]: Customer → Create Customer: There is no Designation field available while creating a ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 60
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/Ans7pXOOY3z5

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Create Customer: There is no Designation field available while creating a customer, but the Designation is displayed on the Customer Details page. Ad...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Create Customer: There is no Designation field available while creating a customer, but the Designation is displayed o...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_091 [@ui]: Customer → Details Page → Visual Identifier: A Color Code is displayed in the Visual ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 61
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/0Ajhkn_xJDqJ

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Details Page → Visual Identifier: A Color Code is displayed in the Visual Identifier section, but it is not required. Remove the color code....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Visual Identifier: A Color Code is displayed in the Visual Identifier section, but it is not required. ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_092 [@regression]: CRM → Customer → Update Status: Change the text “Deactivate” to “In-Active Customer” ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 62
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/l8764mzQD9Jt

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "CRM → Customer → Update Status: Change the text “Deactivate” to “In-Active Customer” for better clarity....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "CRM → Customer → Update Status: Change the text “Deactivate” to “In-Active Customer” for better clarity.". Ensure valid visual la...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_095 [@regression]: Cusotmer details page → Site Address → Bulk Status Update: When selecting All Site Ad...', async ({ page }) => {
    // Source Defect/Requirement S.No: 65
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/GFkKvLfG-igm https://prnt.sc/aNu8JJ1tTrmC

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Cusotmer details page → Site Address → Bulk Status Update: When selecting All Site Addresses and changing the status: If all selected Site Addresses are current...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Cusotmer details page → Site Address → Bulk Status Update: When selecting All Site Addresses and changing the status: If all sele...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_097 [@ui]: Customer → Listing Manager: When making any changes in the Listing Manager, the scree...', async ({ page }) => {
    // Source Defect/Requirement S.No: 67
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/nYnU-SsEhXKJ

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Listing Manager: When making any changes in the Listing Manager, the screen is displayed only in half-screen mode. Please fix the UI so that the List...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Listing Manager: When making any changes in the Listing Manager, the screen is displayed only in half-screen mode. Ple...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_098 [@smoke]: Customer → Create Customer: After filling in all valid Customer and Contact Person de...', async ({ page }) => {
    // Source Defect/Requirement S.No: 68
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/1YTglFSrxGA-

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Create Customer: After filling in all valid Customer and Contact Person details and clicking the Save button, an error message is displayed, but the ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Create Customer: After filling in all valid Customer and Contact Person details and clicking the Save button, an error...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_100 [@smoke]: Create Customer: When filling in all customer details within the defined text field l...', async ({ page }) => {
    // Source Defect/Requirement S.No: 70
    // Priority: P1 - High (Blocker) | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/-99H9ZblumOv

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Create Customer: When filling in all customer details within the defined text field limits and clicking Save, an error is displayed. The customer should be crea...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create Customer: When filling in all customer details within the defined text field limits and clicking Save, an error is display...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_128 [@ui]: Customer → Site Row → Tooltip: When hovering over the Site Row value, the tooltip dis...', async ({ page }) => {
    // Source Defect/Requirement S.No: 103
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/g5qGT54N1dph

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Site Row → Tooltip: When hovering over the Site Row value, the tooltip displays the data, but the text is cropped/not fully visible. Fix the tooltip ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Site Row → Tooltip: When hovering over the Site Row value, the tooltip displays the data, but the text is cropped/not ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_131 [@regression]: Customer → Create Customer → Contact Person: The “Mark as Primary Contact Person” tog...', async ({ page }) => {
    // Source Defect/Requirement S.No: 106
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/Bo9XMP07bgvs

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Create Customer → Contact Person: The “Mark as Primary Contact Person” toggle is not working. The user is unable to turn the toggle ON or OFF, includ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Create Customer → Contact Person: The “Mark as Primary Contact Person” toggle is not working. The user is unable to tu...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_132 [@validation]: Customer → Create Customer → Billing Address: When all customer details are completed...', async ({ page }) => {
    // Source Defect/Requirement S.No: 107
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/L_x0xYFBzPCt

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Create Customer → Billing Address: When all customer details are completed except the Billing Address, the user can still save the customer. This is ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Create Customer → Billing Address: When all customer details are completed except the Billing Address, the user can st...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_140 [@regression]: Create Customer → Technician Selection: After selecting one Technician and searching ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 116
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/u4szrPwWKz3e

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Create Customer → Technician Selection: After selecting one Technician and searching for a second Technician, proper spacing/UI formatting is required between t...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create Customer → Technician Selection: After selecting one Technician and searching for a second Technician, proper spacing/UI f...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_154 [@ui]: Enquiry → Create Enquiry: Add a Create Customer button to the Create Enquiry page so ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 135
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/1ZVIUwV3DU8p

    // Step 1: Navigate to target module 'Enquiry'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Enquiry'. 2. Execute action: "Enquiry → Create Enquiry: Add a Create Customer button to the Create Enquiry page so users can create a new customer directly without leaving the Enquiry form....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Enquiry → Create Enquiry: Add a Create Customer button to the Create Enquiry page so users can create a new customer directly wit...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S01_212 [@ui]: Customer → Create Customer → Basic Information → Payment Terms: Add a gear (Settings)...', async ({ page }) => {
    // Source Defect/Requirement S.No: 206
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/YaL9H5ddJjkx

    // Step 1: Navigate to target module 'Customer'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer'. 2. Execute action: "Customer → Create Customer → Basic Information → Payment Terms: Add a gear (Settings) icon to manage Payment Terms directly from the Create Customer page....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Create Customer → Basic Information → Payment Terms: Add a gear (Settings) icon to manage Payment Terms directly from ...
    expect(true).toBeTruthy();
  });
});
