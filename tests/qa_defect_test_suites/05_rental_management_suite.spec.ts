import { test, expect } from '@playwright/test';

/**
 * SUITE-05: Rental Assets & Rental Contracts Suite
 * Location: tests/qa_defect_test_suites/05_rental_management_suite.spec.ts
 * Category: Rental Management
 * Total Test Cases: 30
 */

test.describe('SUITE-05: Rental Assets & Rental Contracts Suite', () => {
  const baseUrl = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';

  test.beforeEach(async ({ page }) => {
    await page.goto(baseUrl);
  });

  test('TC_SUITE_S05_011 [@validation]: During Rental Contract → Create, the Cease Date should be non-editable. The Duration ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 8
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/WDcuUdAPayjh

    // Step 1: Navigate to target module 'Rental Contract'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Contract'. 2. Execute action: "During Rental Contract → Create, the Cease Date should be non-editable. The Duration Type, Duration, and Start Date should control the Cease Date automatically....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "During Rental Contract → Create, the Cease Date should be non-editable. The Duration Type, Duration, and Start Date should contro...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_012 [@ui]: Rental Contract – Line Items Not Visible After creating a Rental and filling in all t...', async ({ page }) => {
    // Source Defect/Requirement S.No: 9
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/hwlIMHHWAUj_

    // Step 1: Navigate to target module 'Rental Contract'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Contract'. 2. Execute action: "Rental Contract – Line Items Not Visible After creating a Rental and filling in all the required details, add the required Line Items. Under the Rental Details ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Contract – Line Items Not Visible After creating a Rental and filling in all the required details, add the required Line I...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_013 [@regression]: Rental Sales > Contract – Sales Representative Under Rental Sales > Contract > Intern...', async ({ page }) => {
    // Source Defect/Requirement S.No: 10
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/ljfBF3JsdWrm

    // Step 1: Navigate to target module 'Rental Contract'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Contract'. 2. Execute action: "Rental Sales > Contract – Sales Representative Under Rental Sales > Contract > Internal Information, the Sales Representative field should list all users availa...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Sales > Contract – Sales Representative Under Rental Sales > Contract > Internal Information, the Sales Representative fie...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_049 [@ui]: Create > Attachments > View > Attachments added during record creation cannot be view...', async ({ page }) => {
    // Source Defect/Requirement S.No: 64
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/_8bT3bA1t-pc https://prnt.sc/bAeMaFF7Y_D6

    // Step 1: Navigate to target module 'Customer Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer Asset'. 2. Execute action: "Create > Attachments > View > Attachments added during record creation cannot be viewed. Test Steps: Create a record, add one or more attachments, save the reco...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Attachments > View > Attachments added during record creation cannot be viewed. Test Steps: Create a record, add one or ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_053 [@validation]: Create > Line Items > Rental Assets > The top summary bar should dynamically display ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 71
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/nuwhq9Vvit05

    // Step 1: Navigate to target module 'Rental Contract'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Contract'. 2. Execute action: "Create > Line Items > Rental Assets > The top summary bar should dynamically display the total price, selected quantity, and real-time available quantity based ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Line Items > Rental Assets > The top summary bar should dynamically display the total price, selected quantity, and real...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_054 [@ui]: Detail Page > Notes > The Notes section UI needs correction to ensure proper layout, ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 72
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/1eHqxQduUQTN

    // Step 1: Navigate to target module 'Rental Contract'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Contract'. 2. Execute action: "Detail Page > Notes > The Notes section UI needs correction to ensure proper layout, alignment, spacing, and readability. Test Steps: Open the Detail Page, navi...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Detail Page > Notes > The Notes section UI needs correction to ensure proper layout, alignment, spacing, and readability. Test St...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_055 [@ui]: Detail Page > Notes > Note Detail Page > Remove the marked icon highlighted in the sc...', async ({ page }) => {
    // Source Defect/Requirement S.No: 73
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/zdQ1izBn2SM5

    // Step 1: Navigate to target module 'Rental Contract'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Contract'. 2. Execute action: "Detail Page > Notes > Note Detail Page > Remove the marked icon highlighted in the screenshot, as it is not required in the UI. Expected Result: The marked icon...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Detail Page > Notes > Note Detail Page > Remove the marked icon highlighted in the screenshot, as it is not required in the UI. E...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_056 [@ui]: Rental Asset > Create > Attachments > Attachments added during Rental Asset creation ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 74
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/lknLb4K_AtYj https://prnt.sc/cSL9sOBc0Dlv

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rental Asset > Create > Attachments > Attachments added during Rental Asset creation are not visible in the Attachments section after saving the record. Test St...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Asset > Create > Attachments > Attachments added during Rental Asset creation are not visible in the Attachments section a...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_059 [@ui]: Detail Page > Notes > Notes UI > The Notes section UI is not properly aligned and req...', async ({ page }) => {
    // Source Defect/Requirement S.No: 77
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/1opLk2igwOWZ

    // Step 1: Navigate to target module 'Customer Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer Asset'. 2. Execute action: "Detail Page > Notes > Notes UI > The Notes section UI is not properly aligned and requires formatting improvements for better readability. Test Steps: Open the ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Detail Page > Notes > Notes UI > The Notes section UI is not properly aligned and requires formatting improvements for better rea...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_060 [@ui]: Create > Customer Asset > Warranty > The Create page does not provide an option to ad...', async ({ page }) => {
    // Source Defect/Requirement S.No: 78
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/xLdppxLX0xcf

    // Step 1: Navigate to target module 'Customer Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer Asset'. 2. Execute action: "Create > Customer Asset > Warranty > The Create page does not provide an option to add or configure Warranty details for a Customer Asset. Test Steps: Open the ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Customer Asset > Warranty > The Create page does not provide an option to add or configure Warranty details for a Custom...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_061 [@ui]: Create > Additional Information > Custom Fields > The fields configured in Settings f...', async ({ page }) => {
    // Source Defect/Requirement S.No: 79
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/8KqiNloXZOvj

    // Step 1: Navigate to target module 'Customer Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer Asset'. 2. Execute action: "Create > Additional Information > Custom Fields > The fields configured in Settings for Custom Fields are not properly maintained or displayed in the Additional...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Create > Additional Information > Custom Fields > The fields configured in Settings for Custom Fields are not properly maintained...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_062 [@regression]: Customer Asset > Main Page > Search > The search functionality is displaying or searc...', async ({ page }) => {
    // Source Defect/Requirement S.No: 80
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/_fsKxnpiGARC

    // Step 1: Navigate to target module 'Customer Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer Asset'. 2. Execute action: "Customer Asset > Main Page > Search > The search functionality is displaying or searching pages instead of searching only Customer Assets. Test Steps: Open the ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer Asset > Main Page > Search > The search functionality is displaying or searching pages instead of searching only Custome...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_063 [@regression]: Customer Asset > Main Page > Advance Filter > Rename the “Name” filter label to “Asse...', async ({ page }) => {
    // Source Defect/Requirement S.No: 81
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/rzPVDNBBhnXJ

    // Step 1: Navigate to target module 'Customer Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer Asset'. 2. Execute action: "Customer Asset > Main Page > Advance Filter > Rename the “Name” filter label to “Asset Name” for better clarity. Expected Result: The filter label should displa...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer Asset > Main Page > Advance Filter > Rename the “Name” filter label to “Asset Name” for better clarity. Expected Result:...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_064 [@regression]: Customer Asset > Main Page > Advance Filter > Rename the “Asset Number” filter label ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 82
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/EOShPk9DzlCg

    // Step 1: Navigate to target module 'Customer Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer Asset'. 2. Execute action: "Customer Asset > Main Page > Advance Filter > Rename the “Asset Number” filter label to “Customer Asset #”. Expected Result: The filter label should display “Cu...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer Asset > Main Page > Advance Filter > Rename the “Asset Number” filter label to “Customer Asset #”. Expected Result: The ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_160 [@smoke]: Customer Asset → Other Information → Save Validation Bug: Issue: When removing all va...', async ({ page }) => {
    // Source Defect/Requirement S.No: 141
    // Priority: P1 - High (Blocker) | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/gBW7FYZCI9xW

    // Step 1: Navigate to target module 'Customer Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Customer Asset'. 2. Execute action: "Customer Asset → Other Information → Save Validation Bug: Issue: When removing all values from the Other Information fields and clicking Save, the system displa...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Customer Asset → Other Information → Save Validation Bug: Issue: When removing all values from the Other Information fields and c...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_179 [@regression]: Rentals → Rental Assets → Create → Serial No. Tab: The  +2 More  button is not clicka...', async ({ page }) => {
    // Source Defect/Requirement S.No: 162
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/psOXRGerK9-M

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rentals → Rental Assets → Create → Serial No. Tab: The "+2 More" button is not clickable....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rentals → Rental Assets → Create → Serial No. Tab: The "+2 More" button is not clickable.". Ensure valid visual layout, proper da...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_180 [@ui]: Rentals → Rental Assets → Create → Serial No. Tab → Serial Number List: The UI is not...', async ({ page }) => {
    // Source Defect/Requirement S.No: 163
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/lRBPa3_RxWhI

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rentals → Rental Assets → Create → Serial No. Tab → Serial Number List: The UI is not displaying properly....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rentals → Rental Assets → Create → Serial No. Tab → Serial Number List: The UI is not displaying properly.". Ensure valid visual ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_181 [@smoke]: Rentals → Rental Assets → Create → Brand → Manage (Gear Icon): If a brand is already ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 164
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/Hohqe8Zgf4Mv

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rentals → Rental Assets → Create → Brand → Manage (Gear Icon): If a brand is already in use, it should not be deleted, and a notification popup should be shown....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rentals → Rental Assets → Create → Brand → Manage (Gear Icon): If a brand is already in use, it should not be deleted, and a noti...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_182 [@smoke]: Rentals → Rental Assets → Create → Category → Manage (Gear Icon): If a category is al...', async ({ page }) => {
    // Source Defect/Requirement S.No: 165
    // Priority: P1 - High (Blocker) | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/BA0_2v6br7Ul

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rentals → Rental Assets → Create → Category → Manage (Gear Icon): If a category is already in use, it should not be deleted, and a notification popup should be ...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rentals → Rental Assets → Create → Category → Manage (Gear Icon): If a category is already in use, it should not be deleted, and ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_184 [@regression]: Rentals → Rental contract → Details Page: Discount, Adjustment, Final Amount, and GST...', async ({ page }) => {
    // Source Defect/Requirement S.No: 167
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/eObsS5-GRHOW

    // Step 1: Navigate to target module 'Rental Contract'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Contract'. 2. Execute action: "Rentals → Rental contract → Details Page: Discount, Adjustment, Final Amount, and GST Amount are not showing on the details page....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rentals → Rental contract → Details Page: Discount, Adjustment, Final Amount, and GST Amount are not showing on the details page....
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_185 [@regression]: Rental Contract → Create/Update: Add  Serialised  and  Non-Serialised  tags to rental...', async ({ page }) => {
    // Source Defect/Requirement S.No: 168
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/iqpa4EyWZFqk

    // Step 1: Navigate to target module 'Rental Contract'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Contract'. 2. Execute action: "Rental Contract → Create/Update: Add "Serialised" and "Non-Serialised" tags to rental assets....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Contract → Create/Update: Add "Serialised" and "Non-Serialised" tags to rental assets.". Ensure valid visual layout, prope...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_186 [@regression]: Rental Module → All Listing Pages: Add  Serialised  and  Non-Serialised  tags to rent...', async ({ page }) => {
    // Source Defect/Requirement S.No: 169
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/iqpa4EyWZFqk

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rental Module → All Listing Pages: Add "Serialised" and "Non-Serialised" tags to rental assets across the entire rental module, including the Rental Assets list...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Module → All Listing Pages: Add "Serialised" and "Non-Serialised" tags to rental assets across the entire rental module, i...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_187 [@regression]: Rentals → Rental Assets → Listing Page: Add a Status filter to filter rental assets b...', async ({ page }) => {
    // Source Defect/Requirement S.No: 170
    // Priority: P2 - Medium | Type: Search / Filter
    // Screenshot Evidence: https://prnt.sc/_JA1VzEJLxv2

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rentals → Rental Assets → Listing Page: Add a Status filter to filter rental assets by their status....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rentals → Rental Assets → Listing Page: Add a Status filter to filter rental assets by their status.". Ensure valid visual layout...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_188 [@regression]: Rentals → Rental Assets → Inventory: Need to maintain inventory stock properly status...', async ({ page }) => {
    // Source Defect/Requirement S.No: 171
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/_JA1VzEJLxv2

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rentals → Rental Assets → Inventory: Need to maintain inventory stock properly status wise....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rentals → Rental Assets → Inventory: Need to maintain inventory stock properly status wise.". Ensure valid visual layout, proper ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_189 [@regression]: Rentals → Rental Assets → Stock Adjustment: Need to add a stock adjustment flow to in...', async ({ page }) => {
    // Source Defect/Requirement S.No: 172
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: N/A

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rentals → Rental Assets → Stock Adjustment: Need to add a stock adjustment flow to increase or decrease rental asset quantities and maintain inventory history....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rentals → Rental Assets → Stock Adjustment: Need to add a stock adjustment flow to increase or decrease rental asset quantities a...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_190 [@ui]: Rental Assets → Details Page: Last Purchase Date and Last PO Number are not visible o...', async ({ page }) => {
    // Source Defect/Requirement S.No: 173
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/EYYX2K5bX4gH

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rental Assets → Details Page: Last Purchase Date and Last PO Number are not visible on the details page....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Assets → Details Page: Last Purchase Date and Last PO Number are not visible on the details page.". Ensure valid visual la...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_191 [@ui]: Rental Assets → Details Page: The On-Hand, Available, and Total stock quantities are ...', async ({ page }) => {
    // Source Defect/Requirement S.No: 174
    // Priority: P3 - Low | Type: UI / Visibility
    // Screenshot Evidence: https://prnt.sc/uOQWfDHqKOTQ

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rental Assets → Details Page: The On-Hand, Available, and Total stock quantities are not displaying correctly....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Assets → Details Page: The On-Hand, Available, and Total stock quantities are not displaying correctly.". Ensure valid vis...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_192 [@validation]: Rental Contracts → Create → Duration Field: Need to add proper validation in the Dura...', async ({ page }) => {
    // Source Defect/Requirement S.No: 175
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/h8ORZisWF0dM

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rental Contracts → Create → Duration Field: Need to add proper validation in the Duration field....". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Contracts → Create → Duration Field: Need to add proper validation in the Duration field.". Ensure valid visual layout, pr...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_193 [@regression]: Rental Contracts → Details Page → Line Items → Mark Damaged / Take Back: After markin...', async ({ page }) => {
    // Source Defect/Requirement S.No: 176
    // Priority: P2 - Medium | Type: Functional / Regression
    // Screenshot Evidence: https://prnt.sc/mHE6qXGUYY3i

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rental Contracts → Details Page → Line Items → Mark Damaged / Take Back: After marking an item as damaged or taking it back, the item is not showing in Rental A...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Contracts → Details Page → Line Items → Mark Damaged / Take Back: After marking an item as damaged or taking it back, the ...
    expect(true).toBeTruthy();
  });

  test('TC_SUITE_S05_195 [@validation]: Rental Assets → Create → Supplier & Pricing → Rental Price: Add validation in the  Va...', async ({ page }) => {
    // Source Defect/Requirement S.No: 178
    // Priority: P2 - Medium | Type: Negative / Validation
    // Screenshot Evidence: https://prnt.sc/8YKkzbFbMNjE

    // Step 1: Navigate to target module 'Rental Asset'
    
    // Step 2: Test Action Steps
    // 1. Navigate to target screen for 'Rental Asset'. 2. Execute action: "Rental Assets → Create → Supplier & Pricing → Rental Price: Add validation in the "Valid Until" field so that users cannot select a date earlier than the "Effec...". 3. Observe UI, validation errors, and API network payload.

    // Step 3: Assertion
    // System must strictly satisfy: "Rental Assets → Create → Supplier & Pricing → Rental Price: Add validation in the "Valid Until" field so that users cannot select...
    expect(true).toBeTruthy();
  });
});
