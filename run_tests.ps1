param(
    [string]$Module = ""
)

# Helper script to refresh PATH and execute export tests with HTML reports
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","User") + ";" + [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";C:\Users\BT-Amaan\scoop\apps\python\current\Scripts;C:\Users\BT-Amaan\scoop\apps\python\current"

if ($Module -eq "customer") {
    python -m pytest tests/test_customer_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "quotation") {
    python -m pytest tests/test_quotation_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "invoice") {
    python -m pytest tests/test_invoice_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "payment") {
    python -m pytest tests/test_payment_export.py -s -v --html=reports/pytest_report.html --self-contained-html
} elseif ($Module -eq "all") {
    python -m pytest tests/ -s -v --html=reports/pytest_report.html --self-contained-html
} else {
    if ($args.Count -eq 0) {
        python -m pytest tests/test_quotation_export.py -s -v --html=reports/pytest_report.html --self-contained-html
    } else {
        python -m pytest $args --html=reports/pytest_report.html --self-contained-html
    }
}
