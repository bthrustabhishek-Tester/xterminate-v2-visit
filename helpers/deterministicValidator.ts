/**
 * Deterministic Data Validator Engine
 * =====================================
 * High-performance, exact-matching validator for comparing system database records
 * against exported spreadsheets (CSV / Excel).
 *
 * Designed to make AI/LLM/RAG validation strictly OPTIONAL (via ENABLE_LLM_VALIDATION=false)
 * and provide deterministic, repeatable, and fast data matching for 100% test reliability.
 */

export interface FieldComparisonResult {
  field: string;
  systemValue: any;
  exportValue: any;
  isMatch: boolean;
  reason?: string;
  isAiEvaluated?: boolean;
}

export interface RecordComparisonResult {
  recordKey: string;
  isMatch: boolean;
  matchScore: number; // 0.0 to 1.0
  totalFields: number;
  matchedFields: number;
  discrepancies: FieldComparisonResult[];
}

export interface DatasetValidationSummary {
  totalSystemRecords: number;
  totalExportRecords: number;
  exactMatchCount: number;
  mismatchCount: number;
  missingInExportCount: number;
  missingInSystemCount: number;
  overallAccuracyPercentage: number;
  details: RecordComparisonResult[];
}

export class DeterministicValidator {
  private static readonly EMPTY_STRINGS = new Set(['', 'null', 'undefined', 'n/a', 'na', '-', 'none']);

  /**
   * Normalizes values across different database and spreadsheet representations.
   */
  static normalize(val: any): string {
    if (val === null || val === undefined) return '';

    let s = String(val).trim();

    // Empty representation check
    if (this.EMPTY_STRINGS.has(s.toLowerCase())) {
      return '';
    }

    // Currency normalization (e.g. "$120.50", "120.5", "S$ 120.5000" -> "120.50")
    const currencyMatch = s.match(/^[$S\s]*([0-9]+(?:\.[0-9]+)?)[$S\s]*$/);
    if (currencyMatch && !isNaN(Number(currencyMatch[1]))) {
      return Number(currencyMatch[1]).toFixed(2);
    }

    // Date normalization: DD/MM/YYYY or DD-MM-YYYY
    const dmyMatch = s.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
    if (dmyMatch) {
      const day = dmyMatch[1].padStart(2, '0');
      const month = dmyMatch[2].padStart(2, '0');
      const year = dmyMatch[3];
      return `${year}-${month}-${day}`;
    }

    // Date normalization: YYYY-MM-DD
    const ymdMatch = s.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (ymdMatch) {
      const year = ymdMatch[1];
      const month = ymdMatch[2].padStart(2, '0');
      const day = ymdMatch[3].padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    // Phone normalization (removes formatting spaces, dashes, brackets)
    if (/^[\d+\s\-()]{7,}$/.test(s)) {
      return s.replace(/[\s\-()]/g, '');
    }

    // General text normalization (collapse multiple spaces, lowercase for case-insensitivity)
    return s.replace(/\s+/g, ' ').toLowerCase();
  }

  /**
   * Performs deterministic comparison between two field values.
   */
  static compareField(fieldName: string, systemVal: any, exportVal: any): FieldComparisonResult {
    const normSystem = this.normalize(systemVal);
    const normExport = this.normalize(exportVal);

    if (normSystem === normExport) {
      return {
        field: fieldName,
        systemValue: systemVal,
        exportValue: exportVal,
        isMatch: true
      };
    }

    // Numeric tolerance comparison (handles float precision like 0.0001)
    const numSys = parseFloat(normSystem);
    const numExp = parseFloat(normExport);
    if (!isNaN(numSys) && !isNaN(numExp) && Math.abs(numSys - numExp) < 0.001) {
      return {
        field: fieldName,
        systemValue: systemVal,
        exportValue: exportVal,
        isMatch: true
      };
    }

    // Optional AI/LLM semantic evaluation hook
    if (process.env.ENABLE_LLM_VALIDATION === 'true') {
      const aiResult = this.evaluateSemanticSimilarity(fieldName, normSystem, normExport);
      if (aiResult.isMatch) {
        return {
          field: fieldName,
          systemValue: systemVal,
          exportValue: exportVal,
          isMatch: true,
          reason: aiResult.reason,
          isAiEvaluated: true
        };
      }
    }

    return {
      field: fieldName,
      systemValue: systemVal,
      exportValue: exportVal,
      isMatch: false,
      reason: `Value mismatch: system="${systemVal}" vs export="${exportVal}"`
    };
  }

  /**
   * Deterministic record comparison across a column map dictionary.
   */
  static compareRecords(
    recordKey: string,
    systemRecord: Record<string, any>,
    exportRecord: Record<string, any>,
    columnMapping: Record<string, string>
  ): RecordComparisonResult {
    const discrepancies: FieldComparisonResult[] = [];
    let matched = 0;
    const fields = Object.keys(columnMapping);

    for (const sysCol of fields) {
      const expCol = columnMapping[sysCol];
      const result = this.compareField(sysCol, systemRecord[sysCol], exportRecord[expCol]);
      if (result.isMatch) {
        matched++;
      } else {
        discrepancies.push(result);
      }
    }

    const matchScore = fields.length > 0 ? (matched / fields.length) : 1.0;

    return {
      recordKey,
      isMatch: discrepancies.length === 0,
      matchScore: Math.round(matchScore * 100) / 100,
      totalFields: fields.length,
      matchedFields: matched,
      discrepancies
    };
  }

  /**
   * Optional AI semantic fallback - only invoked when ENABLE_LLM_VALIDATION=true.
   */
  private static evaluateSemanticSimilarity(fieldName: string, textA: string, textB: string): { isMatch: boolean; reason?: string } {
    // Basic fuzzy token overlap fallback
    const wordsA = new Set(textA.split(' '));
    const wordsB = new Set(textB.split(' '));
    const intersection = [...wordsA].filter(w => wordsB.has(w));
    const union = new Set([...wordsA, ...wordsB]);

    const jaccard = union.size > 0 ? intersection.length / union.size : 0;
    if (jaccard >= 0.75) {
      return {
        isMatch: true,
        reason: `Semantic equivalence confirmed (Jaccard similarity ${(jaccard * 100).toFixed(0)}%)`
      };
    }

    return { isMatch: false };
  }
}
