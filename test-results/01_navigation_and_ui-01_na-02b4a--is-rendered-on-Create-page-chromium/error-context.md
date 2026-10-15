# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: 01_navigation_and_ui\01_navigation_layout.spec.ts >> Module 01: Visit Module Navigation, Breadcrumbs & Layout UI Tests (50 Scenarios) >> TC-NAV-011: Verify UI container or action button [Save] is rendered on Create page
- Location: tests\01_navigation_and_ui\01_navigation_layout.spec.ts:50:9

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator:  locator('text=Save').first()
Expected: visible
Received: hidden
Timeout:  10000ms

Call log:
  - Expect "toBeVisible" locator('text=Save').first() with timeout 10000ms
  - waiting for locator('text=Save').first()
    23 × locator resolved to <span class="fsm-btn__label">Save</span>
       - unexpected value "hidden"

```

```yaml
- link "Logo":
  - /url: /
  - img "Logo"
- link "Go to dashboard":
  - /url: /
  - img "Genic Teams"
- navigation "Main navigation":
  - list:
    - listitem:
      - link "Dashboard":
        - /url: /admin/dashboard
    - listitem:
      - button "Calendar":
        - img
        - text: Calendar
    - listitem:
      - button "CRM":
        - img
        - text: CRM
    - listitem:
      - button "Sales":
        - img
        - text: Sales
    - listitem:
      - link "Technicians":
        - /url: /admin/engineer
        - img
        - text: Technicians
    - listitem:
      - link "Leave":
        - /url: /admin/leave/
        - img
        - text: Leave
    - listitem:
      - button "Tools":
        - img
        - text: Tools
    - listitem:
      - link "pesticide Pesticides":
        - /url: /admin/pesticide
        - img "pesticide"
        - text: Pesticides
    - listitem:
      - link "Customer Asset":
        - /url: /admin/client-equipment
        - img
        - text: Customer Asset
    - listitem:
      - button "Rentals":
        - img
        - text: Rentals
    - listitem:
      - link "Treatment":
        - /url: /admin/treatments
        - img
        - text: Treatment
    - listitem:
      - link "Visits":
        - /url: /admin/visit
        - img
        - text: Visits
    - listitem:
      - link "Enquiry":
        - /url: /admin/enquiry
        - img
        - text: Enquiry
    - listitem:
      - button "Reports":
        - img
        - text: Reports
    - listitem:
      - button "Zones":
        - img
        - text: Zones
    - listitem:
      - link "Imports":
        - /url: /admin/imports
        - img
        - text: Imports
- button "Collapse sidebar" [expanded]:
  - img "Stockholm-icons / Navigation / Angle-double-left"
  - text: Collapse
- heading "CREATE" [level=5]
- list:
  - listitem:
    - link "VISITS":
      - /url: /admin/visit?t=1792033911288
  - listitem
  - listitem: CREATE
- button "Search customers, quotations, visits, treatments...":
  - img "Stockholm-icons / General / Search"
- textbox "Search visits..."
- img "Stockholm-icons / General / Update"
- button "Notifications, 36 unread":
  - img "Stockholm-icons / General / Notifications1"
  - text: "36"
- text: Hi, Admin AD AD
- link "Mr Super Admin":
  - /url: /admin/profile/basic
- text: Admin Free
- link "Upgrade":
  - /url: /admin/profile/my-account
- link "Stockholm-icons / Communication / Mail-notification admin@genicteams.com":
  - /url: "#"
  - img "Stockholm-icons / Communication / Mail-notification"
  - text: admin@genicteams.com
- text: BT Business Thrust Pte Ltd.
- link "My Account":
  - /url: /admin/profile/my-account
- text: Sign Out
- link "":
  - /url: "#"
- text: Other Information
- link "Admin Users Manage admin users":
  - /url: "#"
  - img
  - text: Admin Users Manage admin users
- link "Technical Users Manage technical users":
  - /url: "#"
  - img
  - text: Technical Users Manage technical users
- link "Stockholm-icons / Files / Selected-file My Activities Logs and notifications":
  - /url: "#"
  - img "Stockholm-icons / Files / Selected-file"
  - text: My Activities Logs and notifications
- link "Stockholm-icons / Shopping / Settings Setting Account settings and more update":
  - /url: "#"
  - img "Stockholm-icons / Shopping / Settings"
  - text: Setting Account settings and more update
- text: Need Help?
- link "Talk to us":
  - /url: /admin/visits/create
- link "Help Resources":
  - /url: /admin/visits/create
- link "support@genicteams.com":
  - /url: mailto:support@genicteams.com
- link "Book a demo":
  - /url: /admin/visits/create
- link "FSM Flow Demonstration":
  - /url: /admin/visits/create
- link "Job Execution Flow":
  - /url: /admin/visits/create
- text: Powered By Genic Teams
- heading "Create New Visit V521" [level=1]
- button "Open notifications"
- button "Layout"
- heading "Customer Information" [level=2]
- text: View and manage customer, contact and billing details.
- button "Collapse customer information details"
- button "- No customer selected Select a customer to view contact and billing details. Select customer Edit customer Collapse customer information" [expanded]:
  - text: "- No customer selected Select a customer to view contact and billing details."
  - button "Select customer"
  - button "Edit customer" [disabled]
  - button "Collapse customer information"
- text: Choose a customer to get started Once selected, you’ll be able to view and manage all related details.
- button "Select Customer"
- button "Billing Location Manage the billing location and contact details Edit billing location Expand billing locations Hover for complete billing location details":
  - text: Billing Location Manage the billing location and contact details
  - button "Edit billing location"
  - button "Expand billing locations"
  - separator
  - text: Location Name No billing location selected Contact Person No primary contact selected
- button "Site Location Manage the site location and contact details Select site location Expand site location Hover for complete site location details":
  - heading "Site Location" [level=4]
  - text: Manage the site location and contact details
  - button "Select site location"
  - button "Expand site location"
  - separator
  - text: Site Name No site location selected Contact Person No primary contact selected
- text: Visit Details Add the title and description for this visit.
- button "Collapse visit details"
- text: Visit Title *
- combobox:
  - textbox "Visit Title *":
    - /placeholder: Title
- alert: Visit Title is required
- text: 0 / 250 Description
- application "Rich Text Editor":
  - toolbar "Editor toolbar":
    - button "Paragraph":
      - text: Paragraph
      - img
    - button "Bold":
      - img
    - button "Italic":
      - img
    - button "Decrease indent" [disabled]:
      - img
    - button "Increase indent" [disabled]:
      - img
    - button "Bulleted List":
      - img
    - button "Numbered List":
      - img
    - button "Block quote":
      - img
    - button "Undo" [disabled]:
      - img
    - button "Redo" [disabled]:
      - img
  - textbox "Rich Text Editor, main":
    - paragraph: Description
- text: Visit Information Set the priority and your internal reference.
- button "Collapse visit information"
- text: Priority Low Medium High Reference
- textbox "Reference"
- text: Job Type
- combobox:
  - textbox "Job Type":
    - /placeholder: Service, Installation…
- text: Tags
- combobox:
  - textbox "Search Tags..."
- text: Internal Information Provide additional details for this visit.
- button "Collapse internal information"
- text: Quotation
- combobox:
  - textbox "Quotation" [disabled]:
    - /placeholder: Select a customer first
- text: Contract
- combobox:
  - textbox "Contract" [disabled]:
    - /placeholder: Select a customer first
- text: Invoice
- combobox:
  - textbox "Invoice" [disabled]:
    - /placeholder: Select a customer first
- text: Enquiry
- combobox:
  - textbox "Enquiry" [disabled]:
    - /placeholder: Select a customer first
- switch "Schedule this visit now" [checked]
- text: Schedule this visit now
- paragraph: Set the date, time, pattern and assign technicians for this visit.
- paragraph: Configure the schedule, recurrence pattern and technician assignment in the section below.
- switch "Service form is mandatory" [disabled]
- text: Service form is mandatory
- paragraph: Technicians can close this visit without a service form.
- paragraph: Service Form Required is off in Settings → Visit, so no visit asks for a service form.
- switch "Customer signature is mandatory"
- text: Customer signature is mandatory
- paragraph: This visit can be closed without a customer signature.
- paragraph: The visit shows Signature Required until the customer signs.
- switch "Invoice required"
- text: Invoice required
- paragraph: This visit does not need an invoice.
- paragraph: Turn this on to raise a draft invoice on completion, or a reminder to invoice it.
- switch "Show line items on the PDF"
- text: Show line items on the PDF
- paragraph: Line items are hidden from this visit PDF.
- paragraph: Turn this on if the customer should see each item on the PDF.
- heading "Line Items" [level=5]
- text: At least 1 required · 0 added
- radiogroup "Visit type":
  - radio "One-off Visit A one-time visit with one or more occurrences." [checked]
  - text: One-off Visit A one-time visit with one or more occurrences.
  - radio "Recurring Visit A contract visit with repeating occurrences."
  - text: Recurring Visit A contract visit with repeating occurrences.
- heading "Schedule & Technician Assignment" [level=5]
- heading "Notes & Attachments" [level=5]
- heading "Terms & Conditions" [level=3]
- heading "Additional Information" [level=5]
- text: Infestation Level
- combobox:
  - textbox "Infestation Level"
- text: On-site Contact
- textbox "On-site Contact"
- switch "Follow-up Required"
- text: Follow-up Required
- progressbar
- button "Cancel"
- button "Save"
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | import { LoginPage } from '../../pages/LoginPage';
  3   | import { VisitCreatePage } from '../../pages/VisitCreatePage';
  4   | 
  5   | test.describe('Module 01: Visit Module Navigation, Breadcrumbs & Layout UI Tests (50 Scenarios)', () => {
  6   |   let loginPage: LoginPage;
  7   |   let visitCreatePage: VisitCreatePage;
  8   | 
  9   |   test.beforeEach(async ({ page }) => {
  10  |     loginPage = new LoginPage(page);
  11  |     visitCreatePage = new VisitCreatePage(page);
  12  |     // Session is automatically preserved from .auth/user.json
  13  |     await loginPage.login();
  14  |   });
  15  | 
  16  |   // 1-10: Main Navigation & Links
  17  |   const navItems = [
  18  |     { name: 'Visits', expectedUrlPart: '/admin/visit' },
  19  |     { name: 'Dashboard', expectedUrlPart: '/admin/dashboard' },
  20  |     { name: 'Technicians', expectedUrlPart: '/admin/engineer' },
  21  |     { name: 'Customer Asset', expectedUrlPart: '/admin/client-equipment' },
  22  |     { name: 'Treatment', expectedUrlPart: '/admin/treatments' },
  23  |     { name: 'Enquiry', expectedUrlPart: '/admin/enquiry' },
  24  |   ];
  25  | 
  26  |   for (let i = 0; i < navItems.length; i++) {
  27  |     const item = navItems[i];
  28  |     test(`TC-NAV-${(i + 1).toString().padStart(3, '0')}: Verify sidebar link navigation to ${item.name}`, async ({ page }) => {
  29  |       const link = page.locator('.sidebar, nav, ul').getByRole('link', { name: item.name, exact: true }).first();
  30  |       await expect(link).toBeVisible();
  31  |       await link.click();
  32  |       await page.waitForLoadState('domcontentloaded');
  33  |       expect(page.url()).toContain(item.expectedUrlPart);
  34  |     });
  35  |   }
  36  | 
  37  |   // 11-20: Create Visit Breadcrumbs & Headers
  38  |   test('TC-NAV-007: Navigate to Create Visit via Visit list Create button', async ({ page }) => {
  39  |     await visitCreatePage.navigateToCreateVisit();
  40  |     await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  41  |   });
  42  | 
  43  |   const headerElements = [
  44  |     'Create New Visit', 'Layout', 'Cancel', 'Save',
  45  |     'Customer Information', 'Visit Details', 'Visit Information',
  46  |     'Internal Information', 'Schedule & Technician Assignment'
  47  |   ];
  48  | 
  49  |   headerElements.forEach((elName, idx) => {
  50  |     test(`TC-NAV-${(idx + 8).toString().padStart(3, '0')}: Verify UI container or action button [${elName}] is rendered on Create page`, async ({ page }) => {
  51  |       await visitCreatePage.navigateToCreateVisit();
  52  |       const elem = page.locator(`text=${elName}`).first();
> 53  |       await expect(elem).toBeVisible();
      |                          ^ Error: expect(locator).toBeVisible() failed
  54  |     });
  55  |   });
  56  | 
  57  |   // 21-35: Form Section Collapsibility & Expandability
  58  |   const sectionsToTest = [
  59  |     'Customer Information', 'Visit Details', 'Visit Information',
  60  |     'Internal Information', 'Line Items', 'Schedule & Technician Assignment',
  61  |     'Notes & Attachments', 'Terms & Conditions', 'Additional Information'
  62  |   ];
  63  | 
  64  |   sectionsToTest.forEach((sec, idx) => {
  65  |     test(`TC-NAV-${(idx + 21).toString().padStart(3, '0')}: Verify section header [${sec}] allows toggle/collapse click`, async ({ page }) => {
  66  |       await visitCreatePage.navigateToCreateVisit();
  67  |       const secHeader = page.locator(`text=${sec}`).first();
  68  |       await secHeader.scrollIntoViewIfNeeded();
  69  |       await expect(secHeader).toBeVisible();
  70  |       await secHeader.click();
  71  |     });
  72  |   });
  73  | 
  74  |   // 36-50: Responsive Viewports & Quick Actions
  75  |   const viewports = [
  76  |     { width: 1920, height: 1080, label: 'Full HD Desktop' },
  77  |     { width: 1600, height: 900, label: 'Standard Laptop' },
  78  |     { width: 1366, height: 768, label: 'Compact Screen' },
  79  |   ];
  80  | 
  81  |   viewports.forEach((vp, idx) => {
  82  |     test(`TC-NAV-${(idx + 36).toString().padStart(3, '0')}: Verify Visit Create layout responsiveness on ${vp.label}`, async ({ page }) => {
  83  |       await page.setViewportSize({ width: vp.width, height: vp.height });
  84  |       await visitCreatePage.navigateToCreateVisit();
  85  |       await expect(page.getByRole('button', { name: 'Save', exact: true }).first()).toBeVisible();
  86  |     });
  87  |   });
  88  | 
  89  |   test('TC-NAV-045: Verify notification indicator on visit create header', async ({ page }) => {
  90  |     await visitCreatePage.navigateToCreateVisit();
  91  |     await expect(page.getByRole('button', { name: /Notifications/i }).first()).toBeVisible();
  92  |   });
  93  | 
  94  |   test('TC-NAV-046: Verify layout customization button opens drawer or options', async ({ page }) => {
  95  |     await visitCreatePage.navigateToCreateVisit();
  96  |     const layoutBtn = page.getByRole('button', { name: 'Layout' });
  97  |     if (await layoutBtn.isVisible()) {
  98  |       await layoutBtn.click();
  99  |     }
  100 |   });
  101 | 
  102 |   test('TC-NAV-047: Verify Cancel button prompts or navigates back to Visit list', async ({ page }) => {
  103 |     await visitCreatePage.navigateToCreateVisit();
  104 |     await page.getByRole('button', { name: 'Cancel' }).first().click();
  105 |     await page.waitForLoadState('domcontentloaded');
  106 |   });
  107 | 
  108 |   test('TC-NAV-048: Verify pressing Escape closes open modals or pickers', async ({ page }) => {
  109 |     await visitCreatePage.navigateToCreateVisit();
  110 |     await page.keyboard.press('Escape');
  111 |     await expect(page.getByRole('button', { name: 'Save', exact: true }).first()).toBeVisible();
  112 |   });
  113 | 
  114 |   test('TC-NAV-049: Verify quick search input is present in top navigation', async ({ page }) => {
  115 |     await visitCreatePage.navigateToCreateVisit();
  116 |     const searchInput = page.getByRole('textbox', { name: /search/i }).first();
  117 |     await expect(searchInput).toBeVisible();
  118 |   });
  119 | 
  120 |   test('TC-NAV-050: Verify User Profile dropdown shows logged-in admin email', async ({ page }) => {
  121 |     await visitCreatePage.navigateToCreateVisit();
  122 |     await expect(page.locator('text=Hi, Admin').first()).toBeVisible();
  123 |   });
  124 | });
  125 | 
```