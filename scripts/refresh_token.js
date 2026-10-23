const fs = require('fs');
const path = require('path');
const https = require('https');

const BASE_URL = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';
const EMAIL = process.env.ADMIN_EMAIL || 'admin@genicteams.com';
const PASSWORD = process.env.ADMIN_PASSWORD || 'y1*eBBD{KIySA7m1';

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_FILE = path.join(PROJECT_ROOT, '.env');
const AUTH_JSON_FILE = path.join(PROJECT_ROOT, '.auth', 'api_token.json');
const POSTMAN_ENV_FILE = path.join(PROJECT_ROOT, 'data', 'postman', 'xterminate_v2_postman_environment.json');
const POSTMAN_COL_FILE = path.join(PROJECT_ROOT, 'data', 'postman', 'xterminate_v2_complete_postman_collection.json');

console.log(`[Token Refresh] Requesting new token for ${EMAIL} from ${BASE_URL}...`);

const payload = JSON.stringify({
  email: EMAIL,
  password: PASSWORD,
  fcm_token: null,
  device_info: null,
  client: 'web'
});

const url = new URL(`${BASE_URL}/api/v2/auth/login`);

const req = https.request({
  hostname: url.hostname,
  port: url.port || 443,
  path: url.pathname,
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(payload)
  }
}, (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    if (res.statusCode !== 200) {
      console.error(`[Error] Login API failed with status ${res.statusCode}: ${data}`);
      process.exit(1);
    }

    try {
      const response = JSON.parse(data);
      if (!response.status || !response.data || !response.data.token) {
        console.error('[Error] Unexpected response payload:', response);
        process.exit(1);
      }

      const token = response.data.token;
      const expiresIn = response.data.expires_in || 3600;
      console.log(`[Success] Retrieved new token (Expires in ${expiresIn}s):`);
      console.log(`Token prefix: ${token.substring(0, 30)}...`);

      // 1. Update .env
      if (fs.existsSync(ENV_FILE)) {
        let envContent = fs.readFileSync(ENV_FILE, 'utf8');
        if (envContent.includes('AUTH_BEARER_TOKEN=')) {
          envContent = envContent.replace(/AUTH_BEARER_TOKEN=.*/g, `AUTH_BEARER_TOKEN=${token}`);
        } else {
          envContent += `\nAUTH_BEARER_TOKEN=${token}\n`;
        }
        fs.writeFileSync(ENV_FILE, envContent, 'utf8');
        console.log(` [Updated] .env file with fresh AUTH_BEARER_TOKEN`);
      }

      // 2. Update .auth/api_token.json
      const authDir = path.dirname(AUTH_JSON_FILE);
      if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
      }
      fs.writeFileSync(AUTH_JSON_FILE, JSON.stringify({
        token: token,
        expiresAt: Date.now() + (expiresIn * 1000),
        updatedAt: new Date().toISOString()
      }, null, 2), 'utf8');
      console.log(` [Updated] .auth/api_token.json cache for Playwright tests`);

      // 3. Update Postman Environment
      if (fs.existsSync(POSTMAN_ENV_FILE)) {
        const envJson = JSON.parse(fs.readFileSync(POSTMAN_ENV_FILE, 'utf8'));
        let found = false;
        if (Array.isArray(envJson.values)) {
          for (const item of envJson.values) {
            if (item.key === 'authToken') {
              item.value = token;
              found = true;
            }
          }
          if (!found) {
            envJson.values.push({
              key: 'authToken',
              value: token,
              type: 'secret',
              enabled: true
            });
          }
        }
        fs.writeFileSync(POSTMAN_ENV_FILE, JSON.stringify(envJson, null, 2), 'utf8');
        console.log(` [Updated] data/postman/xterminate_v2_postman_environment.json`);
      }

      // 4. Update Postman Collection variables
      if (fs.existsSync(POSTMAN_COL_FILE)) {
        const colJson = JSON.parse(fs.readFileSync(POSTMAN_COL_FILE, 'utf8'));
        if (Array.isArray(colJson.variable)) {
          for (const item of colJson.variable) {
            if (item.key === 'authToken') {
              item.value = token;
            }
          }
        }
        fs.writeFileSync(POSTMAN_COL_FILE, JSON.stringify(colJson, null, 2), 'utf8');
        console.log(` [Updated] data/postman/xterminate_v2_complete_postman_collection.json variables`);
      }

      console.log(`\nAll files updated with the latest auth token successfully!`);
    } catch (err) {
      console.error('[Error] Failed to parse response or write files:', err);
      process.exit(1);
    }
  });
});

req.on('error', (err) => {
  console.error('[Error] Network error:', err.message);
  process.exit(1);
});

req.write(payload);
req.end();
