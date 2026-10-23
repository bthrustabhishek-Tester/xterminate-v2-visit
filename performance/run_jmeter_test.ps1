<#
.SYNOPSIS
    Runs the Xterminate V2 JMeter Performance & Load Test Suite in Non-GUI Mode.

.DESCRIPTION
    Executes the performance test plan, collects performance metrics,
    and builds an interactive HTML dashboard report.

.PARAMETER Threads
    Number of concurrent virtual users (default: 25)

.PARAMETER RampUp
    Ramp-up period in seconds (default: 15)

.PARAMETER Loops
    Iteration loop count per thread (default: 2)

.EXAMPLE
    .\performance\run_jmeter_test.ps1 -Threads 50 -RampUp 30 -Loops 5
#>

param(
    [int]$Threads = 25,
    [int]$RampUp = 15,
    [int]$Loops = 2,
    [string]$JMeterPath = "jmeter"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Resolve-Path "$ScriptDir\.."
$JmxFile = "$ScriptDir\jmeter\xterminate_v2_load_test.jmx"
$ReportsDir = "$ProjectRoot\reports\performance"
$CsvResult = "$ReportsDir\jmeter_results.jtl"
$HtmlDashboardDir = "$ReportsDir\html_report"

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host " 🚀 XTERMINATE V2 JMETER PERFORMANCE & LOAD TEST RUNNER" -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "Concurrency (Threads) : $Threads" -ForegroundColor Yellow
Write-Host "Ramp-up (Seconds)     : $RampUp" -ForegroundColor Yellow
Write-Host "Loop Iterations       : $Loops" -ForegroundColor Yellow
Write-Host "Test Plan             : $JmxFile" -ForegroundColor Yellow
Write-Host "Dashboard Output      : $HtmlDashboardDir" -ForegroundColor Yellow
Write-Host "----------------------------------------------------------"

# Ensure reports directory exists
if (-not (Test-Path $ReportsDir)) {
    New-Item -ItemType Directory -Path $ReportsDir -Force | Out-Null
}

# Clean previous report runs
if (Test-Path $CsvResult) { Remove-Item $CsvResult -Force }
if (Test-Path $HtmlDashboardDir) { Remove-Item $HtmlDashboardDir -Recurse -Force }

# Check for JMeter executable
$JMeterCmd = Get-Command $JMeterPath -ErrorAction SilentlyContinue
if (-not $JMeterCmd) {
    Write-Warning "Apache JMeter executable '$JMeterPath' was not found in PATH."
    Write-Host "Please ensure Apache JMeter is installed (https://jmeter.apache.org/download_jmeter.cgi) or provide the path:" -ForegroundColor Yellow
    Write-Host "Example: .\performance\run_jmeter_test.ps1 -JMeterPath 'C:\tools\apache-jmeter\bin\jmeter.bat'" -ForegroundColor Gray
    exit 1
}

# Execute JMeter in non-GUI mode
$ArgsList = @(
    "-n",
    "-t", $JmxFile,
    "-l", $CsvResult,
    "-e",
    "-o", $HtmlDashboardDir,
    "-Jthreads=$Threads",
    "-Jrampup=$RampUp",
    "-Jloops=$Loops"
)

Write-Host "Starting JMeter execution..." -ForegroundColor Green
& $JMeterPath $ArgsList

if ($LASTEXITCODE -eq 0) {
    Write-Host "Performance test finished successfully!" -ForegroundColor Green
    Write-Host "Report generated at: $HtmlDashboardDir\index.html" -ForegroundColor Cyan
} else {
    Write-Error "JMeter test execution failed with exit code $LASTEXITCODE."
}
