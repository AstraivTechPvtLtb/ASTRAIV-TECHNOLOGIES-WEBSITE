import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Browser, Page, HTTPRequest } from 'puppeteer-core';
import { createE2EBrowser, BASE_URL, isServerReachable } from './e2e-helper';

describe('E2E: Critical Business Journeys (Headless Browser)', () => {
  let browser: Browser | null = null;
  let page: Page | null = null;
  let serverAvailable = false;

  beforeAll(async () => {
    serverAvailable = await isServerReachable(BASE_URL);
    if (!serverAvailable) {
      console.warn(`[E2E Skipped]: Target server ${BASE_URL} is not reachable. Launch dev server to run browser journeys.`);
      return;
    }

    const instance = await createE2EBrowser();
    browser = instance.browser;
    page = instance.page;
  }, 35000);

  afterAll(async () => {
    if (browser) {
      await browser.close();
    }
  });

  const runIfServer = (name: string, fn: () => Promise<void>, timeout = 40000) => {
    it(name, async () => {
      if (!serverAvailable || !page) {
        console.warn(`Skipping "${name}": server not reachable`);
        return;
      }
      await fn();
    }, timeout);
  };

  describe('Journey 1: Home → Services → Service → Case Study → Start Project', () => {
    runIfServer('traverses complete engineering funnel from landing to start project', async () => {
      if (!page) return;

      // 1. Home
      await page.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });
      expect(await page.title()).toMatch(/Astraiv Technologies/i);

      // 2. Services
      await page.goto(`${BASE_URL}/en/services`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });
      const servicesH1 = await page.$eval('h1', (el) => el.textContent);
      expect(servicesH1).toMatch(/Engineering Disciplines|Services/i);

      // 3. Service Detail (AI Development)
      await page.goto(`${BASE_URL}/en/services/ai-development`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });
      const serviceTitle = await page.$eval('h1', (el) => el.textContent);
      expect(serviceTitle).toMatch(/AI Development|Intelligent/i);

      // 4. Case Study link from Service
      const caseStudyHref = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const detailLink = links.find((a) => {
          const href = a.getAttribute('href') || '';
          return /\/work\/case-studies\/[a-z0-9-]+/.test(href) && !href.endsWith('/case-studies');
        });
        return detailLink ? detailLink.getAttribute('href') : null;
      });
      expect(caseStudyHref).toBeTruthy();

      const normalizedCsHref = caseStudyHref!.startsWith('http')
        ? caseStudyHref!
        : `${BASE_URL}${caseStudyHref!.startsWith('/') ? caseStudyHref! : `/${caseStudyHref!}`}`;

      await page.goto(normalizedCsHref, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });

      // 5. Start Project CTA from Case Study
      await page.waitForSelector('a[href*="start-project"]', { timeout: 10000 });
      const startProjectHref = await page.evaluate(() => {
        const link = document.querySelector('a[href*="start-project"]');
        return link ? link.getAttribute('href') : null;
      });
      expect(startProjectHref).toBeTruthy();

      const normalizedSpHref = startProjectHref!.startsWith('http')
        ? startProjectHref!
        : `${BASE_URL}${startProjectHref!.startsWith('/') ? startProjectHref! : `/${startProjectHref!}`}`;

      await page.goto(normalizedSpHref, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1, h2, form, [data-wizard]', { timeout: 10000 });
      expect(page.url()).toContain('/start-project');
    });
  });

  describe('Journey 2: Start Project → Complete Form → Validation → Submit → Thank You', () => {
    runIfServer('validates form fields, simulates safe submission without production pollution, and redirects to thank you', async () => {
      if (!page) return;

      // Safe test environment: intercept POST /api/start-project to eliminate production pollution
      await page.setRequestInterception(true);
      const requestHandler = (req: HTTPRequest) => {
        if (req.url().includes('/api/start-project') && req.method() === 'POST') {
          req.respond({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
              success: true,
              data: {
                leadNumber: 'AST-TEST-QA-100',
                referenceId: 'AST-TEST-QA-100',
                projectType: 'AI Solution',
                message: 'Test brief securely received in test environment.',
              },
            }),
          });
        } else {
          req.continue();
        }
      };
      page.on('request', requestHandler);

      try {
        await page.goto(`${BASE_URL}/en/start-project`, { waitUntil: 'networkidle0' });

        // Step 1: Select AI Solution
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const btn = buttons.find((b) => b.textContent?.includes('AI Solution'));
          if (btn) btn.click();
        });
        await new Promise((r) => setTimeout(r, 400));

        // Click Next to Step 2
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const nextBtn = buttons.find((b) => b.textContent?.includes('Next'));
          if (nextBtn) nextBtn.click();
        });
        await page.waitForFunction(() => document.body.innerText.includes('STEP 2 OF 5'), { timeout: 8000 });

        // Step 2 Validation: Click Next without description -> verify error
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const nextBtn = buttons.find((b) => b.textContent?.includes('Next'));
          if (nextBtn) nextBtn.click();
        });
        await page.waitForFunction(() => document.body.innerText.includes('15 characters'), { timeout: 8000 });

        // Type description using keyboard events
        await page.type('textarea', 'We require an enterprise autonomous workflow automation engine.');
        await new Promise((r) => setTimeout(r, 400));

        // Click Next to Step 3
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const nextBtn = buttons.find((b) => b.textContent?.includes('Next'));
          if (nextBtn) nextBtn.click();
        });
        await page.waitForFunction(() => document.body.innerText.includes('STEP 3 OF 5'), { timeout: 8000 });

        // Click Next to Step 4
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const nextBtn = buttons.find((b) => b.textContent?.includes('Next'));
          if (nextBtn) nextBtn.click();
        });
        await page.waitForFunction(() => document.body.innerText.includes('STEP 4 OF 5'), { timeout: 8000 });

        // Step 4: Fill contact inputs
        await page.waitForSelector('#wizard-name');
        await page.type('#wizard-name', 'Senior QA Engineer');
        await page.type('#wizard-email', 'senior.qa@astraiv-safe-test.com');
        await page.type('#wizard-company', 'Astraiv Test Automation Inc');
        await new Promise((r) => setTimeout(r, 400));

        // Click Next to Step 5
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const nextBtn = buttons.find((b) => b.textContent?.includes('Next'));
          if (nextBtn) nextBtn.click();
        });

        // Step 5: Review & Submit
        await page.waitForFunction(
          () => document.body.innerText.includes('STEP 5 OF 5') || document.body.innerText.includes('REVIEW'),
          { timeout: 8000 }
        );

        // Submit form
        await page.evaluate(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          const submitBtn = buttons.find((b) => b.textContent?.includes('Submit') || b.textContent?.includes('Transmit'));
          if (submitBtn) submitBtn.click();
        });

        // Wait for redirect to Thank You page
        await page.waitForFunction(() => window.location.pathname.includes('/thank-you'), { timeout: 15000 });
        expect(page.url()).toContain('/thank-you');

        // Wait for page to render and verify user sees Thank You confirmation
        await page.waitForSelector('h1', { timeout: 10000 });
        const thankYouHeading = await page.$eval('h1', (el) => el.textContent);
        expect(thankYouHeading).toMatch(/Project Brief Received|Thank You/i);
      } finally {
        page.off('request', requestHandler);
        await page.setRequestInterception(false);
      }
    });
  });

  describe('Journey 3: Solutions → Solution → Related Service', () => {
    runIfServer('navigates from solutions hub to individual solution and into powering service', async () => {
      if (!page) return;

      // 1. Solutions hub
      await page.goto(`${BASE_URL}/en/solutions`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });
      const h1Text = await page.$eval('h1', (el) => el.textContent);
      expect(h1Text).toMatch(/Solutions|Enterprise/i);

      // 2. Click solution detail
      const solutionHref = await page.evaluate(() => {
        const link = document.querySelector('a[href*="/solutions/"]');
        return link ? link.getAttribute('href') : null;
      });
      expect(solutionHref).toBeTruthy();

      await page.goto(`${BASE_URL}${solutionHref}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });

      // 3. Find related service link
      const relatedServiceHref = await page.evaluate(() => {
        const link = document.querySelector('a[href*="/services/"]');
        return link ? link.getAttribute('href') : null;
      });
      expect(relatedServiceHref).toBeTruthy();

      await page.goto(`${BASE_URL}${relatedServiceHref}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });
      expect(page.url()).toContain('/services/');
    });
  });

  describe('Journey 4: Industries → Industry → Case Study', () => {
    runIfServer('navigates from industries directory to vertical industry and into proof case study', async () => {
      if (!page) return;

      // 1. Industries
      await page.goto(`${BASE_URL}/en/industries`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });

      // 2. Select Industry (Fintech)
      await page.goto(`${BASE_URL}/en/industries/fintech`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });
      const industryH1 = await page.$eval('h1', (el) => el.textContent);
      expect(industryH1).toMatch(/FinTech|Banking/i);

      // 3. Follow Case Study link
      const caseStudyHref = await page.evaluate(() => {
        const link = document.querySelector('a[href*="/work/case-studies/"]');
        return link ? link.getAttribute('href') : null;
      });
      expect(caseStudyHref).toBeTruthy();

      await page.goto(`${BASE_URL}${caseStudyHref}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });
      expect(page.url()).toContain('/work/case-studies/');
    });
  });

  describe('Journey 5: Insights → Article → Related Service', () => {
    runIfServer('navigates from insights blog to technical article and into relevant engineering service', async () => {
      if (!page) return;

      // 1. Insights
      await page.goto(`${BASE_URL}/en/insights`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });

      // 2. Article
      const articleHref = await page.evaluate(() => {
        const link = document.querySelector('a[href*="/insights/"]');
        return link ? link.getAttribute('href') : null;
      });
      expect(articleHref).toBeTruthy();

      await page.goto(`${BASE_URL}${articleHref}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });

      // 3. Related service link
      const relatedServiceHref = await page.evaluate(() => {
        const link = document.querySelector('a[href*="/services/"]');
        return link ? link.getAttribute('href') : null;
      });
      expect(relatedServiceHref).toBeTruthy();

      await page.goto(`${BASE_URL}${relatedServiceHref}`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });
      expect(page.url()).toContain('/services/');
    });
  });

  describe('Journey 6: Work → Testimonials', () => {
    runIfServer('navigates from work portfolio to client reviews and verified testimonials', async () => {
      if (!page) return;

      // 1. Work
      await page.goto(`${BASE_URL}/en/work`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });

      // 2. Testimonials
      await page.goto(`${BASE_URL}/en/work/testimonials`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('h1', { timeout: 10000 });
      const testimonialsH1 = await page.$eval('h1', (el) => el.textContent);
      expect(testimonialsH1).toMatch(/Testimonials|Reviews|Feedback|Endorsements/i);

      // Verify testimonials rendered in main view
      const mainText = await page.evaluate(() => document.querySelector('main')?.innerText || '');
      expect(mainText).toMatch(/Sarah|FinanceFlow|Verified|Review|Endorsement|Testimonial/i);
    });
  });

  describe('Journey 7: Company → Rewards & Accolades', () => {
    runIfServer('navigates to company overview and into verified rewards & accolades', async () => {
      if (!page) return;

      // 1. Company
      await page.goto(`${BASE_URL}/en/company`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('h1', { timeout: 10000 });

      // 2. Rewards & Accolades
      await page.goto(`${BASE_URL}/en/company/rewards-accolades`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('h1', { timeout: 10000 });
      const awardsH1 = await page.$eval('h1', (el) => el.textContent);
      expect(awardsH1).toMatch(/Rewards|Accolades|Awards/i);

      // Verify ISO or certification badge content in main container
      const mainText = await page.evaluate(() => document.querySelector('main')?.innerText || '');
      expect(mainText).toMatch(/ISO|SOC|Accolades|Information Security/i);
    });
  });

  describe('Journey 8: Careers → Job', () => {
    runIfServer('navigates from careers page to open role specification and application interface', async () => {
      if (!page) return;

      // 1. Careers
      await page.goto(`${BASE_URL}/en/careers`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('h1', { timeout: 10000 });

      // 2. Job Detail
      const jobHref = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const link = links.find((a) => a.getAttribute('href')?.match(/\/careers\/[a-z0-9-]+/));
        return link ? link.getAttribute('href') : null;
      });
      expect(jobHref).toBeTruthy();

      const normalizedJobHref = jobHref!.startsWith('http')
        ? jobHref!
        : `${BASE_URL}${jobHref!.startsWith('/') ? jobHref! : `/${jobHref!}`}`;

      await page.goto(normalizedJobHref, { waitUntil: 'networkidle0' });
      await page.waitForSelector('h1', { timeout: 10000 });
      const jobTitle = await page.$eval('h1', (el) => el.textContent);
      expect(jobTitle?.length).toBeGreaterThan(3);

      // Check responsibilities or apply button in main content
      const mainText = await page.evaluate(() => document.querySelector('main')?.innerText || '');
      expect(mainText).toMatch(/Apply|Responsibilities|Requirements|Role/i);
    });
  });

  describe('Journey 9: Client Portal → Authentication entry', () => {
    runIfServer('navigates to the client portal and renders authentication entry gate', async () => {
      if (!page) return;

      await page.goto(`${BASE_URL}/en/auth/login`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('input[type="email"]', { timeout: 10000 });

      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      expect(emailInput).not.toBeNull();
      expect(passwordInput).not.toBeNull();

      const pageText = await page.evaluate(() => document.body.innerText);
      expect(pageText).toMatch(/Welcome Back|Sign In|Client Portal/i);
    });
  });

  describe('Journey 10: 404 route', () => {
    runIfServer('handles non-existent paths with friendly 404 recovery page and home link', async () => {
      if (!page) return;

      await page.goto(`${BASE_URL}/en/non-existent-qa-path-404`, { waitUntil: 'networkidle0' });
      await page.waitForSelector('h1, a', { timeout: 10000 });

      const bodyText = await page.evaluate(() => document.body.innerText);
      expect(bodyText).toMatch(/404|Not Found|Route Not Found/i);

      // Verify return home recovery link is present and functional
      const homeLink = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a'));
        const link = links.find((a) => a.textContent?.includes('Return Home') || a.getAttribute('href') === '/en' || a.getAttribute('href') === '/');
        return link ? link.getAttribute('href') : null;
      });
      expect(homeLink).toBeTruthy();
    });
  });

  describe('Journey 11: Mobile navigation', () => {
    runIfServer('opens mobile navigation drawer on small viewports and provides accessible menu interactions', async () => {
      if (!page) return;

      // Set to mobile viewport
      await page.setViewport({ width: 390, height: 844 });
      await page.goto(`${BASE_URL}/en`, { waitUntil: 'domcontentloaded' });

      // Locate hamburger button
      const hasMenuButton = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        const btn = buttons.find((b) => b.getAttribute('aria-label')?.includes('menu') || b.querySelector('svg.lucide-menu'));
        if (btn) {
          btn.click();
          return true;
        }
        return false;
      });
      expect(hasMenuButton).toBe(true);

      // Wait for mobile drawer to open and verify navigation items are present
      await page.waitForFunction(
        () => {
          const text = document.body.innerText;
          return text.includes('Services') && text.includes('Solutions');
        },
        { timeout: 8000 }
      );

      // Reset viewport for desktop
      await page.setViewport({ width: 1280, height: 800 });
    });
  });

  describe('Journey 12: Dark/light theme', () => {
    runIfServer('toggles between dark and light themes smoothly', async () => {
      if (!page) return;

      // Test mobile toggle button
      await page.setViewport({ width: 390, height: 844 });
      await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle0' });

      // Wait for React hydration
      await new Promise((r) => setTimeout(r, 1000));

      const initialTheme = await page.evaluate(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'));

      // Click theme toggle button
      await page.waitForSelector('button[aria-label="Toggle theme"]');
      await page.click('button[aria-label="Toggle theme"]');
      await new Promise((r) => setTimeout(r, 800));

      const toggledTheme = await page.evaluate(() => (document.documentElement.classList.contains('dark') ? 'dark' : 'light'));
      expect(toggledTheme).not.toBe(initialTheme);

      // Reset viewport
      await page.setViewport({ width: 1280, height: 800 });
    });
  });
});
