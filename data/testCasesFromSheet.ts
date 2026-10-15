import * as fs from 'fs';
import * as path from 'path';

export interface TestCaseModel {
  testCaseId: string;
  module: string;
  taskDescription: string;
  preconditions: string;
  testSteps: string[];
  testData: Record<string, any>;
  expectedResults: string;
  sourceSNo: string;
  screenshots: string[];
}

export const generatedTestCases: TestCaseModel[] = [
  {
    testCaseId: 'TC-VISIT-001',
    sourceSNo: '-1',
    module: 'Visit Mobile/Closure',
    taskDescription: 'Technician Visit Closure Form Gallery Upload option',
    preconditions: 'Technician is logged in to mobile app and has an active In-Progress visit.',
    testSteps: [
      'Navigate to active visit closure form.',
      'Scroll to Attachments section.',
      'Tap on Upload Image action.',
      'Verify option "Upload Image from Gallery" is available and select an image.'
    ],
    testData: { visitStatus: 'In-Progress', attachmentType: 'Image' },
    expectedResults: 'Technician can select and upload images directly from the device gallery in the visit closure form.',
    screenshots: ['https://prnt.sc/Et8fCjvT-8Tf', 'https://prnt.sc/tHa63QZDE_ZH', 'https://prnt.sc/egc_3Vc66d4A']
  },
  {
    testCaseId: 'TC-VISIT-002',
    sourceSNo: '0',
    module: 'Visit Web/Settings',
    taskDescription: 'Multiple Visit Creation option parity between Web and Mobile app',
    preconditions: 'User is logged into Web application as Administrator.',
    testSteps: [
      'Open Settings menu on Web app.',
      'Check for "Multiple Visit Start" or batch visit creation option.',
      'Verify parity with mobile app settings.'
    ],
    testData: { settingPath: 'Settings -> Multiple Visit Start' },
    expectedResults: 'Multiple Visit creation functionality is available and operable on the Web application.',
    screenshots: ['https://prnt.sc/WlOtdwAm8BvA']
  },
  {
    testCaseId: 'TC-VISIT-003',
    sourceSNo: '80/81',
    module: 'Recurring Visit Details',
    taskDescription: 'Remove duplicate customer filter options in Recurring Visit Occurrences table',
    preconditions: 'A recurring visit with multiple occurrences is created.',
    testSteps: [
      'Open Visit -> Recurring Visit -> Details Page.',
      'Navigate to Occurrences section/tab.',
      'Click the Filter button.',
      'Inspect the Customer dropdown filter options.'
    ],
    testData: { visitType: 'Recurring' },
    expectedResults: 'Filter displays only relevant customer filter options matching the recurring visit, without redundant "Customer Name & Company Name" duplicates.',
    screenshots: ['https://prnt.sc/trDvT0v9Mx5I', 'https://prnt.sc/NXbcTdwMm6n8']
  },
  {
    testCaseId: 'TC-VISIT-004',
    sourceSNo: '82',
    module: 'Recurring Visit Details',
    taskDescription: 'Occurrences Added Notes should render clean text without HTML tags',
    preconditions: 'Recurring visit has added occurrences with formatted rich text notes.',
    testSteps: [
      'Open Recurring Visit Details -> Occurrences table.',
      'Inspect the Reason / Note column for occurrence rows.',
      'Verify the note formatting.'
    ],
    testData: { noteContent: '<p>Test Note</p>' },
    expectedResults: 'Occurrences display sanitized plain text note content without exposing raw HTML tags like <p>, <b>, etc.',
    screenshots: ['https://prnt.sc/Hlp8wYukGHs_']
  },
  {
    testCaseId: 'TC-VISIT-005',
    sourceSNo: '90',
    module: 'Contract to Visit',
    taskDescription: 'Hide unneeded attachment sections when converting Contract to Visit',
    preconditions: 'Active contract exists in the system.',
    testSteps: [
      'Navigate to Contract details page.',
      'Click Convert to Visit action.',
      'Check Create Visit form sections.'
    ],
    testData: { contractId: 37 },
    expectedResults: 'Internal, Customer, and Common attachment sections are not displayed unless explicitly enabled/required for the flow.',
    screenshots: ['https://prnt.sc/pIZPykVictT8']
  },
  {
    testCaseId: 'TC-VISIT-006',
    sourceSNo: '96',
    module: 'Visit Details Notes',
    taskDescription: 'Customer Note text display truncation and wrapping fix',
    preconditions: 'Visit exists with a multi-sentence Customer Note.',
    testSteps: [
      'Open Visit Details page.',
      'Navigate to Notes tab -> Customer Note card.',
      'Verify visibility of full text.'
    ],
    testData: { customerNote: 'Long customer note text to test wrapping behavior...' },
    expectedResults: 'Customer note text is fully visible with word-wrapping or a tooltip, without being cropped.',
    screenshots: ['https://prnt.sc/ofxhwlBLGN7r']
  },
  {
    testCaseId: 'TC-VISIT-007',
    sourceSNo: '112',
    module: 'Technician Assignment',
    taskDescription: 'Do not treat Cancelled Visits as technician scheduling conflicts',
    preconditions: 'Technician has a visit on the target date that has status "Cancelled".',
    testSteps: [
      'Open Create or Edit Visit form.',
      'Set visit date and time window to overlap with the cancelled visit.',
      'Assign the technician.',
      'Click Save.'
    ],
    testData: { technician: 'Kumar Selvam', conflictingStatus: 'Cancelled' },
    expectedResults: 'Technician can be assigned without conflict error; Cancelled visits are excluded from conflict checks.',
    screenshots: ['https://prnt.sc/aRmDKny4CREW', 'https://prnt.sc/AZl-XjxVEBNp']
  },
  {
    testCaseId: 'TC-VISIT-008',
    sourceSNo: '113',
    module: 'Visit Form Validation',
    taskDescription: 'Job Type must be a mandatory required field on Create & Edit',
    preconditions: 'User is on Create Visit or Edit Visit page.',
    testSteps: [
      'Fill customer and mandatory fields except Job Type.',
      'Leave Job Type blank.',
      'Click Save.'
    ],
    testData: { jobType: '' },
    expectedResults: 'Form blocks submission, displays validation error requiring Job Type, and prevents save.',
    screenshots: ['https://prnt.sc/_Nc7JBrDfILJ']
  },
  {
    testCaseId: 'TC-VISIT-009',
    sourceSNo: '117',
    module: 'Visit Notes Mobile',
    taskDescription: 'Internal Note Show on Mobile checkbox visibility toggle',
    preconditions: 'Visit created with internal note and "Show on Mobile" checkbox unchecked.',
    testSteps: [
      'Open Visit in Technician Mobile App.',
      'Check Notes / Internal Notes section.'
    ],
    testData: { showInternalNoteOnMobile: false },
    expectedResults: 'Internal Note details are completely hidden on the Mobile app when checkbox is unchecked.',
    screenshots: ['https://prnt.sc/LDSJcSrajzXa']
  },
  {
    testCaseId: 'TC-VISIT-010',
    sourceSNo: '118',
    module: 'Visit Filter',
    taskDescription: 'Add Job Status filter to Visit List filter panel',
    preconditions: 'User is on Visit list page (/admin/visit).',
    testSteps: [
      'Click Filter icon/button on Visit List.',
      'Look for Job Status filter dropdown.',
      'Filter by status (e.g. Open, In-Progress, Completed).'
    ],
    testData: { statusFilter: 'In-Progress' },
    expectedResults: 'Job Status filter is available and filters the visit table to only show matches.',
    screenshots: ['https://prnt.sc/VtPkuYkep15e']
  },
  {
    testCaseId: 'TC-VISIT-011',
    sourceSNo: '120',
    module: 'Occurrence Calendar',
    taskDescription: 'Fix Occurrence Calendar date and month navigation',
    preconditions: 'Recurring visit with calendar view open.',
    testSteps: [
      'Switch Occurrences view to Calendar View.',
      'Click Next Month (>), Previous Month (<).',
      'Select a different date cell.'
    ],
    testData: { targetMonth: 'Next' },
    expectedResults: 'Calendar updates immediately and displays occurrences for the selected month/date.',
    screenshots: ['https://prnt.sc/vppaMlNxnVEy']
  },
  {
    testCaseId: 'TC-VISIT-012',
    sourceSNo: '121',
    module: 'Occurrence Overview',
    taskDescription: 'Outstanding section clickability and data drilldown',
    preconditions: 'Recurring visit details page open with occurrence overview.',
    testSteps: [
      'Click on Outstanding section/metric card.',
      'Click on an individual row in the filtered list.'
    ],
    testData: { metric: 'Outstanding' },
    expectedResults: 'Outstanding card displays relevant records and clicking a row opens its details.',
    screenshots: ['https://prnt.sc/ppeusoatxAp3']
  },
  {
    testCaseId: 'TC-VISIT-013',
    sourceSNo: '122',
    module: 'Occurrence Overview Terminology',
    taskDescription: 'Change status terminology from "Test Closed" to "Complete"',
    preconditions: 'Occurrence overview displayed.',
    testSteps: [
      'Check status terminology labels on completed occurrences.'
    ],
    testData: { expectedTerm: 'Complete', forbiddenTerm: 'Test Closed' },
    expectedResults: 'Status text reads "Complete" instead of "Test Closed".',
    screenshots: ['https://prnt.sc/jDzM0rQe8YC6']
  },
  {
    testCaseId: 'TC-VISIT-014',
    sourceSNo: '123',
    module: 'Occurrence Calendar Hover',
    taskDescription: 'Current date cell visibility when hovering over it in calendar',
    preconditions: 'Calendar view of occurrences is open.',
    testSteps: [
      'Locate today/current date cell in calendar.',
      'Hover cursor over the cell.'
    ],
    testData: {},
    expectedResults: 'Current date remains fully visible with hover styling, without disappearing or becoming hidden.',
    screenshots: ['https://prnt.sc/aUN6Y5NXyg3u']
  },
  {
    testCaseId: 'TC-VISIT-015',
    sourceSNo: '124',
    module: 'Visit Filter Date Range',
    taskDescription: 'Specify whether Date Range applies to Appointment Date or Created Date',
    preconditions: 'Visit List filter panel opened.',
    testSteps: [
      'Open Date Range filter options.',
      'Select date field option: "Appointment Date" or "Created Date".',
      'Apply date range filter.'
    ],
    testData: { fieldType: 'Appointment Date', startDate: '2026-10-01', endDate: '2026-10-15' },
    expectedResults: 'System filters visits based on the user-selected date field type.',
    screenshots: ['https://prnt.sc/ePF0WjATLVv4', 'https://prnt.sc/UgLD2Sy_XiC5']
  },
  {
    testCaseId: 'TC-VISIT-016',
    sourceSNo: '149',
    module: 'Global Search',
    taskDescription: 'Search visits by Job ID and Visit ID (e.g. 516)',
    preconditions: 'Visit with ID 516 exists in the database.',
    testSteps: [
      'Click Global Search bar (Ctrl+K).',
      'Type "516" or "V516".',
      'Press Enter / check results.'
    ],
    testData: { searchQuery: '516' },
    expectedResults: 'Search results show the matching Visit record ID 516.',
    screenshots: ['https://prnt.sc/EfjT0_H5x0iO']
  },
  {
    testCaseId: 'TC-VISIT-017',
    sourceSNo: '160',
    module: 'Visit In-Progress State',
    taskDescription: 'Lock and hide Edit button when visit status is In-Progress',
    preconditions: 'Visit has status "In-Progress".',
    testSteps: [
      'Open details page for In-Progress visit.',
      'Check for Edit button or editable fields.'
    ],
    testData: { visitStatus: 'In-Progress' },
    expectedResults: 'Edit button is hidden or disabled; visit cannot be modified while in-progress.',
    screenshots: ['https://prnt.sc/Iip-dKXEl6wf']
  },
  {
    testCaseId: 'TC-VISIT-018',
    sourceSNo: '161',
    module: 'Start Visit Validation',
    taskDescription: 'Remove "Please give a reason for starting late" error when starting visit',
    preconditions: 'Technician opens a scheduled visit that has passed scheduled time.',
    testSteps: [
      'Click "Start Visit" button.',
      'Observe prompt or error response.'
    ],
    testData: {},
    expectedResults: 'Visit starts without blocking with "Please give a reason for starting late" 422 error.',
    screenshots: ['https://prnt.sc/SAZOCWrsWkuU']
  },
  {
    testCaseId: 'TC-VISIT-019',
    sourceSNo: '166',
    module: 'Technician Availability',
    taskDescription: 'Technician cannot be assigned if availability is 0%',
    preconditions: 'Technician has 0% availability for the scheduled time.',
    testSteps: [
      'Open Create Visit form.',
      'Set schedule timing.',
      'Attempt to select a technician showing 0% availability.',
      'Click Save.'
    ],
    testData: { availability: '0%' },
    expectedResults: 'System blocks assigning technician with 0% availability and displays validation message.',
    screenshots: ['https://prnt.sc/1y_mf3IUJmhl']
  },
  {
    testCaseId: 'TC-VISIT-020',
    sourceSNo: '177',
    module: 'Recurring Job Edit Customer',
    taskDescription: 'Do not allow changing customer if any occurrence changed from Open',
    preconditions: 'Recurring job has at least one occurrence that is In-Progress or Completed.',
    testSteps: [
      'Open Recurring Job in Edit mode.',
      'Attempt to change Customer selection.'
    ],
    testData: { occurrenceStatus: 'In-Progress' },
    expectedResults: 'Customer field is disabled/read-only; system prevents changing customer.',
    screenshots: []
  },
  {
    testCaseId: 'TC-VISIT-021',
    sourceSNo: '-2',
    module: 'Service Form Tab',
    taskDescription: 'Default service forms attached to new adhoc visit',
    preconditions: 'Create new adhoc visit and open Service Form tab.',
    testSteps: [
      'Open Service Form tab on new visit.',
      'Inspect pre-attached forms.'
    ],
    testData: { forms: ['Pest', 'Comprehensive Pest Management Survey'] },
    expectedResults: 'Both Pest and Comprehensive Pest Management Survey forms appear as expected defaults.',
    screenshots: ['https://prnt.sc/ZKaaNOQ62t83']
  },
  {
    testCaseId: 'TC-VISIT-022',
    sourceSNo: '-1 (Adhoc)',
    module: 'Service Form Engineer Signature',
    taskDescription: 'Hide "Engineer Sign Pending" if signature exists in Settings',
    preconditions: 'Logged in technician already uploaded signature in their Settings profile.',
    testSteps: [
      'Open Service Form -> Other Tab.',
      'Check Engineer Signature status.'
    ],
    testData: {},
    expectedResults: 'Status does not show "Engineer Sign Pending" if profile signature is pre-configured.',
    screenshots: ['https://prnt.sc/_paANGQbp2qy']
  },
  {
    testCaseId: 'TC-VISIT-023',
    sourceSNo: '17',
    module: 'Line Items Persistence',
    taskDescription: 'Pesticides and Service data must be visible and retained after saving line items',
    preconditions: 'Create Visit page open with line items section.',
    testSteps: [
      'Add Pesticide and Service line items.',
      'Save line items or visit.',
      'Reopen visit details.'
    ],
    testData: { itemType: 'Pesticides', name: 'Termiticide A' },
    expectedResults: 'Entered Pesticides and Service line items are properly maintained and visible after save.',
    screenshots: ['https://prnt.sc/0bAYYM4soDOM']
  },
  {
    testCaseId: 'TC-VISIT-024',
    sourceSNo: '18',
    module: 'Tools & Pesticides',
    taskDescription: 'Tools and Pesticides management functionality in Other section',
    preconditions: 'Visit details page open.',
    testSteps: [
      'Navigate to Other -> Tools & Pesticides.',
      'Add a tool or pesticide.',
      'Update quantity and save.'
    ],
    testData: { toolName: 'Sprayer Unit', pesticideName: 'Gel Bait' },
    expectedResults: 'Users can successfully add, update, and manage Tools and Pesticides without errors.',
    screenshots: ['https://prnt.sc/lIffcnVtqC_i']
  },
  {
    testCaseId: 'TC-VISIT-025',
    sourceSNo: '19',
    module: 'Tags & Client Note Visibility',
    taskDescription: 'Tags/Category and Client Note data persistence and display',
    preconditions: 'Visit form open.',
    testSteps: [
      'Enter Tags and fill Client Note.',
      'Save visit.',
      'Re-inspect details page.'
    ],
    testData: { tags: ['Complaint'], clientNote: 'Client note verification test' },
    expectedResults: 'Tags and Client Note data remain visible and properly formatted after saving.',
    screenshots: ['https://prnt.sc/47Avp5yze7xJ']
  },
  {
    testCaseId: 'TC-VISIT-026',
    sourceSNo: '20',
    module: 'Voice Note Attachment',
    taskDescription: 'Voice note attachment retention without auto-deletion after 2-3 seconds',
    preconditions: 'Visit closure form open on mobile/web.',
    testSteps: [
      'Navigate to Attachments -> Record Voice Note.',
      'Record 5 seconds of audio and save.',
      'Wait 5 seconds.'
    ],
    testData: { recordingDuration: 5 },
    expectedResults: 'Voice note remains saved and visible in Attachments until manually removed.',
    screenshots: ['https://prnt.sc/f7qg0z7NWtoc', 'https://prnt.sc/J6V5O33EOUAW']
  },
  {
    testCaseId: 'TC-VISIT-027',
    sourceSNo: '21',
    module: 'Company Stamp',
    taskDescription: 'Company Stamp status must update immediately upon adding stamp',
    preconditions: 'Visit details -> Others -> Company Stamp open.',
    testSteps: [
      'Upload / apply company stamp.',
      'Verify status indicator.'
    ],
    testData: { stampFile: 'stamp.png' },
    expectedResults: 'Company stamp status updates to active/stamped immediately.',
    screenshots: ['https://prnt.sc/HhP8D_9rEBQl']
  },
  {
    testCaseId: 'TC-VISIT-028',
    sourceSNo: '22',
    module: 'Safety Feature',
    taskDescription: 'Visit starts successfully when Safety Feature is enabled without HTTP error',
    preconditions: 'Safety feature enabled in visit settings.',
    testSteps: [
      'Start visit from technician app/web.',
      'Verify start confirmation.'
    ],
    testData: { safetyFeatureEnabled: true },
    expectedResults: 'Visit starts without HTTP errors.',
    screenshots: ['https://prnt.sc/Ao-u9x800Xdj']
  },
  {
    testCaseId: 'TC-VISIT-029',
    sourceSNo: '23',
    module: 'Device Camera/Photo Attachment',
    taskDescription: 'Captured camera photo displays in Attachments section',
    preconditions: 'Visit is In-Progress.',
    testSteps: [
      'Open Attachments -> Capture Photo from camera or upload.',
      'Submit photo.'
    ],
    testData: { captureType: 'Camera' },
    expectedResults: 'Captured photo is displayed immediately in the Attachments gallery.',
    screenshots: ['https://prnt.sc/FrS-0E6gBQ1K']
  },
  {
    testCaseId: 'TC-VISIT-030',
    sourceSNo: '24',
    module: 'Service Form PDF View',
    taskDescription: 'Clicking View Service Form PDF opens document without 403 Forbidden error',
    preconditions: 'Completed visit with generated service form.',
    testSteps: [
      'Open Service Form tab on Visit Details.',
      'Click View PDF option.'
    ],
    testData: {},
    expectedResults: 'Service Form PDF opens successfully in a new tab without 403 Forbidden error.',
    screenshots: ['https://prnt.sc/Gk1zHjsi9uME']
  },
  {
    testCaseId: 'TC-VISIT-031',
    sourceSNo: '25',
    module: 'App Drawer Section Accordion',
    taskDescription: 'Accordion behavior: Only Ad Hoc or Recurrence expanded at one time',
    preconditions: 'Technician logged into Mobile app drawer.',
    testSteps: [
      'Open drawer -> Expand Ad Hoc section.',
      'Expand Recurrence section.'
    ],
    testData: {},
    expectedResults: 'Ad Hoc automatically collapses when Recurrence is opened; only one section remains expanded.',
    screenshots: ['https://prnt.sc/EoR0f8Al1uyA']
  },
  {
    testCaseId: 'TC-VISIT-032',
    sourceSNo: '26',
    module: 'Teams Tab Technician Info',
    taskDescription: 'Display technician profile picture and full name; hide obsolete TL section',
    preconditions: 'Visit assigned to technician.',
    testSteps: [
      'Open Visit -> Teams tab.',
      'Verify technician avatar, name, and role sections.'
    ],
    testData: { fullName: 'Firstname Lastname' },
    expectedResults: 'Displays avatar, full name (First + Last), and removes/hides TL section.',
    screenshots: ['https://prnt.sc/vwPa8CVle9kr', 'https://prnt.sc/6ex24BBUiIgy']
  },
  {
    testCaseId: 'TC-VISIT-033',
    sourceSNo: '27',
    module: 'Website Pesticide Toggle & Line Items',
    taskDescription: 'Reflect Pesticide line items based on Website configuration toggle',
    preconditions: 'Pesticide toggle configured on Website.',
    testSteps: [
      'Open Create Visit -> Line Items.',
      'Verify Pesticides category visibility.'
    ],
    testData: { pesticideToggle: true },
    expectedResults: 'Pesticide category and items are visible and selectable under Line Items.',
    screenshots: ['https://prnt.sc/kFxkfrf5mUsL']
  },
  {
    testCaseId: 'TC-VISIT-034',
    sourceSNo: '23 (Assign Tech)',
    module: 'Assign Technician Save',
    taskDescription: 'Provide Save button in Assign Technician modal/section',
    preconditions: 'Assign Technician view opened.',
    testSteps: [
      'Select a technician from list.',
      'Look for Save button and click.'
    ],
    testData: { technician: 'falcon Tim' },
    expectedResults: 'Save button is available and persists technician assignment.',
    screenshots: ['https://prnt.sc/Bg0pLkLBdcuX']
  },
  {
    testCaseId: 'TC-VISIT-035',
    sourceSNo: '24 (Assign Tech Default)',
    module: 'Assign Technician Default State',
    taskDescription: 'Assign Technician field must be unselected by default',
    preconditions: 'Open new Visit creation form.',
    testSteps: [
      'Inspect Assign Technician section.'
    ],
    testData: {},
    expectedResults: 'Technician checkboxes/selection remain empty/unselected by default, requiring explicit user assignment.',
    screenshots: ['https://prnt.sc/zt_mnAFCp6fu']
  },
  {
    testCaseId: 'TC-VISIT-036',
    sourceSNo: '25 (Line Items Edit)',
    module: 'Line Items Inline Edit',
    taskDescription: 'Remove separate line item edit page and support inline editing',
    preconditions: 'Visit created with line items.',
    testSteps: [
      'Edit line item quantity or rate directly on the page.'
    ],
    testData: { newRate: 60 },
    expectedResults: 'Line items edit directly inline within the section without navigating to a separate edit page.',
    screenshots: ['https://prnt.sc/fEkmjEGjGCfe']
  },
  {
    testCaseId: 'TC-VISIT-037',
    sourceSNo: '26 (Empty Line Item)',
    module: 'Line Items Auto-Cleanup',
    taskDescription: 'Automatically remove blank/unfilled line item row when adding new line item',
    preconditions: 'A blank line item placeholder exists in the table.',
    testSteps: [
      'Add a new line item with valid product data.',
      'Observe line items table.'
    ],
    testData: { validItem: 'CA273' },
    expectedResults: 'Empty/blank line item row is automatically cleared; only valid filled rows remain.',
    screenshots: ['https://prnt.sc/IX7uprfkF-_P']
  },
  {
    testCaseId: 'TC-VISIT-038',
    sourceSNo: '27 (Back Date Validation)',
    module: 'Visit Date Validation',
    taskDescription: 'Prevent creating visit with back date (past date)',
    preconditions: 'Create Visit form open.',
    testSteps: [
      'Set Start Date to yesterday or earlier.',
      'Attempt to save.'
    ],
    testData: { pastDate: '2020-01-01' },
    expectedResults: 'System blocks save and displays clear error message preventing past dates.',
    screenshots: ['https://prnt.sc/5TGRN1f-is8u']
  },
  {
    testCaseId: 'TC-VISIT-039',
    sourceSNo: '28 (Landline Auto-fill)',
    module: 'Customer Landline Auto-population',
    taskDescription: 'Auto-populate customer Landline Number on visit creation',
    preconditions: 'Customer selected has a registered landline number.',
    testSteps: [
      'Select customer on Create Visit page.',
      'Inspect Customer Phone / Landline field.'
    ],
    testData: { expectedLandline: '+65 6317 4140' },
    expectedResults: 'Customer existing Landline Number is automatically populated in the field.',
    screenshots: ['https://prnt.sc/GGaerGqsqXve', 'https://prnt.sc/RrBECC__rUzp']
  },
  {
    testCaseId: 'TC-VISIT-040',
    sourceSNo: '29 (Inactive Customer)',
    module: 'Customer Search Inactive Status',
    taskDescription: 'Display inactive customers with disabled styling and activation toggle',
    preconditions: 'Inactive customer exists in database.',
    testSteps: [
      'Open Select Customer modal.',
      'Search for inactive customer name.'
    ],
    testData: { includeInactive: 1 },
    expectedResults: 'Inactive customers appear visually disabled/tagged with an option to activate.',
    screenshots: ['https://prnt.sc/D_0BeZaUe6AQ']
  },
  {
    testCaseId: 'TC-VISIT-041',
    sourceSNo: '30 (Leave Validation)',
    module: 'Technician Leave Conflict',
    taskDescription: 'Pending leave allows assignment with warning; Approved leave blocks assignment',
    preconditions: 'Technician has Pending leave on visit date.',
    testSteps: [
      'Assign technician with pending leave.',
      'Observe warning pill.',
      'Assign technician with approved leave.'
    ],
    testData: { pendingLeaveDate: '2 October' },
    expectedResults: 'Pending leave shows warning "Pending Leave on [Date]" but allows selection. Approved leave completely blocks selection.',
    screenshots: ['https://prnt.sc/wvN5EdZhnKWh']
  },
  {
    testCaseId: 'TC-VISIT-042',
    sourceSNo: '31 (Header Status Flow)',
    module: 'Visit Status Lifecycle',
    taskDescription: 'Standardize Visit Header Summary statuses starting with Open',
    preconditions: 'Visit created.',
    testSteps: [
      'Verify initial status is "Open" (Draft and Schedule removed).',
      'Verify allowed statuses: Open, En Route, In Progress, Completed, Cancelled, Hold & Unassigned, Hold & assigned, Force Closed, Archived.'
    ],
    testData: { initialStatus: 'Open' },
    expectedResults: 'Initial status is Open; status bar adheres to the defined operational lifecycle.',
    screenshots: ['https://prnt.sc/Qol2J0eA-BHT', 'https://prnt.sc/qJ0dI9htn5pW']
  },
  {
    testCaseId: 'TC-VISIT-043',
    sourceSNo: '37 (Timezone Availability)',
    module: 'Technician Availability Timezone',
    taskDescription: 'Check technician availability based on visit time zone',
    preconditions: 'Technician assigned in a specific time zone.',
    testSteps: [
      'Create visit with overlapping time window in target time zone.',
      'Assign same technician.'
    ],
    testData: { timezone: 'Asia/Singapore' },
    expectedResults: 'Technician shows as Unavailable / Already Occupied when overlapping within the same time zone.',
    screenshots: []
  },
  {
    testCaseId: 'TC-VISIT-044',
    sourceSNo: '40 (Email Location Fix)',
    module: 'SMTP Notifications Address',
    taskDescription: 'Customer email notification displays clean, formatted location address',
    preconditions: 'Visit started by technician triggering customer notification email.',
    testSteps: [
      'Inspect sent SMTP email content.'
    ],
    testData: {},
    expectedResults: 'Email displays clean formatted address string, without encrypted, encoded, or script tags.',
    screenshots: ['https://prnt.sc/YFdUldAyTLf_']
  },
  {
    testCaseId: 'TC-VISIT-045',
    sourceSNo: '65 (Quotation Dropdown Filter)',
    module: 'Quotation Dropdown Filter',
    taskDescription: 'Quotation dropdown displays only Accepted or Approved quotations',
    preconditions: 'Customer has Draft, Ineligible, and Accepted quotations.',
    testSteps: [
      'Open Create Visit -> Quotation dropdown.',
      'Inspect available items.'
    ],
    testData: { allowedStatuses: ['Accepted', 'Approved'] },
    expectedResults: 'Only Accepted and Approved quotations are listed; Draft quotations are excluded.',
    screenshots: ['https://prnt.sc/ud5f-3nZqmeo']
  },
  {
    testCaseId: 'TC-VISIT-046',
    sourceSNo: '66 (Invoice Quotation Filter)',
    module: 'Invoice Quotation Selection',
    taskDescription: 'Invoice creation Quotation dropdown displays only Accepted/Approved quotations',
    preconditions: 'Customer has quotations in multiple statuses.',
    testSteps: [
      'Open Invoice creation form -> Quotation dropdown.',
      'Check listed quotations.'
    ],
    testData: {},
    expectedResults: 'Draft quotations are excluded; only Accepted or Approved quotations are shown.',
    screenshots: ['https://prnt.sc/wa7QSa4chugb']
  },
  {
    testCaseId: 'TC-VISIT-047',
    sourceSNo: '68 (Start Visit 422 Fix)',
    module: 'Start Visit Error Handling',
    taskDescription: 'Clicking Start button starts visit cleanly without 422 error',
    preconditions: 'Assigned visit exists in Open status.',
    testSteps: [
      'Open assigned visit.',
      'Click Start Visit button.'
    ],
    testData: { action: 'start' },
    expectedResults: 'Visit transitions to In-Progress with HTTP 200 without displaying 422 validation error.',
    screenshots: ['https://prnt.sc/fiu-QqMDOSon']
  }
];
