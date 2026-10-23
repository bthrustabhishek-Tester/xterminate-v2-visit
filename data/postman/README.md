# POSTMAN API AUTOMATION SUITE — EXTERMINATE FSM V2

This folder contains the complete, ready-to-run API Test Suites, Postman Environment, and Automated Assertions for Exterminate FSM V2.

---

## 📁 Files in This Package

1. **`xterminate_v2_complete_postman_collection.json`**  
   - Complete Postman Collection (v2.1.0) containing **49 canonical endpoints** divided into **10 modular test suites**.
   - Includes **embedded collection-level variables** (`baseUrl`, `customerId`, `jobId`, `supplierId`, etc.) so it works out-of-the-box even without a separate environment.
   - Includes pre-request scripts and automated test assertions:
     - HTTP Status Code Verification (`200/201/204`)
     - Response Time SLA Verification
     - JSON Schema & `status: true` Verification
     - Security Audit: Asserts that internal MySQL queries in `debug.database` are not leaked
     - Dynamic ID chaining across requests.

2. **`xterminate_v2_postman_environment.json`**  
   - Postman Environment configuration file with pre-configured variables:
     - `baseUrl`: `https://dev-xterminate-v2.businessthrust.com.sg`
     - `customerId`, `jobId`, `supplierId`, `propertyId`, `visitId`
     - `authToken`, `sessionCookie`

---

## 🚀 How to Import and Run in Postman (GUI)

### Step 1: Import Files into Postman
1. Open **Postman Desktop** (or Postman Web).
2. Click the **"Import"** button in the top-left corner.
3. Drag and drop both files:
   - `xterminate_v2_complete_postman_collection.json`
   - `xterminate_v2_postman_environment.json`
4. Postman will automatically create the Collection with all 10 Test Suites and the Environment.

### Step 2: Select Environment
1. In the top-right corner of Postman, click the **Environment Dropdown**.
2. Select **"Xterminate V2 - Dev Environment"**.
3. (Optional) If you have an active browser session cookie, paste it into the `sessionCookie` variable.

### Step 3: Run the Entire Test Suite (Collection Runner)
1. In the left sidebar, click on **"Xterminate V2 - Complete API Test Automation Suite"**.
2. Click the **"Run"** button in the overview panel.
3. Select which suites or all 10 suites you want to run.
4. Click **"Run Xterminate V2 - Complete API Test Automation Suite"**.
5. Postman will execute all requests, evaluate all test assertions, and display a comprehensive pass/fail dashboard with response times!

---

## 💻 How to Run from Terminal / CLI (using Newman)

You can run the entire collection from the command line without opening Postman:

```bash
# 1. Install or run newman via npx:
npx newman run data/postman/xterminate_v2_complete_postman_collection.json -e data/postman/xterminate_v2_postman_environment.json

# 2. Run with rich HTML report generation:
npx newman run data/postman/xterminate_v2_complete_postman_collection.json -e data/postman/xterminate_v2_postman_environment.json --reporters cli,html --reporter-html-export reports/newman-api-report.html
```
