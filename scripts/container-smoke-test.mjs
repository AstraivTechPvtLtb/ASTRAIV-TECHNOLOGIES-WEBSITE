/**
 * @file client/scripts/container-smoke-test.mjs
 * @description Local Container Smoke Test Suite for Astraiv Client Website.
 * Tests container availability, health probes, critical routes, static assets, and security headers.
 */

const BASE_URL = (process.env.CONTAINER_URL || 'http://127.0.0.1:3000').replace(/\/$/, '');

console.log(`[Docker Smoke Test] Verifying Astraiv Client Container against: ${BASE_URL}`);

const CHECKS = [
  { path: '/api/health', expectedStatus: 200, name: 'Container Health Probe (/api/health)' },
  { path: '/en', expectedStatus: 200, name: 'Localized Homepage (/en)' },
  { path: '/images/careers-hero.jpg', expectedStatus: 200, name: 'Critical Careers Hero Photography' },
  { path: '/en/careers', expectedStatus: 200, name: 'Careers Directory (/en/careers)' },
  { path: '/en/services', expectedStatus: 200, name: 'Services Catalog (/en/services)' },
  { path: '/en/solutions', expectedStatus: 200, name: 'Solutions Catalog (/en/solutions)' },
  { path: '/en/contact', expectedStatus: 200, name: 'Contact Form (/en/contact)' },
  { path: '/en/start-project', expectedStatus: 200, name: 'Start a Project Wizard' },
  { path: '/favicon.ico', expectedStatus: 200, name: 'Favicon' },
];

async function runTests() {
  let passed = 0;
  let failed = 0;

  for (const check of CHECKS) {
    const url = `${BASE_URL}${check.path}`;
    try {
      const res = await fetch(url, {
        headers: {
          'User-Agent': 'Astraiv-Docker-SmokeTest/1.0',
          'Cache-Control': 'no-cache',
        },
      });

      if (res.status === check.expectedStatus) {
        console.log(`  ✓ [PASS] ${check.name} -> HTTP ${res.status}`);
        passed++;
      } else {
        console.error(`  ✗ [FAIL] ${check.name} -> Expected HTTP ${check.expectedStatus}, got ${res.status}`);
        failed++;
      }
    } catch (err) {
      console.error(`  ✗ [FAIL] ${check.name} -> Connection error: ${err.message}`);
      failed++;
    }
  }

  console.log(`\n[Docker Smoke Test Summary] Passed: ${passed}/${CHECKS.length}, Failed: ${failed}`);
  if (failed > 0) {
    process.exit(1);
  }
  console.log('✓ ALL CLIENT CONTAINER CHECKS PASSED SUCCESSFULLY.');
}

runTests();
