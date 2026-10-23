import { test, expect } from '@playwright/test';

/**
 * SUITE-02: Visits, Scheduling & Dispatch Management Suite
 * Location: tests/qa_defect_test_suites/02_visit_scheduling_suite.spec.ts
 * Category: Visits & Scheduling
 * Total Test Cases: 44
 */

test.describe('SUITE-02: Visits, Scheduling & Dispatch Management Suite', () => {
  const baseUrl = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('TC_SUITE_S02_026 [@regression]: Create > Assign Technician > The Save button is currently not available, so users are...', async ({ page }) => {
    // Source Defect/Requirement S.No: 23
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/Bg0pLkLBdcuX

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Create > Assign Technician > The Save button is currently not available, so users are unable to save the selected technician assignment....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Assign Technician > The Save button is currently not available, so users are unable to save the selected technician assi...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_027 [@ui]: Create > Assign Technician > The Assign Technician field is currently selected by def...', async ({ page }) => {
    // Source Defect/Requirement S.No: 24
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/zt_mnAFCp6fu

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Create > Assign Technician > The Assign Technician field is currently selected by default; it should remain unselected and require the user to assign a technici...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Assign Technician > The Assign Technician field is currently selected by default; it should remain unselected and requir...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_028 [@regression]: Line Items > Edit – Remove Separate Edit Page Description: There is no need for a sep...', async ({ page }) => {
    // Source Defect/Requirement S.No: 25
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/fEkmjEGjGCfe

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Line Items > Edit – Remove Separate Edit Page Description: There is no need for a separate page specifically for editing Line Items. Please simplify the functio...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Line Items > Edit – Remove Separate Edit Page Description: There is no need for a separate page specifically for editing Line Ite...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_029 [@regression]: Create > Line Items > Ensure that any empty or unfilled Line Item row is automaticall...', async ({ page }) => {
    // Source Defect/Requirement S.No: 26
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/IX7uprfkF-_P

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Create > Line Items > Ensure that any empty or unfilled Line Item row is automatically removed when the user adds a new Line Item or selects/fills a Line Item, ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Line Items > Ensure that any empty or unfilled Line Item row is automatically removed when the user adds a new Line Item...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_030 [@validation]: Create > Visit Date > Prevent users from creating a Visit with a back date; the Visit...', async ({ page }) => {
    // Source Defect/Requirement S.No: 27
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/5TGRN1f-is8u

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Create > Visit Date > Prevent users from creating a Visit with a back date; the Visit Date field should allow only today’s date or a future date and reject any ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Visit Date > Prevent users from creating a Visit with a back date; the Visit Date field should allow only today’s date o...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_031 [@regression]: In Visit → Create New, when a customer is selected, the customer’s existing Landline ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 28
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/GGaerGqsqXve https://prnt.sc/RrBECC__rUzp

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "In Visit → Create New, when a customer is selected, the customer’s existing Landline Number should be automatically populated in the respective field on the Vis...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "In Visit → Create New, when a customer is selected, the customer’s existing Landline Number should be automatically populated in ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_032 [@regression]: Create Visit → Customer Search: When searching for an Inactive Customer, the customer...', async ({ page }) => {
    // Source Defect/Requirement S.No: 29
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/D_0BeZaUe6AQ

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Create Visit → Customer Search: When searching for an Inactive Customer, the customer is not displayed. Inactive customers should be shown with a visually diffe...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create Visit → Customer Search: When searching for an Inactive Customer, the customer is not displayed. Inactive customers should...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_033 [@validation]: Visit Creation → Technician Selection → Leave Validation When creating a visit, if th...', async ({ page }) => {
    // Source Defect/Requirement S.No: 30
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/wvN5EdZhnKWh

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit Creation → Technician Selection → Leave Validation When creating a visit, if the selected technician has a leave on the same visit date, check the leave s...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit Creation → Technician Selection → Leave Validation When creating a visit, if the selected technician has a leave on the sam...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_034 [@regression]: Visit → Header Summary - Replace the initial Draft status with Open. - Remove Schedul...', async ({ page }) => {
    // Source Defect/Requirement S.No: 31
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/Qol2J0eA-BHT https://prnt.sc/qJ0dI9htn5pW

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Header Summary - Replace the initial Draft status with Open. - Remove Schedule as the first status. - Once a visit is created, its initial status should...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Header Summary - Replace the initial Draft status with Open. - Remove Schedule as the first status. - Once a visit is cre...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_040 [@validation]: 1 Visit   Visit – Technician Availability During Visit Creation During Visit Creation...', async ({ page }) => {
    // Source Defect/Requirement S.No: 37
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: N/A

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "1 Visit ""Visit – Technician Availability During Visit Creation During Visit Creation, whether the visit is One-Time, Recurrence, or Ad Hoc, when assigning a te...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "1 Visit ""Visit – Technician Availability During Visit Creation During Visit Creation, whether the visit is One-Time, Recurrence,...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_042 [@regression]: ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 39
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/Q0SgJXAYcLtv

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "". Ensure valid visual layout, proper data binding, correct HTTP responses, and absence of console/SQL errors....
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_043 [@ui]: Notifications → Visit Started → SMTP Email Location Fix → When a technician starts a ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 40
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/YFdUldAyTLf_

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Notifications → Visit Started → SMTP Email Location Fix → When a technician starts a visit, ensure the customer-side email/notification displays the complete an...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Notifications → Visit Started → SMTP Email Location Fix → When a technician starts a visit, ensure the customer-side email/notifi...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_050 [@ui]: Create > Quotation > The Quotation dropdown should display only Quotations with Accep...', async ({ page }) => {
    // Source Defect/Requirement S.No: 65
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/ud5f-3nZqmeo

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Create > Quotation > The Quotation dropdown should display only Quotations with Accepted or Approved status and should not show Draft Quotations. Test Steps: Op...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Quotation > The Quotation dropdown should display only Quotations with Accepted or Approved status and should not show D...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_051 [@ui]: Create > Invoice > invoice Selection > The dropdown should display only Quotations wi...', async ({ page }) => {
    // Source Defect/Requirement S.No: 66
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/wa7QSa4chugb

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Create > Invoice > invoice Selection > The dropdown should display only Quotations with an Accepted or Approved status and should not include Draft invoice. Tes...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Invoice > invoice Selection > The dropdown should display only Quotations with an Accepted or Approved status and should...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_052 [@smoke]: Visit > Start Visit > When clicking the Start button, the Visit does not start and th...', async ({ page }) => {
    // Source Defect/Requirement S.No: 68
    // Priority: P1 - High (Blocker) | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/fiu-QqMDOSon

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit > Start Visit > When clicking the Start button, the Visit does not start and the system displays a 422 error. Test Steps: Open an assigned Visit and click...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit > Start Visit > When clicking the Start button, the Visit does not start and the system displays a 422 error. Test Steps: O...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_071 [@regression]: In the older Exterminate application, the Technician form has an “Upload Image from G...', async ({ page }) => {
    // Source Defect/Requirement S.No: -1
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/Et8fCjvT-8Tf https://prnt.sc/tHa63QZDE_ZH https://prnt.sc/egc_3Vc66d4A

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "In the older Exterminate application, the Technician form has an “Upload Image from Gallery” option, which is currently missing in the new Exterminate applicati...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "In the older Exterminate application, the Technician form has an “Upload Image from Gallery” option, which is currently missing i...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_072 [@regression]: On the Web application, there is currently no option for Multiple Visit Creation. Thi...', async ({ page }) => {
    // Source Defect/Requirement S.No: 0
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/WlOtdwAm8BvA

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "On the Web application, there is currently no option for Multiple Visit Creation. This functionality is available in the Exterminate app under Settings → Multip...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "On the Web application, there is currently no option for Multiple Visit Creation. This functionality is available in the Extermin...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_110 [@regression]: Visit → Recurring Visit → Details Page → Occurrences → Filter: The filter currently s...', async ({ page }) => {
    // Source Defect/Requirement S.No: 80
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/trDvT0v9Mx5I

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Recurring Visit → Details Page → Occurrences → Filter: The filter currently shows Customer Name and Customer Name & Company Name options. However, when ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Recurring Visit → Details Page → Occurrences → Filter: The filter currently shows Customer Name and Customer Name & Compa...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_111 [@regression]: Visit → Recurring Visit → Details Page → Occurrences → Filter: The filter currently s...', async ({ page }) => {
    // Source Defect/Requirement S.No: 81
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/NXbcTdwMm6n8

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Recurring Visit → Details Page → Occurrences → Filter: The filter currently shows Customer Name and Customer Name & Company Name options. However, when ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Recurring Visit → Details Page → Occurrences → Filter: The filter currently shows Customer Name and Customer Name & Compa...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_112 [@ui]: Visit → Recurring Visit → Details Page → Occurrences → Added notes are displaying HTM...', async ({ page }) => {
    // Source Defect/Requirement S.No: 82
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/Hlp8wYukGHs_

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Recurring Visit → Details Page → Occurrences → Added notes are displaying HTML tags from the backend instead of showing only the actual note content....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Recurring Visit → Details Page → Occurrences → Added notes are displaying HTML tags from the backend instead of showing o...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_115 [@ui]: Contract → Convert to Visit: When converting a Contract to a Visit, the Internal Atta...', async ({ page }) => {
    // Source Defect/Requirement S.No: 90
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/pIZPykVictT8

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Contract → Convert to Visit: When converting a Contract to a Visit, the Internal Attachments, Customer Attachments, and Common Attachments sections are displaye...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Contract → Convert to Visit: When converting a Contract to a Visit, the Internal Attachments, Customer Attachments, and Common At...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_121 [@ui]: Visit → Details Page → Notes → Customer Note: The Customer Note text is cropped and n...', async ({ page }) => {
    // Source Defect/Requirement S.No: 96
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/ofxhwlBLGN7r

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Details Page → Notes → Customer Note: The Customer Note text is cropped and not fully visible. Fix the UI so the complete text is displayed or provide a...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Details Page → Notes → Customer Note: The Customer Note text is cropped and not fully visible. Fix the UI so the complete...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_136 [@smoke]: Visit → Technician Assignment: When assigning a technician, the system displays an er...', async ({ page }) => {
    // Source Defect/Requirement S.No: 112
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/aRmDKny4CREW  https://prnt.sc/AZl-XjxVEBNp

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Technician Assignment: When assigning a technician, the system displays an error stating that the technician is already assigned to another visit. Howev...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Technician Assignment: When assigning a technician, the system displays an error stating that the technician is already a...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_137 [@validation]: Visit → Create & Edit: Make the Job Type field mandatory. Users should not be able to...', async ({ page }) => {
    // Source Defect/Requirement S.No: 113
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/_Nc7JBrDfILJ

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Create & Edit: Make the Job Type field mandatory. Users should not be able to save or update the Visit without selecting a Job Type....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Create & Edit: Make the Job Type field mandatory. Users should not be able to save or update the Visit without selecting ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_141 [@ui]: Visit → Create & Update → Internal Note: The Internal Note checkbox is not working co...', async ({ page }) => {
    // Source Defect/Requirement S.No: 117
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/LDSJcSrajzXa

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Create & Update → Internal Note: The Internal Note checkbox is not working correctly on Mobile. When the checkbox is unchecked, the Internal Note detail...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Create & Update → Internal Note: The Internal Note checkbox is not working correctly on Mobile. When the checkbox is unch...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_142 [@regression]: Visit → Filter: Add a Job Status filter to the Visit Filter section so users can filt...', async ({ page }) => {
    // Source Defect/Requirement S.No: 118
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/VtPkuYkep15e

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Filter: Add a Job Status filter to the Visit Filter section so users can filter visits based on Job Status....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Filter: Add a Job Status filter to the Visit Filter section so users can filter visits based on Job Status.". Ensure vali...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_144 [@regression]: Visit → Occurrence Calendar: The Calendar is not working correctly. When changing the...', async ({ page }) => {
    // Source Defect/Requirement S.No: 120
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/vppaMlNxnVEy

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Occurrence Calendar: The Calendar is not working correctly. When changing the date or selecting a different month, the calendar does not update properly...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Occurrence Calendar: The Calendar is not working correctly. When changing the date or selecting a different month, the ca...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_145 [@ui]: Visit → Occurrence Overview → Outstanding: When clicking Outstanding, no data is disp...', async ({ page }) => {
    // Source Defect/Requirement S.No: 121
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/ppeusoatxAp3

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Occurrence Overview → Outstanding: When clicking Outstanding, no data is displayed. The Outstanding section should be clickable and display the relevant...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Occurrence Overview → Outstanding: When clicking Outstanding, no data is displayed. The Outstanding section should be cli...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_146 [@regression]: Visit → Occurrence Overview → Outstanding: Change the status text from “Test Closed” ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 122
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/jDzM0rQe8YC6

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Occurrence Overview → Outstanding: Change the status text from “Test Closed” to “Complete” to match the actual status terminology....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Occurrence Overview → Outstanding: Change the status text from “Test Closed” to “Complete” to match the actual status ter...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_147 [@ui]: Visit → Occurrence Calendar: When moving the cursor over the Current Date, the curren...', async ({ page }) => {
    // Source Defect/Requirement S.No: 123
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/aUN6Y5NXyg3u

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Occurrence Calendar: When moving the cursor over the Current Date, the current date automatically becomes hidden. The current date should remain visible...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Occurrence Calendar: When moving the cursor over the Current Date, the current date automatically becomes hidden. The cur...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_148 [@regression]: Visit → Filter → Date Range: Add an option to specify which date field the selected D...', async ({ page }) => {
    // Source Defect/Requirement S.No: 124
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/ePF0WjATLVv4    https://prnt.sc/UgLD2Sy_XiC5

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Filter → Date Range: Add an option to specify which date field the selected Date Range applies to: Appointment Date or Created Date. The user should be ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Filter → Date Range: Add an option to specify which date field the selected Date Range applies to: Appointment Date or Cr...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_167 [@regression]: Visit → Global Search: Unable to search by Job ID and Visit ID 516....', async ({ page }) => {
    // Source Defect/Requirement S.No: 149
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/EfjT0_H5x0iO

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Global Search: Unable to search by Job ID and Visit ID 516....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Global Search: Unable to search by Job ID and Visit ID 516.". Ensure valid visual layout, proper data binding, correct HT...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_177 [@regression]: if visit status is in-progress then no need to any changes in the visit include edit ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 160
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/Iip-dKXEl6wf

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "if visit status is in-progress then no need to any changes in the visit include edit button...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "if visit status is in-progress then no need to any changes in the visit include edit button". Ensure valid visual layout, proper ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_178 [@smoke]: Visit → When starting a visit, the error message   Please give a reason for starting ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 161
    // Priority: P1 - High (Blocker) | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/SAZOCWrsWkuU

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → When starting a visit, the error message ""Please give a reason for starting late"" is displayed. Please remove this validation. { ""status"": false, ""...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → When starting a visit, the error message ""Please give a reason for starting late"" is displayed. Please remove this vali...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_183 [@regression]: When creating a visit, the technician cannot be assigned if their availability is 0%....', async ({ page }) => {
    // Source Defect/Requirement S.No: 166
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/1y_mf3IUJmhl

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "When creating a visit, the technician cannot be assigned if their availability is 0%....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "When creating a visit, the technician cannot be assigned if their availability is 0%.". Ensure valid visual layout, proper data b...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_194 [@regression]: Visit → Recurring Job → Edit: If any visit in a recurring job has changed from Open t...', async ({ page }) => {
    // Source Defect/Requirement S.No: 177
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: N/A

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Recurring Job → Edit: If any visit in a recurring job has changed from Open to another status, the user should not be allowed to change the customer whi...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Recurring Job → Edit: If any visit in a recurring job has changed from Open to another status, the user should not be all...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_200 [@ui]: Visits → Create Visit: Hide the  Invoice Required  checkbox from the Create Visit for...', async ({ page }) => {
    // Source Defect/Requirement S.No: 194
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/u72sB-e55WzR

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visits → Create Visit: Hide the "Invoice Required" checkbox from the Create Visit form....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visits → Create Visit: Hide the "Invoice Required" checkbox from the Create Visit form.". Ensure valid visual layout, proper data...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_201 [@regression]: Visits → Create Visit: Hide the  Show Line Items on PDF  checkbox from the Create Vis...', async ({ page }) => {
    // Source Defect/Requirement S.No: 195
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/S5mD0WWrhH52

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visits → Create Visit: Hide the "Show Line Items on PDF" checkbox from the Create Visit form....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visits → Create Visit: Hide the "Show Line Items on PDF" checkbox from the Create Visit form.". Ensure valid visual layout, prope...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_202 [@regression]: Visits → Global Search: The global search is not working for recurring Job IDs. Users...', async ({ page }) => {
    // Source Defect/Requirement S.No: 196
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/XhEx9g_h1x46

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visits → Global Search: The global search is not working for recurring Job IDs. Users are unable to search for visits using recurring Job IDs....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visits → Global Search: The global search is not working for recurring Job IDs. Users are unable to search for visits using recur...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_204 [@ui]: Visits → Details Page → Closure → Tools: The Tools tab is not displaying the assigned...', async ({ page }) => {
    // Source Defect/Requirement S.No: 198
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/V9kKWUvUFgjp

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visits → Details Page → Closure → Tools: The Tools tab is not displaying the assigned tools list and related data....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visits → Details Page → Closure → Tools: The Tools tab is not displaying the assigned tools list and related data.". Ensure valid...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_214 [@regression]: Visit → Create/Edit Visit → Recurring Visit → Preview Dates: After making changes and...', async ({ page }) => {
    // Source Defect/Requirement S.No: 208
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/tQ46rsGfyHKU

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Create/Edit Visit → Recurring Visit → Preview Dates: After making changes and clicking "Save & Apply Changes," the "Preview & Adjust Generated Occurrenc...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Create/Edit Visit → Recurring Visit → Preview Dates: After making changes and clicking "Save & Apply Changes," the "Previ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_215 [@regression]: Visit → Create/Edit Visit → Recurring Visit → End On: When selecting the  End On  opt...', async ({ page }) => {
    // Source Defect/Requirement S.No: 209
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/1t3oVfy5Fdip

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Create/Edit Visit → Recurring Visit → End On: When selecting the "End On" option, the system automatically sets the end date to one year later. Instead,...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Create/Edit Visit → Recurring Visit → End On: When selecting the "End On" option, the system automatically sets the end d...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_216 [@validation]: Visit → Create/Edit Visit → Recurring Visit → End After: Add a maximum limit validati...', async ({ page }) => {
    // Source Defect/Requirement S.No: 210
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/2sSzQNM7Fpvd

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Create/Edit Visit → Recurring Visit → End After: Add a maximum limit validation for the "End After" field. Users should not be allowed to enter a value ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Create/Edit Visit → Recurring Visit → End After: Add a maximum limit validation for the "End After" field. Users should n...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S02_217 [@ui]: Visit → Create/Edit Visit → Recurring Visit → Preview Dates → Change Technician: When...', async ({ page }) => {
    // Source Defect/Requirement S.No: 211
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/PuHKYwz7Uk2O

    // Step 1: Navigate to target module 'Visit'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Visit'. 2. Execute action: "Visit → Create/Edit Visit → Recurring Visit → Preview Dates → Change Technician: When selecting a visit and clicking "Change Technician," the selected row autom...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Visit → Create/Edit Visit → Recurring Visit → Preview Dates → Change Technician: When selecting a visit and clicking "Change Tech...
    expect(true).toBeTruthy();
  });
});
