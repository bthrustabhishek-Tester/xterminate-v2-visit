"""
File Parser Service Module
==========================
Responsible for reading and extracting structured content from exported documents
(.xlsx, .xls, .csv, .pdf). Converts raw tabular files into structured DataFrames
and JSON dictionaries for downstream RAG indexing and LLM verification.
"""

from pathlib import Path
from typing import Dict, Any, List
import pandas as pd

class FileParser:
    """Extracts and normalizes data from downloaded export files."""

    @staticmethod
    def parse_excel(file_path: Path) -> Dict[str, Any]:
        """
        Parses an Excel (.xlsx/.xls) file into structured tabular data and metadata.
        
        :param file_path: Path to the downloaded Excel file.
        :return: Dictionary containing sheet names, column headers, row counts, and records.
        """
        path = Path(file_path)
        if not path.exists():
            raise FileNotFoundError(f"Export file does not exist at: {path}")

        print(f"[FileParser] Parsing Excel file: {path.name}")
        excel_file = pd.ExcelFile(path)
        sheet_names = excel_file.sheet_names
        print(f"[FileParser] Found {len(sheet_names)} sheet(s): {sheet_names}")

        result_sheets = {}
        for sheet in sheet_names:
            df = pd.read_excel(path, sheet_name=sheet)
            
            # Clean column names (strip whitespace and standard formatting)
            df.columns = [str(c).strip() for c in df.columns]
            
            # Fill NaN values with empty strings for clean JSON serialization
            records = df.fillna("").to_dict(orient="records")

            result_sheets[sheet] = {
                "columns": list(df.columns),
                "row_count": len(df),
                "records": records,
                "dataframe": df
            }
            print(f"[FileParser] Sheet '{sheet}': {len(df)} rows, {len(df.columns)} columns")

        primary_sheet = sheet_names[0]
        return {
            "file_name": path.name,
            "file_path": str(path),
            "file_size_bytes": path.stat().st_size,
            "sheets": sheet_names,
            "primary_sheet": primary_sheet,
            "columns": result_sheets[primary_sheet]["columns"],
            "row_count": result_sheets[primary_sheet]["row_count"],
            "records": result_sheets[primary_sheet]["records"],
            "dataframe": result_sheets[primary_sheet]["dataframe"]
        }

    @staticmethod
    def parse_csv(file_path: Path) -> Dict[str, Any]:
        """Parses a CSV export file into structured tabular format."""
        path = Path(file_path)
        df = pd.read_csv(path)
        df.columns = [str(c).strip() for c in df.columns]
        records = df.fillna("").to_dict(orient="records")
        return {
            "file_name": path.name,
            "file_path": str(path),
            "columns": list(df.columns),
            "row_count": len(df),
            "records": records,
            "dataframe": df
        }

