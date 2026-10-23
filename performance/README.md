# Performance & Load Testing Suite (Apache JMeter)

Enterprise load, stress, and endurance testing for the **Xterminate V2 Business Thrust ERP** backend.

---

## 🎯 Scope of Testing
The load test plan [`performance/jmeter/xterminate_v2_load_test.jmx`](file:///c:/Users/Admin/.gemini/antigravity/scratch/Xterminate-v2-automation-tests/performance/jmeter/xterminate_v2_load_test.jmx) covers high-traffic transactions:
1. `01_Auth_Login`: Dynamic JWT authentication & token extraction.
2. `02_Customer_Listing`: Heavy paginated customer data queries.
3. `03_Customer_Summary`: Real-time dashboard KPI aggregations.
4. `04_Visit_Options`: Visit creation pre-flight configuration payloads.
5. `05_Quotation_Listing`: Quotation financial queries.
6. `06_Invoice_Listing`: Invoice ledger queries.
7. `07_Global_Search`: High-load universal multi-module search.

---

## ⚙️ SLA Threshold Assertions
- **HTTP Success Rate**: > 99.0% (Zero unhandled 5xx errors).
- **Latency SLA**: 95th Percentile response time < 3500ms under load.
- **Max Response Duration**: Hard cap < 4000ms.

---

## 🚀 Execution Instructions

### 1. Run Non-GUI Load Test via PowerShell
```powershell
# Default run: 25 concurrent virtual users, 15s ramp-up, 2 loops
.\performance\run_jmeter_test.ps1

# High Load: 50 concurrent virtual users, 30s ramp-up, 5 loops
.\performance\run_jmeter_test.ps1 -Threads 50 -RampUp 30 -Loops 5

# Custom JMeter installation path:
.\performance\run_jmeter_test.ps1 -JMeterPath "C:\apache-jmeter\bin\jmeter.bat" -Threads 50
```

### 2. Run Direct CLI Command
```bash
jmeter -n -t performance/jmeter/xterminate_v2_load_test.jmx \
  -l reports/performance/jmeter_results.jtl \
  -e -o reports/performance/html_report \
  -Jthreads=50 -Jrampup=30 -Jloops=5
```

### 3. View Interactive Dashboard Report
After completion, open the generated HTML dashboard:
`reports/performance/html_report/index.html`
It includes:
- APDEX (Application Performance Index) rating
- Response Times Over Time
- Latencies vs Throughput (Requests per Second)
- Error Breakdown by Response Code
