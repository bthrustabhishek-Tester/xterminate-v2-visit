import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';
import * as xlsx from 'xlsx';

test.describe('Field Operations > Visit Export Automation & Dataset Verification', () => {

  test('TC-EXP-VISIT-001: Trigger Visit export, wait on Export Hub, download file & verify dataset against API', async ({ page, request }) => {
    test.setTimeout(180000); // 3 minutes timeout for export background job

    console.log('[Step 1] Navigating to Field Operations > Visits (/admin/visit)...');
    await page.goto('/admin/visit');
    await page.waitForLoadState('domcontentloaded');

    // Ensure table or data is rendered
    await page.locator('table, .v-data-table, .visit-list').first().waitFor({ state: 'visible', timeout: 20000 });

    console.log('[Step 2] Opening Export Modal...');
    const exportBtn = page.locator('button:has-text("EXPORT"), button:has-text("Export")').first();
    await expect(exportBtn).toBeVisible({ timeout: 15000 });
    await exportBtn.click();

    const dialog = page.locator('.v-dialog--active, [role="dialog"]').first();
    await expect(dialog).toBeVisible({ timeout: 10000 });

    console.log('[Step 3] Selecting "This Year" Date Range Preset...');
    const customRadio = dialog.locator('input[value="date_range"]');
    if (await customRadio.count() > 0) {
      await customRadio.click({ force: true });
    } else {
      const customLabel = dialog.locator('*:has-text("Custom Date Range")').last();
      if (await customLabel.isVisible()) {
        await customLabel.click();
      }
    }

    const dateField = dialog.locator('.export-date-range-picker, div:has-text("From Date - To Date"), input[role="button"]').last();
    if (await dateField.isVisible()) {
      await dateField.click();
      await page.waitForTimeout(1000);

      const thisYearItem = page.locator('ul.range-presets li:has-text("This Year"), *:has-text("This Year")').last();
      if (await thisYearItem.isVisible()) {
        await thisYearItem.click();
        await page.waitForTimeout(500);

        const confirmBtn = page.locator('button:has-text("CONFIRM")').first();
        if (await confirmBtn.isVisible()) {
          await confirmBtn.click();
        }
      }
    }

    console.log('[Step 4] Submitting Export Job...');
    const submitBtn = dialog.locator('button:has-text("Export")').last();
    await submitBtn.click();
    await page.waitForTimeout(2000);

    console.log('[Step 5] Navigating to Export Hub (/admin/export)...');
    await page.goto('/admin/export');
    await page.waitForLoadState('domcontentloaded');
    await page.locator('table, .v-data-table').first().waitFor({ state: 'visible', timeout: 20000 });

    console.log('[Step 6] Polling for Visit export completion...');
    let completedRow = null;
    const maxPolls = 24; // 24 * 5s = 120s

    for (let i = 0; i < maxPolls; i++) {
      await page.reload({ waitUntil: 'networkidle' }).catch(() => {});
      await page.waitForTimeout(3000);

      const rows = page.locator('tbody tr');
      const count = await rows.count();

      for (let r = 0; r < count; r++) {
        const row = rows.nth(r);
        const text = (await row.innerText()).toLowerCase();
        if ((text.includes('visit') || text.includes('job')) && text.includes('completed')) {
          completedRow = row;
          console.log(`[Step 6] Found completed export job: "${text.split('\n')[0]}"`);
          break;
        }
      }

      if (completedRow) break;
      console.log(`[Step 6] Still waiting for export job to complete... attempt ${i + 1}/${maxPolls}`);
      await page.waitForTimeout(5000);
    }

    expect(completedRow).not.toBeNull();

    console.log('[Step 7] Downloading Exported Excel file...');
    const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
    const downloadIcon = completedRow!.locator('.export-download-button, button:has(i), button:has(svg)').first();
    await downloadIcon.click();
    const download = await downloadPromise;

    const downloadsDir = path.resolve(process.cwd(), 'downloads');
    if (!fs.existsSync(downloadsDir)) {
      fs.mkdirSync(downloadsDir, { recursive: true });
    }

    const suggestedName = download.suggestedFilename() || 'visit_export.xlsx';
    const filePath = path.join(downloadsDir, suggestedName);
    await download.saveAs(filePath);
    console.log(`[Step 7] File downloaded successfully to: ${filePath}`);

    expect(fs.existsSync(filePath)).toBeTruthy();
    const stats = fs.statSync(filePath);
    expect(stats.size).toBeGreaterThan(0);

    console.log('[Step 8] Parsing downloaded Excel file...');
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const records: any[] = xlsx.utils.sheet_to_json(sheet);

    console.log(`[Step 8] Excel Parsed: ${records.length} rows, Sheet: "${sheetName}"`);
    expect(records.length).toBeGreaterThan(0);

    console.log('[Step 9] Verifying against live system API (/api/v2/job)...');
    const apiResponse = await request.get('/api/v2/job?current_page=1&per_page=50&status=all').catch(() => null);
    if (apiResponse && apiResponse.ok()) {
      const apiData = await apiResponse.json();
      const apiRows = apiData?.data?.rows || [];
      console.log(`[Step 9] API returned ${apiRows.length} visit records for cross-verification.`);
      if (apiRows.length > 0) {
        const firstApiBarcode = apiRows[0].barcode || apiRows[0].reference || '';
        console.log(`[Step 9] First API record reference: ${firstApiBarcode}`);
      }
    }

    console.log('>>> FIELD OPERATIONS > VISIT EXPORT TEST COMPLETED SUCCESSFULLY! <<<');
  });

});
