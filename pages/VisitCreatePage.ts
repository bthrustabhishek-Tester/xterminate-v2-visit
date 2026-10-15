import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { VisitModel } from '../data/visitTestData';
import { getCustomerDataFromExcel } from '../data/excelHelper';

export class VisitCreatePage extends BasePage {
  // Top level navigation & general buttons
  readonly visitsNavLink: Locator;
  readonly createButton: Locator;
  readonly maybeLaterButton: Locator;
  readonly selectCustomerButton: Locator;
  readonly customerItem: Locator;
  readonly editBillingLocationButton: Locator;
  readonly closeDialogButton: Locator;

  // Visit Information
  readonly referenceInput: Locator;
  readonly jobTypeInput: Locator;
  readonly searchTagsInput: Locator;
  readonly quotationInput: Locator;
  readonly contractInput: Locator;
  readonly invoiceInput: Locator;
  readonly enquiryInput: Locator;

  // Details
  readonly visitTitleInput: Locator;
  readonly richTextEditor: Locator;

  // Switches
  readonly customerSignatureSwitch: Locator;
  readonly showLineItemsPdfSwitch: Locator;
  readonly serviceFormMandatorySwitch: Locator;
  readonly scheduleVisitNowSwitch: Locator;

  // Line Items
  readonly pickItemPlaceholder: Locator;
  readonly searchCustomerAssetInput: Locator;
  readonly uomInput: Locator;
  readonly rateInput: Locator;

  // Schedule
  readonly oneOffVisitRadio: Locator;
  readonly recurringVisitRadio: Locator;
  readonly dailyTab: Locator;
  readonly weeklyTab: Locator;
  readonly startDateButton: Locator;
  readonly startTimeInput: Locator;
  readonly durationInput: Locator;

  // Next Appointment on Hold
  readonly nextAppointmentHoldButton: Locator;
  readonly earliestDayHoldInput: Locator;
  readonly latestDayHoldInput: Locator;

  // Technicians
  readonly viewAllTechniciansButton: Locator;

  // Notes
  readonly selectInternalNoteInput: Locator;
  readonly selectCustomerNoteInput: Locator;

  // Footer Actions
  readonly saveButton: Locator;
  readonly cancelButton: Locator;

  constructor(page: Page) {
    super(page);

    this.visitsNavLink = page.getByRole('link', { name: 'Visits', exact: true });
    this.createButton = page.getByRole('button', { name: 'Create' });
    this.maybeLaterButton = page.getByRole('button', { name: 'Maybe later' });
    this.selectCustomerButton = page.getByRole('button', { name: 'Select Customer', exact: true });
    this.customerItem = page.locator('.customer-list > div:nth-child(7)');
    this.editBillingLocationButton = page.getByRole('button', { name: 'Edit billing location', exact: true });
    this.closeDialogButton = page.getByRole('button', { name: 'Close dialog' });

    this.referenceInput = page.getByRole('textbox', { name: 'Reference' });
    this.jobTypeInput = page.getByRole('textbox', { name: 'Job Type' });
    this.searchTagsInput = page.getByRole('textbox', { name: 'Search Tags...' });
    this.quotationInput = page.getByRole('textbox', { name: 'Quotation' });
    this.contractInput = page.getByRole('textbox', { name: 'Contract' });
    this.invoiceInput = page.getByRole('textbox', { name: 'Invoice' });
    this.enquiryInput = page.getByRole('textbox', { name: 'Enquiry' });

    this.visitTitleInput = page.getByRole('textbox', { name: 'Visit Title *' });
    this.richTextEditor = page.getByRole('textbox', { name: 'Rich Text Editor, main' }).first();

    this.customerSignatureSwitch = page.getByRole('switch', { name: 'Customer signature is' });
    this.showLineItemsPdfSwitch = page.getByRole('switch', { name: 'Show line items on the PDF' });
    this.serviceFormMandatorySwitch = page.getByRole('switch', { name: 'Service form is mandatory' });
    this.scheduleVisitNowSwitch = page.getByRole('switch', { name: 'Schedule this visit now' });

    this.pickItemPlaceholder = page.getByText('Pick an item…').first();
    this.searchCustomerAssetInput = page.getByRole('textbox', { name: 'Search customer asset / rental' });
    this.uomInput = page.getByRole('textbox', { name: 'UOM' });
    this.rateInput = page.getByRole('spinbutton', { name: 'Rate' });

    this.oneOffVisitRadio = page.getByRole('radio', { name: 'One-off Visit A one-time' });
    this.recurringVisitRadio = page.getByRole('radio', { name: 'Recurring Visit A contract' });
    this.dailyTab = page.getByRole('tab', { name: 'Daily' });
    this.weeklyTab = page.getByRole('tab', { name: 'Weekly' });
    this.startDateButton = page.getByRole('button', { name: 'Start Date *' });
    this.startTimeInput = page.getByRole('textbox', { name: 'Start Time *' });
    this.durationInput = page.getByRole('textbox', { name: 'Duration *' });

    this.nextAppointmentHoldButton = page.getByRole('button', { name: 'Next Appointment on Hold (' });
    this.earliestDayHoldInput = page.getByRole('spinbutton', { name: 'Earliest day after the hold' });
    this.latestDayHoldInput = page.getByRole('spinbutton', { name: 'Latest day after the hold' });

    this.viewAllTechniciansButton = page.getByRole('button', { name: 'View All Technicians' });

    this.selectInternalNoteInput = page.getByRole('textbox', { name: 'Select internal note' });
    this.selectCustomerNoteInput = page.getByRole('textbox', { name: 'Select customer note' });

    this.saveButton = page.getByRole('button', { name: 'Save', exact: true }).first();
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true }).first();
  }

  async navigateToCreateVisit() {
    if (!this.page.url().includes('/admin/visits/create')) {
      await this.page.goto('/admin/visits/create');
      await this.waitForPageReady();
    }
    if (await this.maybeLaterButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.maybeLaterButton.click().catch(() => {});
    }
  }

  async selectCustomerAndLocation(
    excelFilePathOrIndex?: string | number,
    fallbackBillingCode: string = 'L007'
  ) {
    let excelData = null;
    let manualIndex: number | undefined = undefined;

    if (typeof excelFilePathOrIndex === 'string') {
      excelData = getCustomerDataFromExcel(excelFilePathOrIndex);
    } else if (typeof excelFilePathOrIndex === 'number') {
      manualIndex = excelFilePathOrIndex;
    } else {
      // Check default excel file path if no argument was passed
      excelData = getCustomerDataFromExcel();
    }

    await this.selectCustomerButton.click();
    await this.page.waitForTimeout(500);

    const customerRows = this.page.locator('.customer-list > div, .v-dialog .customer-item, .v-dialog tbody tr');
    await customerRows.first().waitFor({ state: 'visible', timeout: 8000 });
    const count = await customerRows.count();

    if (excelData?.customerName) {
      // 1. Pick customer by name from Excel
      const searchBox = this.page.getByRole('textbox', { name: /search/i }).first();
      if (await searchBox.isVisible({ timeout: 2000 }).catch(() => false)) {
        await searchBox.fill(excelData.customerName);
        await this.page.waitForTimeout(500);
      }
      const matchedItem = this.page.locator(`text=${excelData.customerName}`).first();
      if (await matchedItem.isVisible({ timeout: 3000 }).catch(() => false)) {
        await matchedItem.click();
      } else {
        const randomIdx = Math.floor(Math.random() * Math.max(count, 1)) + 1;
        await this.page.locator(`.customer-list > div:nth-child(${randomIdx})`).click();
      }
    } else if (excelData?.customerIndex && excelData.customerIndex <= count) {
      // 2. Pick by row index from Excel
      await this.page.locator(`.customer-list > div:nth-child(${excelData.customerIndex})`).click();
    } else if (manualIndex !== undefined && manualIndex <= count) {
      // 3. Pick by manual index passed to function
      await this.page.locator(`.customer-list > div:nth-child(${manualIndex})`).click();
    } else {
      // 4. Fallback: Pick a completely RANDOM customer from the live list
      const randomIdx = Math.floor(Math.random() * Math.max(count, 1)) + 1;
      console.log(`[Excel not provided/found] Picking random customer at index #${randomIdx} out of ${count} available.`);
      await this.page.locator(`.customer-list > div:nth-child(${randomIdx})`).click();
    }

    await this.waitForPageReady();

    // Select Billing Location
    const targetBillingCode = excelData?.billingCode || fallbackBillingCode;
    if (await this.editBillingLocationButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.editBillingLocationButton.click();
      await this.page.waitForTimeout(500);

      const locItem = this.page.locator('span, div').filter({ hasText: targetBillingCode }).first();
      if (await locItem.isVisible({ timeout: 2000 }).catch(() => false)) {
        await locItem.click();
      } else {
        const locationOptions = this.page.locator('.v-dialog .location-item, .v-dialog tbody tr, .v-dialog .v-card');
        if (await locationOptions.first().isVisible({ timeout: 2000 }).catch(() => false)) {
          const locCount = await locationOptions.count();
          const randomLocIdx = Math.floor(Math.random() * locCount);
          await locationOptions.nth(randomLocIdx).click().catch(() => {});
        }
      }
      await this.closeDialogButton.click().catch(() => {});
    }
  }

  async setVisitInformation(reference: string, priority: 'Low' | 'Medium' | 'High' = 'Low') {
    await this.referenceInput.click();
    await this.referenceInput.fill(reference);

    // Job Types
    await this.jobTypeInput.click();
    const firstCheckbox = this.page.locator('.v-list-item__action > .v-simple-checkbox > .v-input--selection-controls__input > .v-icon').first();
    if (await firstCheckbox.isVisible({ timeout: 2000 }).catch(() => false)) {
      await firstCheckbox.click();
    }
    const saveJobTypeBtn = this.page.locator('div').filter({ hasText: /^CancelSave$/ }).locator('button:has-text("Save")').first();
    if (await saveJobTypeBtn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await saveJobTypeBtn.click();
    } else {
      await this.page.keyboard.press('Escape').catch(() => {});
    }

    // Tags
    if (await this.searchTagsInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.searchTagsInput.click();
      const complaintTag = this.page.getByText('Complaint').first();
      if (await complaintTag.isVisible({ timeout: 2000 }).catch(() => false)) {
        await complaintTag.click();
      }
    }

    // Priority
    await this.page.locator('span').filter({ hasText: priority }).first().click().catch(() => {});
  }

  async linkRelatedDocuments(docs?: { quotation?: string; contract?: string; invoice?: string; enquiry?: string }) {
    if (docs?.quotation && await this.quotationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.quotationInput.click();
      await this.page.getByText(docs.quotation).first().click().catch(() => {});
    }
    if (docs?.contract && await this.contractInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.contractInput.click();
      await this.page.getByText(docs.contract).first().click().catch(() => {});
    }
    if (docs?.invoice && await this.invoiceInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.invoiceInput.click();
      await this.page.getByText(docs.invoice).first().click().catch(() => {});
    }
    if (docs?.enquiry && await this.enquiryInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.enquiryInput.click();
      await this.page.getByText(docs.enquiry).first().click().catch(() => {});
    }
  }

  async setVisitTitle(title: string) {
    await this.visitTitleInput.click();
    const dropdownOption = this.page.getByText(title).first();
    if (await dropdownOption.isVisible({ timeout: 2000 }).catch(() => false)) {
      await dropdownOption.click();
    } else {
      await this.visitTitleInput.fill(title);
    }
  }

  async addLineItem(searchAsset: string, assetCode: string, uom: string = 'Box', rate: string = '50') {
    const lineItemsHeading = this.page.getByRole('heading', { name: 'Line Items' }).first();
    if (await lineItemsHeading.isVisible().catch(() => false)) {
      await lineItemsHeading.scrollIntoViewIfNeeded();
      // If collapsed, expand it
      if (!(await this.pickItemPlaceholder.isVisible().catch(() => false))) {
        await lineItemsHeading.click();
        await this.page.waitForTimeout(500);
      }
    }

    if (await this.pickItemPlaceholder.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.pickItemPlaceholder.click();
      await this.page.waitForTimeout(500);

      const searchInput = this.page.getByRole('textbox', { name: 'Search customer asset / rental' });
      await searchInput.waitFor({ state: 'visible', timeout: 5000 });
      await searchInput.fill(searchAsset);
      await this.page.waitForTimeout(1000);

      const assetOption = this.page.getByText(assetCode).first();
      await assetOption.waitFor({ state: 'visible', timeout: 5000 });
      await assetOption.click();
      await this.page.waitForTimeout(500);

      if (await this.uomInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.uomInput.click();
        await this.page.getByText(uom).first().click().catch(() => {});
      }
      if (await this.rateInput.isVisible({ timeout: 2000 }).catch(() => false)) {
        await this.rateInput.click();
        await this.rateInput.fill(rate);
      }
    }
  }

  async configureSchedule(isRecurring: boolean = false, dateDay: string = '14', time: string = '08:00 AM', duration: string = '1 Hour') {
    if (isRecurring) {
      await this.recurringVisitRadio.check({ force: true }).catch(() => {});
      await this.dailyTab.click().catch(() => {});
    } else {
      await this.oneOffVisitRadio.check({ force: true }).catch(() => {});
    }

    if (await this.startDateButton.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.startDateButton.click();
      await this.page.getByRole('button', { name: dateDay, exact: true }).first().click().catch(() => {});
    }

    if (await this.startTimeInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.startTimeInput.click();
      await this.page.getByText(time).first().click().catch(() => {});
    }

    if (await this.durationInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.durationInput.click();
      await this.page.getByText(duration).first().click().catch(() => {});
    }
  }

  async selectTechnicians(names: string[]) {
    for (const name of names) {
      const techBox = this.page.getByRole('checkbox', { name: new RegExp(name, 'i') }).first();
      if (await techBox.isVisible({ timeout: 2000 }).catch(() => false)) {
        await techBox.check({ force: true }).catch(() => {});
      }
    }
  }

  async setNotesAndTemplates(internalNote?: string, customerNote?: string) {
    if (internalNote && await this.selectInternalNoteInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.selectInternalNoteInput.click();
      await this.page.getByText(internalNote).first().click().catch(() => {});
    }
    if (customerNote && await this.selectCustomerNoteInput.isVisible({ timeout: 2000 }).catch(() => false)) {
      await this.selectCustomerNoteInput.click();
      await this.page.getByText(customerNote).first().click().catch(() => {});
    }
  }

  async saveVisit() {
    // Wait for the POST /api/v2/job response
    const [response] = await Promise.all([
      this.page.waitForResponse(res => res.url().includes('/api/v2/job') && res.request().method() === 'POST', { timeout: 30000 }),
      this.page.getByRole('button', { name: 'Save', exact: true }).first().click()
    ]);
    expect(response.status()).toBe(200);
    const body = await response.json();
    return body;
  }
}
