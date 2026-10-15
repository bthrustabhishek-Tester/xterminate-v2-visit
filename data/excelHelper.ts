import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

export interface CustomerExcelRow {
  customerName?: string;
  customerIndex?: number;
  billingCode?: string;
}

/**
 * Reads customer test data from an Excel (.xlsx / .xls) file if provided and exists.
 * Returns null if file is not found or empty.
 */
export function getCustomerDataFromExcel(filePath?: string): CustomerExcelRow | null {
  const targetPath = filePath || path.resolve(process.cwd(), 'data/customers.xlsx');

  if (!fs.existsSync(targetPath)) {
    return null;
  }

  try {
    const workbook = XLSX.readFile(targetPath);
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    const records = XLSX.utils.sheet_to_json<CustomerExcelRow>(worksheet);

    if (records && records.length > 0) {
      // Pick the first row or a random row from Excel
      const randomIndex = Math.floor(Math.random() * records.length);
      return records[randomIndex];
    }
  } catch (error) {
    console.warn(`Could not read Excel file at ${targetPath}:`, error);
  }

  return null;
}
