import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { VisitCreatePage } from '../pages/VisitCreatePage';
import { VisitDetailPage } from '../pages/VisitDetailPage';
import { visitTestData } from '../data/visitTestData';

test.describe('GENIC TEAMS - Visit Module: Complete Creation & Update Suite', () => {
  let loginPage: LoginPage;
  let visitCreatePage: VisitCreatePage;
  let visitDetailPage: VisitDetailPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    visitCreatePage = new VisitCreatePage(page);
    visitDetailPage = new VisitDetailPage(page);

    // Session is automatically preserved from .auth/user.json
    await loginPage.login();
  });

  test('Complete Visit Flow: Create New Visit, Inspect Details and Update', async ({ page }) => {
    // --- STEP 1: CREATE VISIT ---
    await visitCreatePage.navigateToCreateVisit();

    // 2. Customer & Billing Location
    await visitCreatePage.selectCustomerAndLocation(7, 'L007');

    // 3. Visit Info: Reference, Job Type, Priority, Tags
    await visitCreatePage.setVisitInformation(visitTestData.create.reference, visitTestData.create.priority);

    // 4. Linked Documents (Quotation, Contract, Invoice, Enquiry)
    await visitCreatePage.linkRelatedDocuments({
      quotation: visitTestData.create.quotationText,
      contract: visitTestData.create.contractText,
      invoice: visitTestData.create.invoiceText,
      enquiry: visitTestData.create.enquiryText
    });

    // 5. Title & Switches
    await visitCreatePage.setVisitTitle(visitTestData.create.title);
    await visitCreatePage.customerSignatureSwitch.click().catch(() => {});
    await visitCreatePage.showLineItemsPdfSwitch.click().catch(() => {});
    await visitCreatePage.serviceFormMandatorySwitch.click().catch(() => {});

    // 6. Line Item (Asset CA273)
    await visitCreatePage.addLineItem(
      visitTestData.create.lineItem.searchAsset,
      visitTestData.create.lineItem.assetCode,
      visitTestData.create.lineItem.uom,
      visitTestData.create.lineItem.rate
    );

    // 7. Schedule & Timing
    await visitCreatePage.configureSchedule(
      visitTestData.create.schedule.isRecurring,
      visitTestData.create.schedule.startDate,
      visitTestData.create.schedule.startTime,
      visitTestData.create.schedule.duration
    );

    // 8. Technicians Assignment
    await visitCreatePage.selectTechnicians(visitTestData.create.technicians);

    // 9. Notes
    await visitCreatePage.setNotesAndTemplates(
      visitTestData.create.internalNoteTemplate,
      visitTestData.create.customerNoteTemplate
    );

    // 10. Save and verify API creation response (POST /api/v2/job)
    const createResult = await visitCreatePage.saveVisit();
    expect(createResult).toBeDefined();
    const visitId = createResult.id || createResult.data?.id;
    console.log('Successfully created visit with ID:', visitId);

    // --- STEP 2: INSPECT TABS & UPDATE VISIT ---
    if (visitId) {
      await page.goto(`/admin/visit/detail/${visitId}`);
      await page.waitForLoadState('domcontentloaded');

      if (await visitDetailPage.overviewTab.isVisible({ timeout: 5000 }).catch(() => false)) {
        await visitDetailPage.overviewTab.click().catch(() => {});
        await visitDetailPage.enterEditMode();

        const updateResult = await visitDetailPage.updateVisitDetails(
          visitTestData.update.updatedTitle,
          visitTestData.update.updatedStartTime
        );
        expect(updateResult).toBeDefined();
        console.log('Successfully updated visit');
      }
    }
  });
});
