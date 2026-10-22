"""
Base Validator — Shared Field Normalization & Date Utilities
=============================================================
All domain-specific validators (FullDatasetValidator, InvoiceValidator,
QuotationValidator, PaymentValidator, VisitValidator) extend this class
to inherit shared helpers, eliminating ~5x duplicated normalize/date methods.
"""

from __future__ import annotations

from typing import Any, Tuple
import pandas as pd


class BaseValidator:
    """Shared normalization, date-parsing, and comparison primitives."""

    # ------------------------------------------------------------------
    # String / Value Normalization
    # ------------------------------------------------------------------

    @staticmethod
    def normalize_val(val: Any) -> str:
        """
        Sanitizes any value for string comparison:
        - Returns '' for None, NaN, 'nan', 'none', 'null'
        - Strips surrounding whitespace
        """
        if val is None:
            return ""
        try:
            if pd.isna(val):
                return ""
        except (TypeError, ValueError):
            pass
        s = str(val).strip()
        if s.lower() in ("nan", "none", "null"):
            return ""
        return s

    # ------------------------------------------------------------------
    # Date Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def parse_date_dmy(d_str: Any) -> str:
        """
        Converts YYYY-MM-DD (or ISO datetime) into DD/MM/YYYY.
        Returns the original string unchanged if it cannot be parsed.
        """
        if not d_str:
            return ""
        s = str(d_str).split(" ")[0].strip()
        if "-" in s:
            parts = s.split("-")
            if len(parts) == 3:
                return f"{parts[2]}/{parts[1]}/{parts[0]}"
        return s

    @staticmethod
    def format_created_dmy_hm(d_str: Any) -> str:
        """
        Converts 'YYYY-MM-DD HH:MM:SS' → 'DD/MM/YYYY HH:MM'.
        Useful for Created-timestamp comparisons.
        """
        if not d_str:
            return ""
        parts = str(d_str).strip().split(" ")
        date_part = BaseValidator.parse_date_dmy(parts[0])
        time_part = parts[1][:5] if len(parts) > 1 else ""
        return f"{date_part} {time_part}".strip()

    # ------------------------------------------------------------------
    # Generic Phone / Email Helpers
    # ------------------------------------------------------------------

    @staticmethod
    def normalize_phone(phone: str) -> str:
        """Strips spaces, dashes, and plus signs for phone comparison."""
        return phone.replace(" ", "").replace("-", "").replace("+", "").lower()

    # ------------------------------------------------------------------
    # Column Health Calculator
    # ------------------------------------------------------------------

    @staticmethod
    def build_column_health(
        column_stats: dict,
        match_key: str = "match",
        mismatch_key: str = "mismatch",
        pct_key: str = "match_pct",
        default_pct: float = 100.0,
    ) -> dict:
        """
        Converts raw {col: {match: N, mismatch: M}} stats into
        {col: {match: N, mismatch: M, match_pct: P}} health report.

        Args:
            column_stats:  Dict of column -> {match_key: int, mismatch_key: int}.
            match_key:     Key for match count in column_stats (default 'match').
            mismatch_key:  Key for mismatch count (default 'mismatch').
            pct_key:       Key to use for percentage in the output dict.
            default_pct:   Percentage returned when no records were compared.
        """
        column_health = {}
        for col, st in column_stats.items():
            m = st.get(match_key, 0)
            mm = st.get(mismatch_key, 0)
            tot = m + mm
            pct = round((m / tot * 100), 2) if tot > 0 else default_pct
            column_health[col] = {
                match_key: m,
                mismatch_key: mm,
                pct_key: pct,
            }
        return column_health
