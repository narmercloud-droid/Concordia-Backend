import fetch from 'node-fetch';

// Simple smoke test script (not executed here)
// Usage: `ts-node scripts/smokeTest.ts` (requires env vars and network access)

const BASE = process.env.BASE_URL || 'http://localhost:4000';
const API_KEY = process.env.SMOKE_API_KEY || 'test-api-key';

async function run() {
  console.log('Smoke test starting...');

  const health = await fetch(`${BASE}/health`);
  console.log('/health', health.status, await health.text());

  const ready = await fetch(`${BASE}/ready`);
  console.log('/ready', ready.status, await ready.text());

  const version = await fetch(`${BASE}/version`);
  console.log('/version', version.status, await version.text());

  // cached endpoint example (branches)
  const cached = await fetch(`${BASE}/api/branches`, { headers: { 'X-API-KEY': API_KEY } });
  console.log('/api/branches (cached) ', cached.status);

  // authenticated endpoint (mock token)
  const auth = await fetch(`${BASE}/api/v1/customers`, { headers: { Authorization: 'Bearer mock-token' } });
  console.log('/api/v1/customers (auth) ', auth.status);

  console.log('Smoke test completed');
}

run().catch((e) => {
  console.error('Smoke test failed', e);
  process.exit(1);
});
