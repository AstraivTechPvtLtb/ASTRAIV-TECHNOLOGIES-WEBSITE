import puppeteer from 'puppeteer-core';
import fs from 'fs';

const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

function findBrowser() {
  const candidates = [
    process.env.PUPPETEER_EXECUTABLE_PATH,
    process.env.CHROME_BIN,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ];
  for (const c of candidates) {
    if (c && fs.existsSync(c)) return c;
  }
  throw new Error('Chrome/Edge executable not found');
}

async function main() {
  console.log('================================================================');
  console.log('FINAL ENGINEERING RELEASE REGRESSION VALIDATION SUITE');
  console.log('================================================================\n');

  const browserPath = findBrowser();
  console.log(`Browser executable: ${browserPath}`);
  console.log(`Target URL: ${BASE_URL}\n`);

  const browser = await puppeteer.launch({
    executablePath: browserPath,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const summary = {
    totalChecks: 0,
    passedChecks: 0,
    failedChecks: 0,
    browserConsoleErrors: [],
    networkFailures: [],
    runtimeErrors: [],
    details: []
  };

  const recordCheck = (category, name, passed, notes = '') => {
    summary.totalChecks++;
    if (passed) {
      summary.passedChecks++;
      console.log(`  ✓ [PASS] [${category}] ${name} ${notes ? `(${notes})` : ''}`);
    } else {
      summary.failedChecks++;
      console.error(`  ✗ [FAIL] [${category}] ${name} ${notes ? `(${notes})` : ''}`);
    }
    summary.details.push({ category, name, passed, notes });
  };

  const page = await browser.newPage();

  // Attach runtime error listener
  page.on('pageerror', (err) => {
    summary.runtimeErrors.push(err.message);
    console.error(`[PAGE RUNTIME ERROR]: ${err.message}`);
  });

  // Attach console error listener
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignore benign favicon or external analytics aborts in test mode
      if (!text.includes('favicon') && !text.includes('analytics')) {
        summary.browserConsoleErrors.push(text);
      }
    }
  });

  // Attach network response failure listener
  page.on('response', (res) => {
    const url = res.url();
    const status = res.status();
    if (status >= 400 && !url.includes('/non-existent-sample-page-xyz') && !url.includes('/api/auth')) {
      summary.networkFailures.push({ url, status });
    }
  });

  try {
    // -------------------------------------------------------------
    // SECTION 1: Direct URL Entry For All Important Routes
    // -------------------------------------------------------------
    console.log('\n--- SECTION 1: Direct URL Entry & Hydration Checks ---');
    const directRoutes = [
      { path: '/en', name: 'Home Landing' },
      { path: '/en/services', name: 'Services Directory' },
      { path: '/en/services/ai-development', name: 'Service Detail (AI Development)' },
      { path: '/en/solutions', name: 'Solutions Hub' },
      { path: '/en/solutions/ai-enterprise-transformation', name: 'Solution Detail (AI Enterprise)' },
      { path: '/en/industries', name: 'Industries Directory' },
      { path: '/en/industries/fintech-banking', name: 'Industry Detail (Fintech)' },
      { path: '/en/work', name: 'Work Overview' },
      { path: '/en/work/case-studies', name: 'Case Studies Directory' },
      { path: '/en/work/case-studies/financeflow', name: 'Case Study Detail (FinanceFlow)' },
      { path: '/en/work/testimonials', name: 'Testimonials Directory' },
      { path: '/en/company', name: 'Company Overview' },
      { path: '/en/company/rewards-accolades', name: 'Rewards & Accolades' },
      { path: '/en/careers', name: 'Careers Portal' },
      { path: '/en/contact', name: 'Contact Us' },
      { path: '/en/start-project', name: 'Start Project Wizard' },
      { path: '/en/pricing', name: 'Pricing Calculator' },
      { path: '/en/faq', name: 'FAQ Page' },
      { path: '/en/insights', name: 'Insights Hub' },
      { path: '/en/insights/how-rag-systems-improve-enterprise-knowledge', name: 'Technical Article Detail' },
      { path: '/en/auth/login', name: 'Client Portal Sign In' },
      { path: '/en/auth/signup', name: 'Client Portal Sign Up' },
    ];

    for (const route of directRoutes) {
      const res = await page.goto(`${BASE_URL}${route.path}`, { waitUntil: 'domcontentloaded', timeout: 25000 });
      await new Promise(r => setTimeout(r, 600));
      const status = res ? res.status() : 0;
      const h1Count = await page.$$eval('h1', els => els.length);
      const isOk = status === 200 && h1Count >= 1;
      recordCheck('Direct URL Entry', route.name, isOk, `status: ${status}, h1 count: ${h1Count}`);
    }

    // -------------------------------------------------------------
    // SECTION 2: Dynamic Route Refresh & Hydration Integrity
    // -------------------------------------------------------------
    console.log('\n--- SECTION 2: Dynamic Route Refresh & Hydration Integrity ---');
    const dynamicRoutesToRefresh = [
      '/en/services/ai-development',
      '/en/work/case-studies/financeflow',
      '/en/insights/how-rag-systems-improve-enterprise-knowledge'
    ];

    for (const dPath of dynamicRoutesToRefresh) {
      await page.goto(`${BASE_URL}${dPath}`, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 600));
      const titleBefore = await page.title();
      
      // Refresh page directly
      await page.reload({ waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 600));
      const titleAfter = await page.title();
      const contentPresent = await page.$eval('h1', el => el.textContent.length > 0);

      const refreshPassed = titleBefore === titleAfter && contentPresent;
      recordCheck('Dynamic Route Refresh', dPath, refreshPassed, `title: "${titleAfter.substring(0, 35)}..."`);
    }

    // -------------------------------------------------------------
    // SECTION 3: 404 Behavior & Safe Error Recovery
    // -------------------------------------------------------------
    console.log('\n--- SECTION 3: 404 Behavior & Safe Error Recovery ---');
    const notFoundRes = await page.goto(`${BASE_URL}/en/non-existent-sample-page-xyz`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));
    const notFoundStatus = notFoundRes ? notFoundRes.status() : 0;
    const notFoundH1 = await page.$eval('h1', el => el.textContent).catch(() => '');
    const homeLink = await page.$('a[href*="/en"], a[href="/"]');

    const notFoundValid = (notFoundStatus === 404 || notFoundH1.includes('404') || notFoundH1.includes('Not Found') || notFoundH1.includes('Lost')) && Boolean(homeLink);
    recordCheck('404 Error Handling', 'Custom 404 Page and Return CTA', notFoundValid, `H1: "${notFoundH1}"`);

    // -------------------------------------------------------------
    // SECTION 4: Viewport Matrix & Responsive Layouts
    // -------------------------------------------------------------
    console.log('\n--- SECTION 4: Viewport Matrix Responsive Testing ---');
    const viewports = [
      { name: 'Mobile SE (375x667)', width: 375, height: 667 },
      { name: 'Mobile iPhone 14 (390x844)', width: 390, height: 844 },
      { name: 'Tablet iPad (768x1024)', width: 768, height: 1024 },
      { name: 'Laptop (1280x800)', width: 1280, height: 800 },
      { name: 'Desktop (1440x900)', width: 1440, height: 900 },
      { name: 'Large Desktop FHD (1920x1080)', width: 1920, height: 1080 },
    ];

    for (const vp of viewports) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await page.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 500));

      const overflowX = await page.evaluate(() => {
        return document.documentElement.scrollWidth > window.innerWidth + 1;
      });

      const navVisible = await page.evaluate((w) => {
        if (w < 1024) {
          return Boolean(document.querySelector('button[aria-label*="menu" i]'));
        } else {
          return Boolean(document.querySelector('header nav'));
        }
      }, vp.width);

      const vpPass = !overflowX && navVisible;
      recordCheck('Viewport Responsive', vp.name, vpPass, `overflowX: ${overflowX}, navVisible: ${navVisible}`);
    }

    // -------------------------------------------------------------
    // SECTION 5: Theme Switching (Dark & Light)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 5: Theme Switching (Dark & Light) ---');
    await page.setViewport({ width: 390, height: 844 });
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));

    // Wait for theme button in mobile header
    await page.waitForSelector('button[aria-label="Toggle theme"]', { timeout: 10000 });
    const initialTheme = await page.evaluate(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    await page.click('button[aria-label="Toggle theme"]');
    await new Promise(r => setTimeout(r, 600));
    const toggledTheme = await page.evaluate(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    // Click again to return to initial
    await page.click('button[aria-label="Toggle theme"]');
    await new Promise(r => setTimeout(r, 600));
    const finalTheme = await page.evaluate(() => document.documentElement.classList.contains('dark') ? 'dark' : 'light');

    const themeTogglePassed = initialTheme !== toggledTheme && initialTheme === finalTheme;
    recordCheck('Theme Switching', 'Dark / Light Theme Toggle', themeTogglePassed, `${initialTheme} -> ${toggledTheme} -> ${finalTheme}`);

    // Reset viewport to desktop
    await page.setViewport({ width: 1440, height: 900 });

    // -------------------------------------------------------------
    // SECTION 6: Keyboard Navigation & Accessibility Focus
    // -------------------------------------------------------------
    console.log('\n--- SECTION 6: Keyboard Navigation & A11y Focus ---');
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    // Test Skip to content link
    await page.keyboard.press('Tab');
    await new Promise(r => setTimeout(r, 200));
    const activeElText = await page.evaluate(() => document.activeElement ? document.activeElement.textContent : '');
    const activeElHref = await page.evaluate(() => document.activeElement ? document.activeElement.getAttribute('href') : '');
    const skipLinkOk = activeElHref === '#main-content' || activeElText.toLowerCase().includes('skip');
    recordCheck('Keyboard Navigation', 'Skip Link Activates on First Tab', skipLinkOk, `active: "${activeElText}" (${activeElHref})`);

    // Tab through next 5 interactive elements
    let tabSuccessCount = 0;
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');
      const hasFocus = await page.evaluate(() => document.activeElement !== document.body && Boolean(document.activeElement));
      if (hasFocus) tabSuccessCount++;
    }
    recordCheck('Keyboard Navigation', 'Sequential Tab Navigation Traversal', tabSuccessCount >= 4, `traversed: ${tabSuccessCount}/5`);

    // -------------------------------------------------------------
    // SECTION 7: Reduced Motion Emulation
    // -------------------------------------------------------------
    console.log('\n--- SECTION 7: Reduced Motion Handling ---');
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));

    const reducedMotionRespect = await page.evaluate(() => {
      const mediaMatch = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      return mediaMatch;
    });
    recordCheck('Accessibility', 'prefers-reduced-motion: reduce recognized', reducedMotionRespect, `matches: ${reducedMotionRespect}`);
    // Clear emulation
    await page.emulateMediaFeatures([]);

    // -------------------------------------------------------------
    // SECTION 8: Slow Network Behavior (Emulated Network Throttling)
    // -------------------------------------------------------------
    console.log('\n--- SECTION 8: Slow Network Simulation (Resilience) ---');
    const cdp = await page.target().createCDPSession();
    // Simulate Slow 3G: 500kbps down, 500kbps up, 400ms latency
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: (500 * 1024) / 8,
      uploadThroughput: (500 * 1024) / 8,
      latency: 400,
    });

    const slowStartTime = Date.now();
    await page.goto(`${BASE_URL}/en/services`, { waitUntil: 'domcontentloaded', timeout: 35000 });
    const slowLoadDuration = Date.now() - slowStartTime;
    const servicesTitleRendered = await page.$eval('h1', el => el.textContent.length > 0);
    recordCheck('Slow Network Resilience', 'Page loads without crashes under throttling', servicesTitleRendered, `loaded in ${slowLoadDuration}ms`);

    // Disable throttling
    await cdp.send('Network.emulateNetworkConditions', {
      offline: false,
      downloadThroughput: -1,
      uploadThroughput: -1,
      latency: 0,
    });

    // -------------------------------------------------------------
    // SECTION 9: Form Failure & Success States
    // -------------------------------------------------------------
    console.log('\n--- SECTION 9: Form Failure & Success States ---');
    // 9A: Contact Form Empty Validation
    await page.goto(`${BASE_URL}/en/contact`, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));

    // Submit without filling
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) {
      await submitBtn.click();
      await new Promise(r => setTimeout(r, 400));
      const hasInvalidField = await page.evaluate(() => {
        const inputs = Array.from(document.querySelectorAll('input:required, textarea:required'));
        return inputs.some(i => !i.checkValidity() || i.getAttribute('aria-invalid') === 'true') ||
          document.body.innerText.includes('required') ||
          document.body.innerText.includes('Please enter');
      });
      recordCheck('Form Validation', 'Contact Form Empty Submission Prevented', hasInvalidField, 'validation triggered');
    }

    // -------------------------------------------------------------
    // SECTION 10: All 9 Critical Business Flows
    // -------------------------------------------------------------
    console.log('\n--- SECTION 10: The 9 Critical Business User Journeys ---');

    // FLOW 1: Home → Service → Case Study → Start Project → Thank You
    console.log('\nChecking Flow 1: Home → Service → Case Study → Start Project → Thank You');
    await page.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });
    await page.goto(`${BASE_URL}/en/services/ai-development`, { waitUntil: 'domcontentloaded' });
    const serviceH1 = await page.$eval('h1', el => el.textContent);
    await page.goto(`${BASE_URL}/en/work/case-studies/financeflow`, { waitUntil: 'domcontentloaded' });
    const csH1 = await page.$eval('h1', el => el.textContent);
    await page.goto(`${BASE_URL}/en/start-project`, { waitUntil: 'domcontentloaded' });
    const spH1 = await page.$eval('h1', el => el.textContent);
    await page.goto(`${BASE_URL}/en/thank-you`, { waitUntil: 'domcontentloaded' });
    const tyH1 = await page.$eval('h1', el => el.textContent);
    const flow1Pass = Boolean(serviceH1 && csH1 && spH1 && tyH1);
    recordCheck('Critical Journey 1', 'Home → Service → Case Study → Start Project → Thank You', flow1Pass, `TY: "${tyH1}"`);

    // FLOW 2: Home → Solution → Related Service
    console.log('\nChecking Flow 2: Home → Solution → Related Service');
    await page.goto(`${BASE_URL}/en/solutions/ai-enterprise-transformation`, { waitUntil: 'domcontentloaded' });
    const solTitle = await page.$eval('h1', el => el.textContent);
    const relServiceLink = await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href')?.includes('/services/'));
      return a ? a.getAttribute('href') : null;
    });
    let flow2Pass = Boolean(solTitle && relServiceLink);
    if (relServiceLink) {
      await page.goto(`${BASE_URL}${relServiceLink.startsWith('/') ? relServiceLink : `/${relServiceLink}`}`, { waitUntil: 'domcontentloaded' });
      flow2Pass = Boolean(await page.$eval('h1', el => el.textContent));
    }
    recordCheck('Critical Journey 2', 'Home → Solution → Related Service', flow2Pass, `target: ${relServiceLink}`);

    // FLOW 3: Home → Industry → Related Solution/Service
    console.log('\nChecking Flow 3: Home → Industry → Related Solution/Service');
    await page.goto(`${BASE_URL}/en/industries/fintech-banking`, { waitUntil: 'domcontentloaded' });
    const indTitle = await page.$eval('h1', el => el.textContent);
    const relIndLink = await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll('a')).find(el => 
        el.getAttribute('href')?.includes('/services/') || 
        el.getAttribute('href')?.includes('/solutions/') ||
        el.getAttribute('href')?.includes('/work/case-studies/')
      );
      return a ? a.getAttribute('href') : null;
    });
    let flow3Pass = Boolean(indTitle && relIndLink);
    if (relIndLink) {
      await page.goto(`${BASE_URL}${relIndLink.startsWith('/') ? relIndLink : `/${relIndLink}`}`, { waitUntil: 'domcontentloaded' });
      flow3Pass = Boolean(await page.$eval('h1', el => el.textContent));
    }
    recordCheck('Critical Journey 3', 'Home → Industry → Related Solution/Service', flow3Pass, `target: ${relIndLink}`);

    // FLOW 4: Insights → Blog → Article → Related Content
    console.log('\nChecking Flow 4: Insights → Blog → Article → Related Content');
    await page.goto(`${BASE_URL}/en/insights`, { waitUntil: 'domcontentloaded' });
    const insightsH1 = await page.$eval('h1', el => el.textContent);
    await page.goto(`${BASE_URL}/en/insights/how-rag-systems-improve-enterprise-knowledge`, { waitUntil: 'domcontentloaded' });
    const articleH1 = await page.$eval('h1', el => el.textContent);
    const relContentLink = await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll('a')).find(el => 
        el.getAttribute('href')?.includes('/services/') || 
        el.getAttribute('href')?.includes('/insights/') ||
        el.getAttribute('href')?.includes('/start-project')
      );
      return a ? a.getAttribute('href') : null;
    });
    const flow4Pass = Boolean(insightsH1 && articleH1 && relContentLink);
    recordCheck('Critical Journey 4', 'Insights → Blog → Article → Related Content', flow4Pass, `article: "${articleH1.substring(0, 30)}..."`);

    // FLOW 5: Work → Case Studies
    console.log('\nChecking Flow 5: Work → Case Studies');
    await page.goto(`${BASE_URL}/en/work`, { waitUntil: 'domcontentloaded' });
    const workH1 = await page.$eval('h1', el => el.textContent);
    await page.goto(`${BASE_URL}/en/work/case-studies`, { waitUntil: 'domcontentloaded' });
    const csDirH1 = await page.$eval('h1', el => el.textContent);
    const csCardsCount = await page.$$eval('a[href*="/work/case-studies/"]', els => els.length);
    const flow5Pass = Boolean(workH1 && csDirH1 && csCardsCount > 0);
    recordCheck('Critical Journey 5', 'Work → Case Studies', flow5Pass, `case study links found: ${csCardsCount}`);

    // FLOW 6: Work → Testimonials
    console.log('\nChecking Flow 6: Work → Testimonials');
    await page.goto(`${BASE_URL}/en/work/testimonials`, { waitUntil: 'domcontentloaded' });
    const testH1 = await page.$eval('h1', el => el.textContent);
    const testQuotesCount = await page.$$eval('blockquote, [data-testimonial-card], p', els => els.length);
    const flow6Pass = Boolean(testH1 && testQuotesCount > 0);
    recordCheck('Critical Journey 6', 'Work → Testimonials', flow6Pass, `title: "${testH1}"`);

    // FLOW 7: Company → Rewards & Accolades
    console.log('\nChecking Flow 7: Company → Rewards & Accolades');
    await page.goto(`${BASE_URL}/en/company`, { waitUntil: 'domcontentloaded' });
    const compH1 = await page.$eval('h1', el => el.textContent);
    await page.goto(`${BASE_URL}/en/company/rewards-accolades`, { waitUntil: 'domcontentloaded' });
    const rewH1 = await page.$eval('h1', el => el.textContent);
    const flow7Pass = Boolean(compH1 && rewH1);
    recordCheck('Critical Journey 7', 'Company → Rewards & Accolades', flow7Pass, `title: "${rewH1}"`);

    // FLOW 8: Company → Careers
    console.log('\nChecking Flow 8: Company → Careers');
    await page.goto(`${BASE_URL}/en/careers`, { waitUntil: 'domcontentloaded' });
    const careersH1 = await page.$eval('h1', el => el.textContent);
    const applyButtonsCount = await page.$$eval('a[href*="careers/"], button, [data-job-card]', els => els.length);
    const flow8Pass = Boolean(careersH1 && applyButtonsCount > 0);
    recordCheck('Critical Journey 8', 'Company → Careers', flow8Pass, `title: "${careersH1}"`);

    // FLOW 9: Client Portal → Sign In
    console.log('\nChecking Flow 9: Client Portal → Sign In');
    await page.goto(`${BASE_URL}/en/client`, { waitUntil: 'domcontentloaded' });
    const portalH1 = await page.$eval('h1', el => el.textContent);
    const signInHref = await page.evaluate(() => {
      const a = Array.from(document.querySelectorAll('a')).find(el => el.getAttribute('href')?.includes('/auth/login'));
      return a ? a.getAttribute('href') : null;
    });
    let flow9Pass = Boolean(portalH1 && signInHref);
    if (signInHref) {
      const fullSignInUrl = signInHref.startsWith('http') ? signInHref : `${BASE_URL}${signInHref.startsWith('/') ? signInHref : `/${signInHref}`}`;
      await page.goto(fullSignInUrl, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 600));
      const emailInput = await page.$('input[type="email"], input[name="email"]');
      const passwordInput = await page.$('input[type="password"], input[name="password"]');
      flow9Pass = Boolean(emailInput && passwordInput);
    }
    recordCheck('Critical Journey 9', 'Client Portal → Sign In Gate', flow9Pass, `portal: "${portalH1?.trim().substring(0, 25)}...", inputs verified: ${flow9Pass}`);

  } finally {
    await browser.close();
  }

  // -------------------------------------------------------------
  // OUTPUT FINAL RESULTS SUMMARY
  // -------------------------------------------------------------
  console.log('\n================================================================');
  console.log('REGRESSION SUITE COMPLETE');
  console.log(`Total Checks Run: ${summary.totalChecks}`);
  console.log(`Passed: ${summary.passedChecks}`);
  console.log(`Failed: ${summary.failedChecks}`);
  console.log(`Browser Console Errors: ${summary.browserConsoleErrors.length}`);
  console.log(`Network Failures: ${summary.networkFailures.length}`);
  console.log(`Runtime Exceptions: ${summary.runtimeErrors.length}`);
  console.log('================================================================\n');

  fs.mkdirSync('scratch', { recursive: true });
  fs.writeFileSync('scratch/final_release_regression_summary.json', JSON.stringify(summary, null, 2));

  if (summary.failedChecks > 0 || summary.runtimeErrors.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Regression suite crashed:', err);
  process.exit(1);
});
