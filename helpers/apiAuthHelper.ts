import * as fs from 'fs';
import * as path from 'path';
import { APIRequestContext } from '@playwright/test';

/**
 * API Authentication Helper
 * ==========================
 * Automatically handles persistent file-cached JWT Bearer tokens,
 * concurrency-safe sharing across multi-worker Playwright processes,
 * and rate-limit throttle protection for v2 API tests.
 */

export const BASE_URL = process.env.BASE_URL || 'https://dev-xterminate-v2.businessthrust.com.sg';
export const AUTH_EMAIL = process.env.ADMIN_EMAIL || process.env.ADMIN_USERNAME || 'admin@genicteams.com';
export const AUTH_PASSWORD = process.env.ADMIN_PASSWORD || '';

const AUTH_DIR = path.join(__dirname, '..', '.auth');
const TOKEN_CACHE_FILE = path.join(AUTH_DIR, 'api_token.json');

interface CachedTokenData {
  token: string;
  expiresAt: number;
}

function readTokenFromDisk(): string | null {
  try {
    if (fs.existsSync(TOKEN_CACHE_FILE)) {
      const raw = fs.readFileSync(TOKEN_CACHE_FILE, 'utf8');
      const data: CachedTokenData = JSON.parse(raw);
      // Valid if more than 5 minutes remain
      if (data.token && Date.now() < data.expiresAt - 300000) {
        return data.token;
      }
    }
  } catch {
    // Ignore read errors
  }
  return null;
}

function writeTokenToDisk(token: string, expiresInSeconds: number): void {
  try {
    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }
    const data: CachedTokenData = {
      token,
      expiresAt: Date.now() + (expiresInSeconds * 1000)
    };
    fs.writeFileSync(TOKEN_CACHE_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // Ignore write errors
  }
}

/**
 * Returns a valid JWT Bearer token, leveraging file cache across all workers.
 */
export async function getAuthToken(request: APIRequestContext, forceRefresh = false): Promise<string> {
  if (!forceRefresh) {
    const diskToken = readTokenFromDisk();
    if (diskToken) {
      return diskToken;
    }
  }

  // Handle multi-worker concurrency and 429 rate limiter protection
  for (let attempt = 1; attempt <= 4; attempt++) {
    const existing = readTokenFromDisk();
    if (existing && !forceRefresh) {
      return existing;
    }

    const res = await request.post(`${BASE_URL}/api/v2/auth/login`, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      data: {
        email: AUTH_EMAIL,
        password: AUTH_PASSWORD,
        client: 'web'
      }
    });

    if (res.status() === 429) {
      // Another worker triggered rate limiter; back off and re-check cache
      await new Promise(r => setTimeout(r, 2000 + Math.random() * 1500));
      const retryDisk = readTokenFromDisk();
      if (retryDisk) return retryDisk;
      continue;
    }

    if (!res.ok()) {
      throw new Error(`API Login failed with status ${res.status()}: ${await res.text()}`);
    }

    const json = await res.json();
    if (json.status && json.data?.token) {
      const token = json.data.token;
      const expiresIn = json.data.expires_in || 3600;
      writeTokenToDisk(token, expiresIn);
      return token;
    }
  }

  throw new Error('Failed to acquire API auth token after retries');
}

/**
 * Returns standard authentication headers with a valid Bearer token.
 */
export async function getAuthHeaders(request: APIRequestContext): Promise<{ [key: string]: string }> {
  const token = await getAuthToken(request);
  return {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}
