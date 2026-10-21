"""
RAG Engine Module (Retrieval-Augmented Generation for Export Verification)
=========================================================================
Indexes exported records and provides semantic/keyword retrieval so that large
datasets (thousands of rows) can be selectively queried and fed into the LLM
without context window overflows.

Key capabilities:
1. Chunks tabular records into searchable document units.
2. Retrieves exact or relevant rows corresponding to Ground Truth UI items.
3. Constructs structured context blocks ready for LLM prompt injection.
"""

from typing import List, Dict, Any, Optional

class ExportRAGEngine:
    """Manages indexing and targeted retrieval of exported dataset records."""

    def __init__(self, records: List[Dict[str, Any]]):
        """
        Initialize the RAG engine with parsed records from the export file.
        :param records: List of record dictionaries parsed from Excel/CSV.
        """
        self.records = records
        self.indexed_documents = self._build_index(records)
        print(f"[RAG Engine] Indexed {len(self.records)} exported records.")

    def _build_index(self, records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Creates searchable representations for each row with normalized text keys.
        """
        indexed = []
        for idx, row in enumerate(records):
            # Flatten row values into a single searchable text string
            searchable_text = " | ".join(f"{k}: {v}" for k, v in row.items() if v != "")
            indexed.append({
                "row_number": idx + 2,  # accounting for 1-based index + header row in Excel
                "data": row,
                "text": searchable_text.lower()
            })
        return indexed

    def retrieve_by_query(self, query: str, top_k: int = 5) -> List[Dict[str, Any]]:
        """
        Retrieves top matching records for a given search query (e.g. customer name or email).
        
        :param query: Search string to match.
        :param top_k: Number of candidate rows to return.
        :return: List of top matching record dictionaries.
        """
        query_terms = [t.lower().strip() for t in query.split() if len(t.strip()) > 1]
        scored_matches = []

        for doc in self.indexed_documents:
            score = 0
            doc_text = doc["text"]
            for term in query_terms:
                if term in doc_text:
                    score += 1
            if score > 0:
                scored_matches.append((score, doc))

        # Sort by relevance score descending
        scored_matches.sort(key=lambda x: x[0], reverse=True)
        results = [item[1]["data"] for item in scored_matches[:top_k]]
        return results

    def retrieve_ground_truth_matches(self, ui_records: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """
        Cross-references each UI record against the exported dataset and returns matched pairs.
        Uses exact primary key (New Customer Code) first, then exact Customer Display Name,
        then fallback to semantic retrieval.
        
        :param ui_records: List of records scraped from the web page UI.
        :return: List of comparison pairs {"ui_record": ..., "exported_match": ..., "field_discrepancies": [...]}.
        """
        comparison_pairs = []

        for ui_rec in ui_records:
            ui_code = (ui_rec.get("customer_code") or "").strip()
            ui_name = (ui_rec.get("customer_display_name") or "").strip()
            exported_match = None

            # 1. Primary Key Match: New Customer Code
            if ui_code:
                for doc in self.indexed_documents:
                    ex_code = str(doc["data"].get("New Customer Code", "")).strip()
                    if ex_code == ui_code:
                        exported_match = doc["data"]
                        break

            # 2. Exact Name Match (especially for individuals without customer codes)
            if not exported_match and ui_name:
                for doc in self.indexed_documents:
                    ex_name = str(doc["data"].get("Customer Display Name", "")).strip()
                    if ex_name.lower() == ui_name.lower():
                        exported_match = doc["data"]
                        break

            # 3. Fallback to keyword/semantic query
            if not exported_match:
                search_key = ui_name or ui_rec.get("company_name", "")
                matches = self.retrieve_by_query(search_key, top_k=1)
                exported_match = matches[0] if matches else None

            # Analyze field-by-field discrepancies
            diffs = []
            if exported_match:
                ex_type = str(exported_match.get("Type", "")).strip()
                ex_name = str(exported_match.get("Customer Display Name", "")).strip()
                ex_code = str(exported_match.get("New Customer Code", "")).strip()
                ui_type = str(ui_rec.get("type", "")).strip()

                if ui_type and ex_type and ui_type.lower() != ex_type.lower() and ex_type != "nan":
                    diffs.append(f"Type mismatch: UI='{ui_type}' vs Excel='{ex_type}'")
                if ui_name and ex_name and ui_name.lower() != ex_name.lower():
                    diffs.append(f"Name mismatch: UI='{ui_name}' vs Excel='{ex_name}'")
                if ui_code and ex_code and ex_code != "nan" and ui_code != ex_code:
                    diffs.append(f"Code mismatch: UI='{ui_code}' vs Excel='{ex_code}'")

            is_correct = (exported_match is not None and len(diffs) == 0)

            comparison_pairs.append({
                "ui_record": ui_rec,
                "exported_match": exported_match,
                "found_in_export": exported_match is not None,
                "is_correct": is_correct,
                "discrepancies": diffs
            })

        found_count = sum(1 for p in comparison_pairs if p["found_in_export"])
        correct_count = sum(1 for p in comparison_pairs if p["is_correct"])
        print(f"[RAG Engine] Matched {found_count}/{len(ui_records)} UI records. Field-level Correct: {correct_count}/{len(ui_records)}.")
        return comparison_pairs

    def build_llm_context(self, comparison_pairs: List[Dict[str, Any]], sample_export_rows: int = 5) -> Dict[str, Any]:
        """
        Builds a concise, structured prompt context containing comparison pairs and schema samples.
        """
        return {
            "total_exported_rows": len(self.records),
            "sample_exported_rows": self.records[:sample_export_rows],
            "cross_referenced_pairs": comparison_pairs
        }

