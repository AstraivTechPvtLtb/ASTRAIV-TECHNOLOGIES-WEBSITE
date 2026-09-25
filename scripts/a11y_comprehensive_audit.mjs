import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

console.log('Using browser binary:', CHROME_PATH);

async function runAudit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--force-device-scale-factor=1']
  });

  const report = {
    testedUrls: [],
    findings: [],
    tabOrder: [],
    touchTargets: [],
    headingsAndLandmarks: {},
    images: [],
    colorContrast: { light: [], dark: [] },
    reducedMotion: {},
    zoom200: {},
    formsAudit: []
  };

  const page = await browser.newPage();

  // Test Pages
  const pagesToTest = [
    { name: 'Home Page', url: 'http://localhost:3000/en' },
    { name: 'Contact Page', url: 'http://localhost:3000/en/contact' },
    { name: 'Start Project', url: 'http://localhost:3000/en/start-project' },
    { name: 'Careers Page', url: 'http://localhost:3000/en/careers' }
  ];

  for (const pageInfo of pagesToTest) {
    console.log(`\n========================================`);
    console.log(`Auditing: ${pageInfo.name} (${pageInfo.url})`);
    console.log(`========================================`);
    report.testedUrls.push(pageInfo.url);

    await page.setViewport({ width: 1280, height: 800 });
    await page.goto(pageInfo.url, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));

    // 1. SKIP NAVIGATION AUDIT
    const skipNavResult = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a'));
      const firstFewLinks = links.slice(0, 5).map(a => ({
        href: a.getAttribute('href'),
        text: a.innerText.trim(),
        id: a.id,
        className: a.className
      }));
      const hasSkipLink = links.some(a => {
        const href = a.getAttribute('href') || '';
        const text = a.innerText.toLowerCase();
        return href.startsWith('#main') || href.startsWith('#content') || text.includes('skip');
      });
      const mainElement = document.querySelector('main');
      return {
        hasSkipLink,
        firstFewLinks,
        mainHasId: mainElement ? mainElement.id : null,
        mainExists: Boolean(mainElement)
      };
    });

    if (!skipNavResult.hasSkipLink) {
      report.findings.push({
        wcag: '2.4.1 Bypass Blocks (Level A)',
        page: pageInfo.name,
        severity: 'CRITICAL',
        issue: 'No Skip Navigation link ("Skip to main content") found at the beginning of the page.',
        details: skipNavResult
      });
    }
    if (skipNavResult.mainExists && (!skipNavResult.mainHasId || skipNavResult.mainHasId !== 'main-content')) {
      report.findings.push({
        wcag: '2.4.1 Bypass Blocks (Level A)',
        page: pageInfo.name,
        severity: 'CRITICAL',
        issue: '<main> landmark is missing id="main-content" (or target ID for skip navigation).',
        details: { currentId: skipNavResult.mainHasId }
      });
    }

    // 2. LANDMARKS & HEADINGS AUDIT
    const landmarksAndHeadings = await page.evaluate(() => {
      const h1s = Array.from(document.querySelectorAll('h1')).map(h => ({
        text: h.innerText.trim().slice(0, 80),
        classes: h.className
      }));
      const allHeadings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
        level: parseInt(h.tagName[1], 10),
        tag: h.tagName,
        text: h.innerText.trim().slice(0, 60)
      }));

      // Check heading hierarchy skips
      const hierarchyIssues = [];
      for (let i = 1; i < allHeadings.length; i++) {
        const prev = allHeadings[i - 1].level;
        const curr = allHeadings[i].level;
        if (curr > prev + 1) {
          hierarchyIssues.push({
            prev: allHeadings[i - 1],
            curr: allHeadings[i],
            reason: `Skipped from H${prev} to H${curr}`
          });
        }
      }

      // Landmarks
      const landmarks = {
        header: document.querySelectorAll('header').length,
        nav: Array.from(document.querySelectorAll('nav')).map(n => ({
          ariaLabel: n.getAttribute('aria-label') || n.getAttribute('aria-labelledby') || null
        })),
        main: document.querySelectorAll('main').length,
        footer: document.querySelectorAll('footer').length
      };

      return { h1Count: h1s.length, h1s, headingCount: allHeadings.length, hierarchyIssues, landmarks };
    });

    report.headingsAndLandmarks[pageInfo.name] = landmarksAndHeadings;
    if (landmarksAndHeadings.h1Count !== 1) {
      report.findings.push({
        wcag: '1.3.1 Info and Relationships / 2.4.6 Headings and Labels (Level AA)',
        page: pageInfo.name,
        severity: 'MAJOR',
        issue: `Expected exactly 1 <h1> per page; found ${landmarksAndHeadings.h1Count}.`,
        details: landmarksAndHeadings.h1s
      });
    }
    if (landmarksAndHeadings.hierarchyIssues.length > 0) {
      report.findings.push({
        wcag: '1.3.1 Info and Relationships (Level A)',
        page: pageInfo.name,
        severity: 'MODERATE',
        issue: `Found ${landmarksAndHeadings.hierarchyIssues.length} heading level skips (e.g. H2 to H4).`,
        details: landmarksAndHeadings.hierarchyIssues.slice(0, 5)
      });
    }

    // 3. SEMANTICS: DIV/SPAN CLICK HANDLERS & NESTED BUTTONS
    const semanticIssues = await page.evaluate(() => {
      const results = [];
      // Look for div/span with role="button"
      const pseudoButtons = document.querySelectorAll('div[role="button"], span[role="button"]');
      pseudoButtons.forEach(el => {
        results.push({
          type: 'PSEUDO_BUTTON',
          tagName: el.tagName,
          text: el.innerText?.slice(0, 40) || '',
          ariaLabel: el.getAttribute('aria-label'),
          classes: el.className
        });
      });

      // Look for button inside anchor or anchor inside button
      const nestedButtons = document.querySelectorAll('a button, button a');
      nestedButtons.forEach(el => {
        const parent = el.parentElement;
        results.push({
          type: 'NESTED_INTERACTIVE',
          child: el.tagName,
          parent: parent ? parent.tagName : null,
          text: el.innerText?.slice(0, 40) || '',
          classes: el.className
        });
      });

      return results;
    });

    if (semanticIssues.length > 0) {
      report.findings.push({
        wcag: '4.1.2 Name, Role, Value (Level A) & HTML5 Specification',
        page: pageInfo.name,
        severity: 'CRITICAL',
        issue: `Found ${semanticIssues.length} semantic issues (fake div/span buttons or nested interactive controls).`,
        details: semanticIssues
      });
    }

    // 4. TOUCH TARGET SIZES (WCAG 2.2 AA SC 2.5.8 Target Size Minimum - 24x24 px & AAA 44x44 px)
    const touchTargetIssues = await page.evaluate(() => {
      const interactives = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"]'));
      const smallTargets = [];
      for (const el of interactives) {
        // Skip hidden elements
        const style = window.getComputedStyle(el);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
        if (el.getAttribute('aria-hidden') === 'true' || el.closest('[aria-hidden="true"]')) continue;
        if (el.getAttribute('tabindex') === '-1' && el.tagName === 'INPUT') continue;
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) continue;

        // Check if strictly below 24x24 (WCAG 2.2 AA failure)
        if (rect.width < 24 || rect.height < 24) {
          smallTargets.push({
            tag: el.tagName,
            type: el.getAttribute('type'),
            text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 30).trim(),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            severity: 'FAIL_2.2_AA (< 24px)',
            classes: el.className
          });
        } else if (rect.width < 44 || rect.height < 44) {
          // Warning: below AAA recommendation (44x44)
          smallTargets.push({
            tag: el.tagName,
            type: el.getAttribute('type'),
            text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 30).trim(),
            width: Math.round(rect.width),
            height: Math.round(rect.height),
            severity: 'BELOW_44PX_RECOMMENDED',
            classes: el.className
          });
        }
      }
      return smallTargets;
    });

    const criticalTouchTargets = touchTargetIssues.filter(t => t.severity.includes('FAIL'));
    if (criticalTouchTargets.length > 0) {
      report.findings.push({
        wcag: '2.5.8 Target Size (Minimum) (WCAG 2.2 Level AA)',
        page: pageInfo.name,
        severity: 'MAJOR',
        issue: `Found ${criticalTouchTargets.length} interactive elements with touch target dimensions < 24x24 CSS pixels.`,
        details: criticalTouchTargets.slice(0, 10)
      });
    }

    // 5. IMAGES & ACCESSIBLE NAMES
    const imageIssues = await page.evaluate(() => {
      const imgs = Array.from(document.querySelectorAll('img'));
      const issues = [];
      imgs.forEach(img => {
        const alt = img.getAttribute('alt');
        const src = img.getAttribute('src') || '';
        if (alt === null) {
          issues.push({ src: src.slice(0, 60), issue: 'Missing alt attribute entirely' });
        } else if (alt === 'image' || alt === 'photo' || alt === 'picture' || alt === 'icon') {
          issues.push({ src: src.slice(0, 60), alt, issue: 'Non-descriptive placeholder alt text' });
        }
      });
      return { totalImages: imgs.length, issues };
    });

    if (imageIssues.issues.length > 0) {
      report.findings.push({
        wcag: '1.1.1 Non-text Content (Level A)',
        page: pageInfo.name,
        severity: 'MAJOR',
        issue: `Found ${imageIssues.issues.length} images with missing or non-descriptive alt attributes.`,
        details: imageIssues.issues
      });
    }

    // 6. FORMS & LABELS AUDIT
    const formAudit = await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input:not([type="hidden"]), select, textarea'));
      const unlabelled = [];
      inputs.forEach(input => {
        if (input.getAttribute('aria-hidden') === 'true' || input.closest('[aria-hidden="true"]')) return;
        if (input.getAttribute('tabindex') === '-1') return;
        const style = window.getComputedStyle(input);
        if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return;

        const id = input.id;
        const type = input.getAttribute('type');
        let hasLabel = false;
        let labelText = '';

        if (id) {
          const label = document.querySelector(`label[for="${id}"]`);
          if (label) {
            hasLabel = true;
            labelText = label.innerText.trim();
          }
        }
        // Check wrapping label
        if (!hasLabel) {
          const parentLabel = input.closest('label');
          if (parentLabel) {
            hasLabel = true;
            labelText = parentLabel.innerText.trim();
          }
        }
        // Check aria-label / aria-labelledby
        if (!hasLabel) {
          if (input.getAttribute('aria-label')) {
            hasLabel = true;
            labelText = input.getAttribute('aria-label');
          } else if (input.getAttribute('aria-labelledby')) {
            const ref = document.getElementById(input.getAttribute('aria-labelledby'));
            if (ref) {
              hasLabel = true;
              labelText = ref.innerText.trim();
            }
          }
        }

        if (!hasLabel) {
          unlabelled.push({
            tag: input.tagName,
            type,
            id: id || '(no id)',
            name: input.getAttribute('name') || '(no name)',
            placeholder: input.getAttribute('placeholder') || null,
            classes: input.className
          });
        }
      });
      return { totalInputs: inputs.length, unlabelled };
    });

    if (formAudit.unlabelled.length > 0) {
      report.findings.push({
        wcag: '1.3.1 Info and Relationships / 4.1.2 Name, Role, Value / 3.3.2 Labels or Instructions (Level A)',
        page: pageInfo.name,
        severity: 'CRITICAL',
        issue: `Found ${formAudit.unlabelled.length} form controls without any associated programmatic label (<label for="...">, aria-label, or aria-labelledby).`,
        details: formAudit.unlabelled
      });
    }
  }

  // 7. KEYBOARD NAVIGATION & FOCUS SIMULATION ON HOMEPAGE
  console.log('\n--- Running Keyboard Tab Order Simulation on Home Page ---');
  await page.setViewport({ width: 1280, height: 800 });
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const tabSequence = [];
  for (let i = 0; i < 25; i++) {
    await page.keyboard.press('Tab');
    const focusedInfo = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const rect = el.getBoundingClientRect();
      const style = window.getComputedStyle(el);
      return {
        tag: el.tagName,
        id: el.id,
        href: el.getAttribute('href'),
        text: (el.innerText || el.getAttribute('aria-label') || '').slice(0, 35).trim(),
        role: el.getAttribute('role'),
        ariaExpanded: el.getAttribute('aria-expanded'),
        ariaHasPopup: el.getAttribute('aria-haspopup'),
        outline: style.outline,
        outlineWidth: style.outlineWidth,
        outlineStyle: style.outlineStyle,
        outlineColor: style.outlineColor,
        boxShadow: style.boxShadow,
        top: Math.round(rect.top),
        left: Math.round(rect.left),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      };
    });
    if (focusedInfo) {
      tabSequence.push(focusedInfo);
    }
  }
  report.tabOrder = tabSequence;

  // 8. DROPDOWN KEYBOARD INTERACTION
  console.log('\n--- Testing Desktop Dropdown Keyboard Interaction ---');
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2' });
  // Find Services nav link
  const dropdownTestResult = await page.evaluate(() => {
    const navLinks = Array.from(document.querySelectorAll('header nav a'));
    const servicesLink = navLinks.find(l => l.innerText.toLowerCase().includes('services'));
    if (!servicesLink) return { found: false };

    const initialExpanded = servicesLink.getAttribute('aria-expanded');
    const hasControls = servicesLink.getAttribute('aria-controls');
    return {
      found: true,
      initialExpanded,
      hasControls,
      text: servicesLink.innerText
    };
  });

  if (!dropdownTestResult.hasControls) {
    report.findings.push({
      wcag: '4.1.2 Name, Role, Value (Level A) / WAI-ARIA Menu & Disclosure Pattern',
      page: 'Global Navbar',
      severity: 'MAJOR',
      issue: 'Desktop navigation dropdown triggers have aria-expanded but lack aria-controls referencing the dropdown container ID.',
      details: dropdownTestResult
    });
  }

  // 9. MOBILE NAVIGATION & DRAWER TEST (375x667)
  console.log('\n--- Testing Mobile Navigation Drawer on 375px Viewport ---');
  await page.setViewport({ width: 375, height: 667 });
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const mobileNavTest = await page.evaluate(async () => {
    const menuBtn = document.querySelector('header button[aria-controls="mobile-navigation-drawer"]');
    if (!menuBtn) return { error: 'Mobile hamburger button not found' };

    const initialExpanded = menuBtn.getAttribute('aria-expanded');
    menuBtn.click();
    await new Promise(r => setTimeout(r, 400));

    const drawer = document.getElementById('mobile-navigation-drawer');
    const drawerVisible = drawer ? window.getComputedStyle(drawer).display !== 'none' : false;
    const openedExpanded = menuBtn.getAttribute('aria-expanded');

    // Check body scroll lock
    const bodyOverflow = document.body.style.overflow;

    // Check aria-current on active link
    const links = drawer ? Array.from(drawer.querySelectorAll('a')) : [];
    const activeLink = links.find(l => l.getAttribute('aria-current') !== null);

    return {
      initialExpanded,
      openedExpanded,
      drawerVisible,
      bodyOverflow,
      hasAriaCurrent: Boolean(activeLink),
      linkCount: links.length
    };
  });

  if (!mobileNavTest.hasAriaCurrent) {
    report.findings.push({
      wcag: '4.1.2 Name, Role, Value / 1.3.1 Info and Relationships (Level A)',
      page: 'Global Navbar',
      severity: 'MODERATE',
      issue: 'Active navigation links do not use aria-current="page" to convey current page state to assistive technologies.',
      details: mobileNavTest
    });
  }

  // 10. COLOR CONTRAST TEST (LIGHT & DARK THEMES)
  console.log('\n--- Testing Color Contrast Ratios (Light vs Dark) ---');
  for (const theme of ['light', 'dark']) {
    await page.setViewport({ width: 1280, height: 800 });
    await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2' });
    await page.evaluate((th) => {
      if (th === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.classList.add('light');
      }
    }, theme);
    await new Promise(r => setTimeout(r, 600));

    const contrastSample = await page.evaluate(() => {
      // Sample key elements across the page
      const elements = [
        { name: 'Navbar Links', selector: 'header nav a' },
        { name: 'Subheadline', selector: 'section p' },
        { name: 'Section Badges', selector: 'span[class*="rounded-full"]' },
        { name: 'Muted text', selector: '.text-muted-foreground' },
        { name: 'Footer links', selector: 'footer a' }
      ];

      function getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
          v /= 255;
          return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
      }

      function parseRgb(colorStr) {
        const match = colorStr.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (!match) return null;
        return [parseInt(match[1]), parseInt(match[2]), parseInt(match[3])];
      }

      function contrastRatio(rgb1, rgb2) {
        const l1 = getLuminance(rgb1[0], rgb1[1], rgb1[2]);
        const l2 = getLuminance(rgb2[0], rgb2[1], rgb2[2]);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      }

      const results = [];
      elements.forEach(item => {
        const el = document.querySelector(item.selector);
        if (!el) return;
        const style = window.getComputedStyle(el);
        const color = style.color;
        // Search upward for non-transparent background
        let cur = el;
        let bgColor = 'rgb(255, 255, 255)';
        while (cur && cur !== document.documentElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
            bgColor = bg;
            break;
          }
          cur = cur.parentElement;
        }
        const fgRgb = parseRgb(color);
        const bgRgb = parseRgb(bgColor);
        if (fgRgb && bgRgb) {
          const ratio = Math.round(contrastRatio(fgRgb, bgRgb) * 100) / 100;
          results.push({
            element: item.name,
            fg: color,
            bg: bgColor,
            ratio,
            passesNormal: ratio >= 4.5,
            passesLarge: ratio >= 3.0
          });
        }
      });
      return results;
    });

    report.colorContrast[theme] = contrastSample;
  }

  // 11. REDUCED MOTION TEST
  console.log('\n--- Testing Reduced Motion Preference Handling ---');
  await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2' });
  const motionCheck = await page.evaluate(() => {
    // Check computed animation duration on elements with animation classes
    const drifting = document.querySelector('.animate-blob-1, .animate-ambient-drift-1, .animate-text-shimmer');
    if (!drifting) return { exists: false };
    const style = window.getComputedStyle(drifting);
    return {
      exists: true,
      animationName: style.animationName,
      animationDuration: style.animationDuration
    };
  });
  report.reducedMotion = motionCheck;

  // 12. 200% ZOOM & REFOLW TEST (WCAG 1.4.4 Resize text & 1.4.10 Reflow)
  console.log('\n--- Testing 200% Zoom / 640px Reflow ---');
  // 1280px / 200% zoom = 640px width without horizontal scroll
  await page.setViewport({ width: 640, height: 700 });
  await page.goto('http://localhost:3000/en', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1000));

  const zoomTest = await page.evaluate(() => {
    const scrollWidth = document.documentElement.scrollWidth;
    const clientWidth = document.documentElement.clientWidth;
    const hasHorizontalOverflow = scrollWidth > clientWidth;
    return {
      scrollWidth,
      clientWidth,
      overflowPx: scrollWidth - clientWidth,
      hasHorizontalOverflow
    };
  });
  report.zoom200 = zoomTest;

  await browser.close();

  fs.writeFileSync('C:\\Users\\abdev\\.gemini\\antigravity-ide\\brain\\d2d50748-61c7-4c65-8e1f-df169d7c1024\\a11y_audit_raw_results.json', JSON.stringify(report, null, 2));
  console.log('\nAudit complete! Results written to a11y_audit_raw_results.json');
  console.log(`Total Findings: ${report.findings.length}`);
  report.findings.forEach((f, idx) => {
    console.log(`[${idx + 1}] [${f.severity}] ${f.wcag} - ${f.issue} (Page: ${f.page})`);
  });
}

runAudit().catch(err => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
