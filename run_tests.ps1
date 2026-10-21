param(
    [string]$Module = ""
)

# Resolve Python executable (prefer local workspace .venv, fallback to user install)
$PythonExe = "python"
if (Test-Path "$PSScriptRoot\.venv\Scripts\python.exe") {
    $PythonExe = "$PSScriptRoot\.venv\Scripts\python.exe"
} elseif (Test-Path "$env:LOCALAPPDATA\Python\pythoncore-3.15-64\python.exe") {
    $PythonExe = "$env:LOCALAPPDATA\Python\pythoncore-3.15-64\python.exe"
} elseif (Test-Path "$env:LOCALAPPDATA\Python\bin\python.exe") {
    $PythonExe = "$env:LOCALAPPDATA\Python\bin\python.exe"
}

if ($Module -eq "visit") {
    & $PythonExe -m pytest tests/test_visit_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "customer") {
    & $PythonExe -m pytest tests/test_customer_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "quotation") {
    & $PythonExe -m pytest tests/test_quotation_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "invoice") {
    & $PythonExe -m pytest tests/test_invoice_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "payment") {
    & $PythonExe -m pytest tests/test_payment_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "all") {
    & $PythonExe -m pytest tests/ -s -v --html=reports/pytest_report.html --self-contained-html
} else {
    if ($args.Count -eq 0) {
        & $PythonExe -m pytest tests/test_visit_export.py -s -v --html=reports/pytest_report.html --self-contained-html
    } else {
        & $PythonExe -m pytest $args --html=reports/pytest_report.html --self-contained-html
    }
}
