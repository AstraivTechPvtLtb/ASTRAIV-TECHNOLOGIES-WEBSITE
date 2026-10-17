/**
 * @file client/scripts/post-deploy-verify.mjs
 * @description Automated post-deployment smoke test suite for Astraiv Client Website.
 * Validates HTTP status, critical asset accessibility, and edge CDN routing.
 */

const TARGET_URL = (process.env.DEPLOYMENT_URL || 'https://www.astraivtechnologies.com').replace(/\/$/, '');
const DIRECT_URL = (process.env.DIRECT_DEPLOYMENT_URL || '').replace(/\/$/, '');

console.log(`[Smoke Test] Starting post-deployment verification.`);
console.log(`  Target URL: ${TARGET_URL}`);
if (DIRECT_URL && DIRECT_URL !== TARGET_URL) {
  console.log(`  Direct Deployment URL: ${DIRECT_URL}`);
}

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

async function verifyEndpoint(baseUrl, endpoint, attempt = 1, maxAttempts = 6) {
  const fullUrl = `${baseUrl}${endpoint.path}`;
  try {
    const res = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Astraiv-PostDeploy-SmokeTest/1.0',
        'Cache-Control': 'no-cache, no-store'
      }
    });

    const isMatch = res.status === endpoint.expectedStatus;
    const vercelId = res.headers.get('x-vercel-id') || 'N/A';

    if (isMatch) {
      console.log(`  ✓ [PASS] ${endpoint.name} (${endpoint.path}) -> Status: ${res.status} (Vercel-ID: ${vercelId})`);
      return true;
    }

    if (attempt < maxAttempts) {
      console.warn(`  ⚠ [RETRY ${attempt}/${maxAttempts}] ${endpoint.name} returned status ${res.status} (expected ${endpoint.expectedStatus}). Waiting 5s for edge propagation...`);
      await wait(5000);
      return verifyEndpoint(baseUrl, endpoint, attempt + 1, maxAttempts);
    }

    console.error(`  ✗ [FAIL] ${endpoint.name} (${endpoint.path}) -> Expected ${endpoint.expectedStatus}, got ${res.status}`);
    return false;
  } catch (err) {
    if (attempt < maxAttempts) {
      console.warn(`  ⚠ [RETRY ${attempt}/${maxAttempts}] ${endpoint.name} network error: ${err.message}. Retrying in 5s...`);
      await wait(5000);
      return verifyEndpoint(baseUrl, endpoint, attempt + 1, maxAttempts);
    }
    console.error(`  ✗ [FAIL] ${endpoint.name} (${endpoint.path}) -> Network error: ${err.message}`);
    return false;
  }
}

async function verifyTarget(url, label) {
  console.log(`\n--- Verifying [${label}] against: ${url} ---`);
  let passed = 0;
  let failed = 0;

  for (const check of CRITICAL_CHECKS) {
    const ok = await verifyEndpoint(url, check);
    if (ok) passed++;
    else failed++;
  }

  console.log(`[${label} Summary] Passed: ${passed}/${CRITICAL_CHECKS.length}, Failed: ${failed}`);
  return failed === 0;
}

async function run() {
  console.log(`[Smoke Test] Waiting 6 seconds for edge CDN cache invalidation & routing propagation...`);
  await wait(6000);

  // If a direct deployment URL was provided, verify it first to validate the build artifacts
  if (DIRECT_URL && DIRECT_URL !== TARGET_URL) {
    const directOk = await verifyTarget(DIRECT_URL, 'Direct Deployment Artifact');
    if (!directOk) {
      console.error(`[Smoke Test] Direct deployment artifact verification failed.`);
      process.exit(1);
    }
    console.log(`  ✓ Direct deployment verified healthy. Checking canonical domain...`);
  }

  const targetOk = await verifyTarget(TARGET_URL, 'Canonical Production Domain');
  if (!targetOk) {
    console.error(`[Smoke Test] POST-DEPLOYMENT VERIFICATION FAILED. Critical routes did not meet health criteria.`);
    process.exit(1);
  }

  console.log(`\n[Smoke Test] ALL CRITICAL ROUTES AND ASSETS VERIFIED HEALTHY.`);
  process.exit(0);
}

run();
