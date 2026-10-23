# POSTMAN API AUTOMATION SUITE — EXTERMINATE FSM V2

This folder contains the complete, ready-to-run API Test Suites, Postman Environment, and Automated Assertions for Exterminate FSM V2 with **automatic token generation & synchronization**.

---

## 📁 Files in This Package

1. **`xterminate_v2_complete_postman_collection.json`**  
   - Complete Postman Collection (v2.1.0) containing **51 canonical endpoints** across **10 modular test suites**.
   - Includes **Suite 01 - Authentication & Verification**:
     - `TC-API-00-A: [POST] /api/v2/auth/login` (Auto token generation & extraction)
     - `TC-API-10: [GET] /api/v2/auth/verify` (Token session verification)
     - `TC-API-00: [POST] /api/v2/auth/logout` (Session revocation)
   - **Automatic Token Lifecycle in Postman**:
     - When `POST /api/v2/auth/login` runs, it dynamically extracts `response.data.token` and automatically sets both `pm.collectionVariables.set('authToken', ...)` and `pm.environment.set('authToken', ...)`.
     - The collection-level Pre-request script checks `authToken`; if missing or expired, it automatically calls the login endpoint before executing the requested test!
     - Automated test assertions on every request:
       - HTTP Status Code Verification (`200/201/204`)
       - Response Time SLA Verification (<= 3000ms)
       - JSON Schema & `status: true` Data Integrity
       - Security Audit: Asserts that internal MySQL queries in `debug.database` are never leaked
       - Dynamic ID chaining across all modules.

2. **`xterminate_v2_postman_environment.json`**  
   - Postman Environment configuration file with pre-configured variables:
     - `baseUrl`: `https://dev-xterminate-v2.businessthrust.com.sg`
     - `adminEmail`: `admin@genicteams.com`
     - `adminPassword`: `y1*eBBD{KIySA7m1`
     - `authToken`: Auto-updated Bearer JWT
     - `customerId`, `jobId`, `supplierId`, `propertyId`, `visitId`

---

## 🚀 How to Import and Run in Postman (GUI)

### Step 1: Import Files into Postman
1. Open **Postman Desktop** (or Postman Web).
2. Click the **"Import"** button in the top-left corner.
3. Drag and drop both files from `data/postman/`:
   - `xterminate_v2_complete_postman_collection.json`
   - `xterminate_v2_postman_environment.json`
4. Postman will automatically create the Collection with all 10 Test Suites and the Environment.

### Step 2: Select Environment
1. In the top-right corner of Postman, click the **Environment Dropdown**.
2. Select **"Xterminate V2 - Dev Environment"**.

### Step 3: Run the Entire Test Suite (Collection Runner)
1. In the left sidebar, click on **"Xterminate V2 - Complete API Test Automation Suite"**.
2. Click the **"Run"** button in the overview panel.
3. Click **"Run Xterminate V2 - Complete API Test Automation Suite"**.
4. **No manual token copying needed**: `TC-API-00-A: [POST] /api/v2/auth/login` runs first and immediately provides the fresh auth token to all remaining 50 requests!

---

## 💻 One-Click CLI Token Refresh & Test Execution

Inside project folder (`C:\Users\Admin\.gemini\antigravity\scratch\Xterminate-v2-automation-tests`):

### 1. Auto-refresh Token in all Files (.env, Postman files, Playwright cache):
```bash
npm run token:refresh
```

### 2. Run API Test Suites via Newman (Postman CLI):
```bash
# Run Suite 01 (Auth Lifecycle):
npx newman run data/postman/xterminate_v2_complete_postman_collection.json -e data/postman/xterminate_v2_postman_environment.json --folder "Suite 01 - Authentication & Verification"

# Run All 10 Postman Suites:
npx newman run data/postman/xterminate_v2_complete_postman_collection.json -e data/postman/xterminate_v2_postman_environment.json
```

### 3. Run Playwright API Automation Suite (52/52 Pass):
```bash
npm run test:canonical-api
```
