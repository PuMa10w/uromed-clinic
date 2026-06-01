import { defineConfig } from '@playwright/test';

const auditBaseUrl = process.env.MOBILE_AUDIT_BASE_URL || '';
const usesExternalAuditTarget = auditBaseUrl
  && !auditBaseUrl.includes('127.0.0.1')
  && !auditBaseUrl.includes('localhost');

const config = {
  testDir: './tests',
};

if (!usesExternalAuditTarget) {
  config.webServer = {
    command: 'npm run preview -- --host 127.0.0.1 --port 5175',
    url: 'http://127.0.0.1:5175',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  };
}

export default defineConfig(config);
