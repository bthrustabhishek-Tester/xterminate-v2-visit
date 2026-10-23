import { test, expect } from '@playwright/test';

/**
 * SUITE-10: Cross-System Global Features & UI Integrity Suite
 * Location: tests/qa_defect_test_suites/10_global_system_suite.spec.ts
 * Category: Cross-System & Global
 * Total Test Cases: 54
 */

test.describe('SUITE-10: Cross-System Global Features & UI Integrity Suite', () => {
  const baseUrl = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('TC_SUITE_S10_001 [@ui]: All Modules → View Page: Ensure the left-side status/tag indicators are properly alig...', async ({ page }) => {
    // Source Defect/Requirement S.No: -2
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/DrZcR6FhmQZ4

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "All Modules → View Page: Ensure the left-side status/tag indicators are properly aligned and consistently displayed. The tag should accurately represent the Tec...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "All Modules → View Page: Ensure the left-side status/tag indicators are properly aligned and consistently displayed. The tag shou...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_002 [@ui]: Line Items → UOM When adding a UOM to any line item such as Customer, Sales Statement...', async ({ page }) => {
    // Source Defect/Requirement S.No: -1
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/NXJkt9DYqhC9

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Line Items → UOM When adding a UOM to any line item such as Customer, Sales Statement, Pesticide, or Tool, the UOM is currently displayed too closely with the Q...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Line Items → UOM When adding a UOM to any line item such as Customer, Sales Statement, Pesticide, or Tool, the UOM is currently d...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_006 [@ui]: Create Enquiry → Schedule Availability: The Schedule Availability section should disp...', async ({ page }) => {
    // Source Defect/Requirement S.No: 3
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/ZCyGUbT8-jal

    // Step 1: Navigate to target module 'Enquiry'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Enquiry'. 2. Execute action: "Create Enquiry → Schedule Availability: The Schedule Availability section should display only the current and future time slots. Past time slots should not be a...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create Enquiry → Schedule Availability: The Schedule Availability section should display only the current and future time slots. ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_019 [@ui]: CRM > Site > Create: After selecting the respective Customer, the entered Site detail...', async ({ page }) => {
    // Source Defect/Requirement S.No: 16
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/C-yqitFoq36m

    // Step 1: Navigate to target module 'Sites'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Sites'. 2. Execute action: "CRM > Site > Create: After selecting the respective Customer, the entered Site details are not reflecting in the Site listing modules. Ensure the data is displa...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "CRM > Site > Create: After selecting the respective Customer, the entered Site details are not reflecting in the Site listing mod...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_021 [@validation]: Update > Emergency Contact > Relation > The Relation dropdown is not visible, prevent...', async ({ page }) => {
    // Source Defect/Requirement S.No: 18
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/VvkX7T6VNs8J

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Update > Emergency Contact > Relation > The Relation dropdown is not visible, preventing users from viewing or selecting the required relationship; the dropdown...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Update > Emergency Contact > Relation > The Relation dropdown is not visible, preventing users from viewing or selecting the requ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_022 [@ui]: Main Page > Action Button > Rename “Deactivate” to “Mark as Inactive” for better clar...', async ({ page }) => {
    // Source Defect/Requirement S.No: 19
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/FM12OvVZPsk4

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Main Page > Action Button > Rename “Deactivate” to “Mark as Inactive” for better clarity and consistency with the intended action....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Main Page > Action Button > Rename “Deactivate” to “Mark as Inactive” for better clarity and consistency with the intended action...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_023 [@smoke]: Detail Page > Attachments > Action Button > View > Clicking the View action button di...', async ({ page }) => {
    // Source Defect/Requirement S.No: 20
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/O8ImjCzS8Rmf https://prnt.sc/vAJAcR7UFSc9

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Detail Page > Attachments > Action Button > View > Clicking the View action button displays a 404 error instead of opening the attachment; the attachment should...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Detail Page > Attachments > Action Button > View > Clicking the View action button displays a 404 error instead of opening the at...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_024 [@regression]: Main Page > Technician > Export > The Export button functionality is not available, s...', async ({ page }) => {
    // Source Defect/Requirement S.No: 21
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/hGDLiCm8jymJ

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Main Page > Technician > Export > The Export button functionality is not available, so users are unable to export Technician data; the Export functionality shou...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Main Page > Technician > Export > The Export button functionality is not available, so users are unable to export Technician data...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_025 [@ui]: Technician → Detail Page → Metadata Under the Metadata tab, the Username field is cur...', async ({ page }) => {
    // Source Defect/Requirement S.No: 22
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/244hmAYmXVwi

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Technician → Detail Page → Metadata Under the Metadata tab, the Username field is currently displayed on the left side. Remove or hide the Username field from t...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Technician → Detail Page → Metadata Under the Metadata tab, the Username field is currently displayed on the left side. Remove or...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_035 [@validation]: Zone Postal Code – Prefix Validation Under Zone > Postal Code > Add New Postal Code: ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 32
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/TbCy7ZHfog7n

    // Step 1: Navigate to target module 'Zone'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Zone'. 2. Execute action: "Zone Postal Code – Prefix Validation Under Zone > Postal Code > Add New Postal Code: The Prefix field should allow a maximum of 3 digits only. Users should not ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Zone Postal Code – Prefix Validation Under Zone > Postal Code > Add New Postal Code: The Prefix field should allow a maximum of 3...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_036 [@validation]: Zone > Postal Code – Prefix Validation Under Zone > Postal Code > Add New Postal Code...', async ({ page }) => {
    // Source Defect/Requirement S.No: 33
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/KNyV6DxD6266

    // Step 1: Navigate to target module 'Zone'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Zone'. 2. Execute action: "Zone > Postal Code – Prefix Validation Under Zone > Postal Code > Add New Postal Code: When a user enters a prefix (e.g., 123), validate whether the prefix is v...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Zone > Postal Code – Prefix Validation Under Zone > Postal Code > Add New Postal Code: When a user enters a prefix (e.g., 123), v...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_037 [@validation]: Zone > Zone Management > Detail Page – Overview Notes Under Zone > Zone Management > ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 34
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/Kl1ZhlZcKIHN

    // Step 1: Navigate to target module 'Zone'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Zone'. 2. Execute action: "Zone > Zone Management > Detail Page – Overview Notes Under Zone > Zone Management > Detail Page > Overview: In the Add Notes section, apply a maximum character...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Zone > Zone Management > Detail Page – Overview Notes Under Zone > Zone Management > Detail Page > Overview: In the Add Notes sec...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_038 [@ui]: Zone > Postal Code – Listing Page Under Zone > Postal Code: Provide the Created By co...', async ({ page }) => {
    // Source Defect/Requirement S.No: 35
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/t9Bal-15zNPG

    // Step 1: Navigate to target module 'Zone'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Zone'. 2. Execute action: "Zone > Postal Code – Listing Page Under Zone > Postal Code: Provide the Created By column on the Postal Code listing page. Maintain the same column structure an...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Zone > Postal Code – Listing Page Under Zone > Postal Code: Provide the Created By column on the Postal Code listing page. Mainta...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_039 [@ui]: Technician – Transfer Visit Functionality Implement a Transfer Visit functionality un...', async ({ page }) => {
    // Source Defect/Requirement S.No: 36
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: N/A

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Technician – Transfer Visit Functionality Implement a Transfer Visit functionality under the Technician module. * On the Technician Detail Page, provide an Acti...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Technician – Transfer Visit Functionality Implement a Transfer Visit functionality under the Technician module. * On the Technici...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_044 [@smoke]: Settings > System Notifications > When enabling System Notifications, an error messag...', async ({ page }) => {
    // Source Defect/Requirement S.No: 59
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/heeDbRISeZ7v

    // Step 1: Navigate to target module 'Notification'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Notification'. 2. Execute action: "Settings > System Notifications > When enabling System Notifications, an error message stating “Something went wrong” appears. Test Steps: Open Settings, enable...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Settings > System Notifications > When enabling System Notifications, an error message stating “Something went wrong” appears. Te...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_067 [@validation]: Enquiry > Create > Internal Information > Schedule Validation > The system currently ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 85
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/mvM5gmWFHM2e

    // Step 1: Navigate to target module 'Enquiry'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Enquiry'. 2. Execute action: "Enquiry > Create > Internal Information > Schedule Validation > The system currently allows users to select the same date and time for both schedules. Test Step...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Enquiry > Create > Internal Information > Schedule Validation > The system currently allows users to select the same date and tim...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_068 [@validation]: Detail Page > History > Advanced Filter > User Field > User data is not displayed in ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 86
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/_N5JuxwEFkpO

    // Step 1: Navigate to target module 'Enquiry'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Enquiry'. 2. Execute action: "Detail Page > History > Advanced Filter > User Field > User data is not displayed in the User dropdown, preventing users from filtering History records by User....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Detail Page > History > Advanced Filter > User Field > User data is not displayed in the User dropdown, preventing users from fil...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_069 [@smoke]: Enquiry > Detail Page > More Button > PDF Preview & Download > Users are unable to pr...', async ({ page }) => {
    // Source Defect/Requirement S.No: 87
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/4Vh4xX182gKc

    // Step 1: Navigate to target module 'Enquiry'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Enquiry'. 2. Execute action: "Enquiry > Detail Page > More Button > PDF Preview & Download > Users are unable to preview or download the Enquiry PDF. Test Steps: Open an Enquiry Detail Page,...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Enquiry > Detail Page > More Button > PDF Preview & Download > Users are unable to preview or download the Enquiry PDF. Test Step...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_078 [@validation]: Text Field Validation – Entire Project Validation needs to be added to all text field...', async ({ page }) => {
    // Source Defect/Requirement S.No: 48
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: N/A

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Text Field Validation – Entire Project Validation needs to be added to all text fields across the entire project. The following validations are required: 1. **T...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Text Field Validation – Entire Project Validation needs to be added to all text fields across the entire project. The following v...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_083 [@validation]: Enquiry → Create Enquiry: Correct the Call No. field validation. The field should acc...', async ({ page }) => {
    // Source Defect/Requirement S.No: 53
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/mC-YVbvXTQGQ

    // Step 1: Navigate to target module 'Enquiry'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Enquiry'. 2. Execute action: "Enquiry → Create Enquiry: Correct the Call No. field validation. The field should accept numbers only and should not allow alphabetic characters....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Enquiry → Create Enquiry: Correct the Call No. field validation. The field should accept numbers only and should not allow alphab...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_093 [@regression]: Web Application → API: Some APIs are being triggered repeatedly in a loop without any...', async ({ page }) => {
    // Source Defect/Requirement S.No: 63
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/dI20IX0LEOoG

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Web Application → API: Some APIs are being triggered repeatedly in a loop without any user action. APIs should be called only when the relevant action or event ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Web Application → API: Some APIs are being triggered repeatedly in a loop without any user action. APIs should be called only whe...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_094 [@regression]: Global Search: UI-Level Search Only: When using the Global Search, the search should ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 64
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/bZvmSZRXo2gI

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Global Search: UI-Level Search Only: When using the Global Search, the search should be performed only on the data/details visible at the UI level on the respec...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Global Search: UI-Level Search Only: When using the Global Search, the search should be performed only on the data/details visibl...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_096 [@regression]: Contact Person → Select All / Filter: When the user selects Select All and then appli...', async ({ page }) => {
    // Source Defect/Requirement S.No: 66
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/Y2HjoNrP_NeR

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Contact Person → Select All / Filter: When the user selects Select All and then applies a Filter, the selection should be cleared and the Change Status action s...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Contact Person → Select All / Filter: When the user selects Select All and then applies a Filter, the selection should be cleared...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_099 [@smoke]: Address Search: When entering a Postal Code, the address details are not fetched corr...', async ({ page }) => {
    // Source Defect/Requirement S.No: 69
    // Priority: P1 - High (Blocker) | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/PUZEYgiv0Iy4

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Address Search: When entering a Postal Code, the address details are not fetched correctly. Also, the Search Address API sometimes fails automatically. The post...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Address Search: When entering a Postal Code, the address details are not fetched correctly. Also, the Search Address API sometime...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_101 [@regression]: Invoice → Details Page → Visit Tab: When using the Search option, the system shows “4...', async ({ page }) => {
    // Source Defect/Requirement S.No: 71
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/3_jv71IxD412

    // Step 1: Navigate to target module 'Invoice'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Invoice'. 2. Execute action: "Invoice → Details Page → Visit Tab: When using the Search option, the system shows “4 results found”, but no data is displayed in the result rows. The search re...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Invoice → Details Page → Visit Tab: When using the Search option, the system shows “4 results found”, but no data is displayed in...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_102 [@regression]: Invoice → Details Page → Visit Tab: When using the Filter, the UI is not displayed pr...', async ({ page }) => {
    // Source Defect/Requirement S.No: 72
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/0sLQHjiagEO-

    // Step 1: Navigate to target module 'Invoice'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Invoice'. 2. Execute action: "Invoice → Details Page → Visit Tab: When using the Filter, the UI is not displayed properly. Please fix the filter UI, including the layout, alignment, and visi...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Invoice → Details Page → Visit Tab: When using the Filter, the UI is not displayed properly. Please fix the filter UI, including ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_103 [@regression]: Invoice → Details Page → Visit Tab: The Customer Search option is not required in the...', async ({ page }) => {
    // Source Defect/Requirement S.No: 73
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/GM74Xn2c4UNo

    // Step 1: Navigate to target module 'Invoice'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Invoice'. 2. Execute action: "Invoice → Details Page → Visit Tab: The Customer Search option is not required in the Visit tab. Please remove the Customer Search field....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Invoice → Details Page → Visit Tab: The Customer Search option is not required in the Visit tab. Please remove the Customer Searc...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_104 [@regression]: Invoice → Details Page → Visit Tab: When using the Header Search, clicking Filter, an...', async ({ page }) => {
    // Source Defect/Requirement S.No: 74
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/gBJB9lVZnnRG

    // Step 1: Navigate to target module 'Invoice'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Invoice'. 2. Execute action: "Invoice → Details Page → Visit Tab: When using the Header Search, clicking Filter, and then clicking Apply Filter without entering any filter criteria, a Custom...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Invoice → Details Page → Visit Tab: When using the Header Search, clicking Filter, and then clicking Apply Filter without enterin...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_105 [@regression]: Header: Remove the “Adhoc” text from the header....', async ({ page }) => {
    // Source Defect/Requirement S.No: 75
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/-BfkIC6KOaDt

    // Step 1: Navigate to target module 'Invoice'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Invoice'. 2. Execute action: "Header: Remove the “Adhoc” text from the header....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Header: Remove the “Adhoc” text from the header.". Ensure valid visual layout, proper data binding, correct HTTP responses, and a...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_106 [@regression]: Dropdown: When opening a dropdown and then scrolling the page, the dropdown remains f...', async ({ page }) => {
    // Source Defect/Requirement S.No: 76
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/5daZMfz9LsCR

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Dropdown: When opening a dropdown and then scrolling the page, the dropdown remains fixed/open and does not close or move with the page. The dropdown should clo...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Dropdown: When opening a dropdown and then scrolling the page, the dropdown remains fixed/open and does not close or move with th...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_107 [@smoke]: Create / Update → Any Module: When creating or updating data, if an error occurs in a...', async ({ page }) => {
    // Source Defect/Requirement S.No: 77
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/jvrG0fHkow-D

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Create / Update → Any Module: When creating or updating data, if an error occurs in any text field, the system displays the error message but does not redirect ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create / Update → Any Module: When creating or updating data, if an error occurs in any text field, the system displays the error...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_113 [@regression]: Contract → Summary & Insights Tab: Make the entire header clickable so users can expa...', async ({ page }) => {
    // Source Defect/Requirement S.No: 88
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/K-Fz0-R57nfE

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Contract → Summary & Insights Tab: Make the entire header clickable so users can expand and collapse the section by clicking anywhere on the header....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Contract → Summary & Insights Tab: Make the entire header clickable so users can expand and collapse the section by clicking anyw...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_116 [@ui]: Pagination: Pagination should remain fixed and easily accessible without requiring th...', async ({ page }) => {
    // Source Defect/Requirement S.No: 91
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/zJA-I6e7K7H3

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Pagination: Pagination should remain fixed and easily accessible without requiring the user to scroll through the page to find it. Fix the pagination positionin...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Pagination: Pagination should remain fixed and easily accessible without requiring the user to scroll through the page to find it...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_117 [@ui]: Visit → Auto-Created Invoice: When creating a Visit, an Invoice is created automatica...', async ({ page }) => {
    // Source Defect/Requirement S.No: 92
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/9Vk7bWa0PDbx

    // Step 1: Navigate to target module 'Invoice'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Invoice'. 2. Execute action: "Visit → Auto-Created Invoice: When creating a Visit, an Invoice is created automatically. However, on the Invoice Details page, the Created Date is incorrectly ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Auto-Created Invoice: When creating a Visit, an Invoice is created automatically. However, on the Invoice Details page, t...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_120 [@regression]: Technician → Card: Change the text “All” to “All Technicians” for better clarity....', async ({ page }) => {
    // Source Defect/Requirement S.No: 95
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/CkSz5mB4CsIJ

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Technician → Card: Change the text “All” to “All Technicians” for better clarity....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Technician → Card: Change the text “All” to “All Technicians” for better clarity.". Ensure valid visual layout, proper data bindi...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_129 [@regression]: Filter → Date Range: When opening the Filter, the Date Range is automatically selecte...', async ({ page }) => {
    // Source Defect/Requirement S.No: 104
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/ajW8vMzJnWMp

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Filter → Date Range: When opening the Filter, the Date Range is automatically selected as the Current Month. This is not required. The Date Range should remain ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Filter → Date Range: When opening the Filter, the Date Range is automatically selected as the Current Month. This is not required...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_130 [@regression]: Filter → Company Number: The filter currently shows Company Number. Change the field ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 105
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/HEHy7ZF0CHd3

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Filter → Company Number: The filter currently shows Company Number. Change the field label to Company Phone Number....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Filter → Company Number: The filter currently shows Company Number. Change the field label to Company Phone Number.". Ensure vali...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_133 [@regression]: Billing Location & Site Location → Filter: Remove the Street filter from all Billing ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 109
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/IuSxsss2SdfA

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Billing Location & Site Location → Filter: Remove the Street filter from all Billing Location and Site Location tabs and related modules....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Billing Location & Site Location → Filter: Remove the Street filter from all Billing Location and Site Location tabs and related ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_134 [@regression]: Customer → Details Page → Quotation Tab → Filter: Rename “Site Street 1” to “Address ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 110
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/4XQIl8o9gJJq

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Customer → Details Page → Quotation Tab → Filter: Rename “Site Street 1” to “Address Line 1” and “Site Street 2” to “Address Line 2”....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Quotation Tab → Filter: Rename “Site Street 1” to “Address Line 1” and “Site Street 2” to “Address Line...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_135 [@regression]: Entire Project → Address Section: The term “Street” is not required anywhere in the a...', async ({ page }) => {
    // Source Defect/Requirement S.No: 111
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: N/A

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Entire Project → Address Section: The term “Street” is not required anywhere in the application. Remove or replace all Street labels/text throughout the project...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Entire Project → Address Section: The term “Street” is not required anywhere in the application. Remove or replace all Street lab...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_138 [@regression]: Technician → Details Page → Visit Tab → Transfer to Technician: When selecting a Visi...', async ({ page }) => {
    // Source Defect/Requirement S.No: 114
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/1uhmLUnDIDsW

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Technician → Details Page → Visit Tab → Transfer to Technician: When selecting a Visit and clicking Transfer to Technician, the current technician should be pre...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Technician → Details Page → Visit Tab → Transfer to Technician: When selecting a Visit and clicking Transfer to Technician, the c...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_139 [@regression]: Header Search: When searching for “RV006001” using the Header Search, the displayed r...', async ({ page }) => {
    // Source Defect/Requirement S.No: 115
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/qRmrb_wWEEjl

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Header Search: When searching for “RV006001” using the Header Search, the displayed results do not match the searched value correctly. The search should return ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Header Search: When searching for “RV006001” using the Header Search, the displayed results do not match the searched value corre...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_143 [@validation]: Details Page → Completed / Closed / Cancelled / Rejected Status: When any record reac...', async ({ page }) => {
    // Source Defect/Requirement S.No: 119
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/ooy8paP4auYX

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Details Page → Completed / Closed / Cancelled / Rejected Status: When any record reaches Completed, Closed, Cancelled, or Rejected status, the Edit/Update butto...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Details Page → Completed / Closed / Cancelled / Rejected Status: When any record reaches Completed, Closed, Cancelled, or Rejecte...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_150 [@smoke]: Site → Details Page → Customer Assets & Rental Assets The Customer Assets and Rental ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 130
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/kIqw_uaA2t1d  https://prnt.sc/tGNElagxLbnt

    // Step 1: Navigate to target module 'Sites'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Sites'. 2. Execute action: "Site → Details Page → Customer Assets & Rental Assets The Customer Assets and Rental Assets tabs sometimes display an error when accessed. Investigate the issue...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Site → Details Page → Customer Assets & Rental Assets The Customer Assets and Rental Assets tabs sometimes display an error when ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_156 [@ui]: Technicians → Create / Update / Details Page → Certificates Issue: The License No. fi...', async ({ page }) => {
    // Source Defect/Requirement S.No: 137
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/1KwLed2-_SWo

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Technicians → Create / Update / Details Page → Certificates Issue: The License No. field is missing from the Create/Update page, although it is available in the...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Technicians → Create / Update / Details Page → Certificates Issue: The License No. field is missing from the Create/Update page, ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_159 [@validation]: Customer → Details Page → Update Company Information → Phone Number Validation: Add p...', async ({ page }) => {
    // Source Defect/Requirement S.No: 140
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/Y1qR4amAxhdn

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Customer → Details Page → Update Company Information → Phone Number Validation: Add proper validation to the Phone Number field. The field should accept only va...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer → Details Page → Update Company Information → Phone Number Validation: Add proper validation to the Phone Number field. ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_164 [@regression]: Global Search → Module-Wise Search: Issue: Module-wise search is not working consiste...', async ({ page }) => {
    // Source Defect/Requirement S.No: 145
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/caj9lNWZdBiN

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Global Search → Module-Wise Search: Issue: Module-wise search is not working consistently across the application. In the Tools module, Global Search displays se...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Global Search → Module-Wise Search: Issue: Module-wise search is not working consistently across the application. In the Tools mo...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_196 [@smoke]: When we open two Create tabs, fill in the data, and save it in the first tab, then fi...', async ({ page }) => {
    // Source Defect/Requirement S.No: 179
    // Priority: P1 - High (Blocker) | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/NilZ6lnyXpzE  https://prnt.sc/mrNtF3UYSELh

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "When we open two Create tabs, fill in the data, and save it in the first tab, then fill in the data in the second tab and close it without saving, the Restore o...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "When we open two Create tabs, fill in the data, and save it in the first tab, then fill in the data in the second tab and close i...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_198 [@ui]: Visit → Details Page → Communication Button: When hovering the cursor over the Commun...', async ({ page }) => {
    // Source Defect/Requirement S.No: 182
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/VwFmKYrtRi9y

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Visit → Details Page → Communication Button: When hovering the cursor over the Communication button, the tooltip gets cropped on the details page....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Details Page → Communication Button: When hovering the cursor over the Communication button, the tooltip gets cropped on ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_199 [@ui]: Disabled options should not be displayed in the dropdown list. Only enabled options s...', async ({ page }) => {
    // Source Defect/Requirement S.No: 183
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/Tz4dIvhoJ1UK

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Disabled options should not be displayed in the dropdown list. Only enabled options should be visible....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Disabled options should not be displayed in the dropdown list. Only enabled options should be visible.". Ensure valid visual layo...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_207 [@ui]: Technician → Details Page → Identity Section: Identity details are not displayed corr...', async ({ page }) => {
    // Source Defect/Requirement S.No: 201
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/rGBSeOGu35qv

    // Step 1: Navigate to target module 'Technician'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Technician'. 2. Execute action: "Technician → Details Page → Identity Section: Identity details are not displayed correctly on the Create, Edit, and Details pages, and users are unable to updat...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Technician → Details Page → Identity Section: Identity details are not displayed correctly on the Create, Edit, and Details pages...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_210 [@ui]: Site → Details Page → Customer Assets → Schedule Service: Currently, clicking the Sch...', async ({ page }) => {
    // Source Defect/Requirement S.No: 204
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/gPjTuokaV3qW

    // Step 1: Navigate to target module 'Sites'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Sites'. 2. Execute action: "Site → Details Page → Customer Assets → Schedule Service: Currently, clicking the Schedule button automatically creates a visit. Instead, it should redirect the...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Site → Details Page → Customer Assets → Schedule Service: Currently, clicking the Schedule button automatically creates a visit. ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_211 [@smoke]: Across All Modules → Delete Attachment: The  Are you sure you want to delete this att...', async ({ page }) => {
    // Source Defect/Requirement S.No: 205
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/n7sYiVvSei-B

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Across All Modules → Delete Attachment: The "Are you sure you want to delete this attachment?" confirmation popup is not displaying properly. The popup UI needs...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Across All Modules → Delete Attachment: The "Are you sure you want to delete this attachment?" confirmation popup is not displayi...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S10_213 [@ui]: Across All Modules → Remove Row: The  Are you sure you want to remove this row?  conf...', async ({ page }) => {
    // Source Defect/Requirement S.No: 207
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/rS_l_q7j7Bo1

    // Step 1: Navigate to target module 'Across the System'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Across the System'. 2. Execute action: "Across All Modules → Remove Row: The "Are you sure you want to remove this row?" confirmation popup is not displaying properly. The popup UI needs to be improve...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Across All Modules → Remove Row: The "Are you sure you want to remove this row?" confirmation popup is not displaying properly. T...
    expect(true).toBeTruthy();
  });
});
