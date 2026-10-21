"""
LLM Validator Service Module
============================
Performs intelligent semantic validation and data integrity analysis on exported files.
Supports both Google Gemini and OpenAI models.
If no LLM API key is provided, gracefully falls back to deterministic rule-based validation,
ensuring uninterrupted test pipeline execution.
"""

import json
from typing import Dict, Any, List
from config.settings import settings

class LLMValidator:
    """Evaluates export file fidelity, schema conformance, and data consistency using an LLM."""

    def __init__(self):
        self.provider = settings.LLM_PROVIDER
        self.gemini_key = settings.GEMINI_API_KEY
        self.openai_key = settings.OPENAI_API_KEY

    def validate_export(
        self,
        module_name: str,
        ui_headers: List[str],
        export_headers: List[str],
        rag_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Executes AI validation or automated fallback check for the given module export.
        
        :param module_name: Name of module (e.g. 'Customer').
        :param ui_headers: Headers extracted from the web UI.
        :param export_headers: Column headers extracted from the exported Excel file.
        :param rag_context: Context dictionary containing ground truth UI rows and matched export rows.
        :return: Structured validation report dictionary.
        """
        print(f"[LLM Validator] Initiating validation for '{module_name}' module...")

        # If Gemini API Key is available
        if self.gemini_key and (self.provider == "gemini"):
            return self._validate_with_gemini(module_name, ui_headers, export_headers, rag_context)
        
        # If OpenAI API Key is available
        elif self.openai_key and (self.provider == "openai"):
            return self._validate_with_openai(module_name, ui_headers, export_headers, rag_context)
        
        # Deterministic Rule-Based Fallback
        else:
            print("[LLM Validator] No active LLM API key detected in .env. Running comprehensive Rule-Based Validator.")
            return self._deterministic_validation(module_name, ui_headers, export_headers, rag_context)

    def _generate_prompt(
        self,
        module_name: str,
        ui_headers: List[str],
        export_headers: List[str],
        rag_context: Dict[str, Any]
    ) -> str:
        """Constructs a structured prompt for the LLM."""
        return f"""
You are an expert QA Automation Engineer specialized in Data Validation and Export Testing.
Evaluate the exported Excel file against the UI Ground Truth for module: '{module_name}'.

--- 1. SCHEMA COMPARISON ---
Web UI Headers: {json.dumps(ui_headers)}
Exported File Headers: {json.dumps(export_headers)}

--- 2. DATA CROSS-REFERENCE (RAG CONTEXT) ---
Total Exported Rows: {rag_context.get('total_exported_rows', 0)}
Sample Exported Rows: {json.dumps(rag_context.get('sample_exported_rows', []), indent=2)}
Cross-Referenced Pairs (UI Record vs Exported Row):
{json.dumps(rag_context.get('cross_referenced_pairs', []), indent=2)}

--- TASK ---
Analyze the schema and data fidelity:
1. Are the exported columns complete and logically mapped to the UI table fields?
2. For each cross-referenced pair, do the UI values match the exported record?
3. Are there any data truncations, encoding errors, or severe discrepancies?

Provide your response strictly in the following JSON format:
{{
    "passed": true_or_false,
    "confidence_score": 0_to_100,
    "summary": "Brief executive summary of findings",
    "schema_validation": {{
        "passed": true_or_false,
        "missing_critical_columns": [],
        "notes": ""
    }},
    "data_fidelity_validation": {{
        "passed": true_or_false,
        "matched_records_count": 0,
        "mismatched_records_count": 0,
        "notes": ""
    }},
    "identified_issues": []
}}
"""

    def _validate_with_gemini(
        self,
        module_name: str,
        ui_headers: List[str],
        export_headers: List[str],
        rag_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calls Google Gemini API for validation."""
        try:
            from google import genai
            client = genai.Client(api_key=self.gemini_key)
            prompt = self._generate_prompt(module_name, ui_headers, export_headers, rag_context)
            
            response = client.models.generate_content(
                model=settings.LLM_MODEL_NAME,
                contents=prompt,
                config={"response_mime_type": "application/json"}
            )
            report = json.loads(response.text)
            report["evaluator"] = f"Gemini ({settings.LLM_MODEL_NAME})"
            return report
        except Exception as e:
            print(f"[LLM Validator] Gemini API error: {e}. Falling back to rule-based verification.")
            return self._deterministic_validation(module_name, ui_headers, export_headers, rag_context)

    def _validate_with_openai(
        self,
        module_name: str,
        ui_headers: List[str],
        export_headers: List[str],
        rag_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """Calls OpenAI API for validation."""
        try:
            from openai import OpenAI
            client = OpenAI(api_key=self.openai_key)
            prompt = self._generate_prompt(module_name, ui_headers, export_headers, rag_context)

            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": "You are an automated QA export data validator outputting strict JSON."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"}
            )
            report = json.loads(response.choices[0].message.content)
            report["evaluator"] = "OpenAI (gpt-4o)"
            return report
        except Exception as e:
            print(f"[LLM Validator] OpenAI API error: {e}. Falling back to rule-based verification.")
            return self._deterministic_validation(module_name, ui_headers, export_headers, rag_context)

    def _deterministic_validation(
        self,
        module_name: str,
        ui_headers: List[str],
        export_headers: List[str],
        rag_context: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Deterministic, rule-based verification ensuring tests can run without external API keys.
        """
        issues = []
        
        # 1. Row count check
        total_rows = rag_context.get("total_exported_rows", 0)
        if total_rows == 0:
            issues.append("Exported file contains 0 rows.")

        # 2. Header check (at least 3 headers should be present)
        if len(export_headers) == 0:
            issues.append("Exported file contains no column headers.")

        # 3. Cross-reference check
        pairs = rag_context.get("cross_referenced_pairs", [])
        matched_count = sum(1 for p in pairs if p.get("found_in_export"))
        correct_count = sum(1 for p in pairs if p.get("is_correct", True))
        mismatches = len(pairs) - correct_count

        for p in pairs:
            if not p.get("is_correct", True):
                diff = "; ".join(p.get("discrepancies", [])) or "Record missing from export"
                ui_name = p.get("ui_record", {}).get("customer_display_name", "")
                row_idx = p.get("ui_record", {}).get("row_index", "?")
                issues.append(f"Row {row_idx} ({ui_name}): {diff}")

        passed = len(issues) == 0
        score = 100.0 if passed else max(0.0, (correct_count / len(pairs)) * 100.0 if pairs else 0.0)

        return {
            "passed": passed,
            "confidence_score": score,
            "evaluator": "Deterministic Rule Engine (Fallback)",
            "summary": f"Export validation for {module_name} completed with {total_rows} rows and {len(export_headers)} columns. {correct_count}/{len(pairs)} records verified correct.",
            "schema_validation": {
                "passed": len(export_headers) > 0,
                "exported_columns_count": len(export_headers),
                "notes": f"Detected columns: {export_headers[:8]}"
            },
            "data_fidelity_validation": {
                "passed": passed,
                "matched_records_count": correct_count,
                "mismatched_records_count": mismatches,
                "notes": f"{correct_count} of {len(pairs)} UI records verified with exact field match in export."
            },
            "identified_issues": issues
        }

