/**
 * @file client/scripts/post-deploy-verify.mjs
 * @description Automated post-deployment smoke test suite for Astraiv Client Website.
 * Validates HTTP status, critical asset accessibility, and edge CDN routing.
 */

const TARGET_URL = (process.env.DEPLOYMENT_URL || 'https://www.astraivtechnologies.com').replace(/\/$/, '');

console.log(`[Smoke Test] Starting post-deployment verification against: ${TARGET_URL}`);

const CRITICAL_CHECKS = [
  { path: '/en', expectedStatus: 200, name: 'Homepage' },
  { path: '/en/careers', expectedStatus: 200, name: 'Careers Listing' },
  { path: '/images/careers-hero.jpg', expectedStatus: 200, name: 'Careers Hero Image' },
  { path: '/en/services', expectedStatus: 200, name: 'Services Catalog' },
  { path: '/en/solutions', expectedStatus: 200, name: 'Solutions Catalog' },
  { path: '/en/industries', expectedStatus: 200, name: 'Industries Catalog' },
  { path: '/en/insights', expectedStatus: 200, name: 'Insights Overview' },
  { path: '/en/insights/blog', expectedStatus: 200, name: 'Dedicated Blog View' },
  { path: '/en/contact', expectedStatus: 200, name: 'Contact Form' },
  { path: '/en/start-project', expectedStatus: 200, name: 'Start a Project Wizard' }
];

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifyEndpoint(endpoint, attempt = 1, maxAttempts = 5) {
  const fullUrl = `${TARGET_URL}${endpoint.path}`;
  try {
    const res = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Astraiv-PostDeploy-SmokeTest/1.0'
      }
    });

    const isMatch = res.status === endpoint.expectedStatus;
    const vercelId = res.headers.get('x-vercel-id') || 'N/A';

    if (isMatch) {
      console.log(`  ✓ [PASS] ${endpoint.name} (${endpoint.path}) -> Status: ${res.status} (Vercel-ID: ${vercelId})`);
      return true;
    }

    if (attempt < maxAttempts) {
      console.warn(`  ⚠ [RETRY ${attempt}/${maxAttempts}] ${endpoint.name} returned status ${res.status} (expected ${endpoint.expectedStatus}). Waiting 4s for edge propagation...`);
      await wait(4000);
      return verifyEndpoint(endpoint, attempt + 1, maxAttempts);
    }

    console.error(`  ✗ [FAIL] ${endpoint.name} (${endpoint.path}) -> Expected ${endpoint.expectedStatus}, got ${res.status}`);
    return false;
  } catch (err) {
    if (attempt < maxAttempts) {
      console.warn(`  ⚠ [RETRY ${attempt}/${maxAttempts}] ${endpoint.name} network error: ${err.message}. Retrying in 4s...`);
      await wait(4000);
      return verifyEndpoint(endpoint, attempt + 1, maxAttempts);
    }
    console.error(`  ✗ [FAIL] ${endpoint.name} (${endpoint.path}) -> Network error: ${err.message}`);
    return false;
  }
}

async function run() {
  console.log(`[Smoke Test] Waiting 5 seconds for edge CDN cache invalidation & routing propagation...`);
  await wait(5000);

  let passed = 0;
  let failed = 0;

  for (const check of CRITICAL_CHECKS) {
    const ok = await verifyEndpoint(check);
    if (ok) passed++;
    else failed++;
  }

  console.log(`\n[Smoke Test Summary] Passed: ${passed}/${CRITICAL_CHECKS.length}, Failed: ${failed}`);

  if (failed > 0) {
    console.error(`[Smoke Test] POST-DEPLOYMENT VERIFICATION FAILED. Critical routes did not meet health criteria.`);
    process.exit(1);
  }

  console.log(`[Smoke Test] ALL CRITICAL ROUTES AND ASSETS VERIFIED HEALTHY.`);
  process.exit(0);
}

run();
