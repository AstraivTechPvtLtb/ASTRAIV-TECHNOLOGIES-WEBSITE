import puppeteer from 'puppeteer-core';
import fs from 'fs';

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function deepAudit() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  const findings = [];

  // TEST 1: Mega-menu widths and positioning on desktop viewports (1024, 1280, 1440)
  for (const width of [1024, 1152, 1280, 1440]) {
    await page.setViewport({ width, height: 768 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 1000));

    // Get all nav items with dropdowns
    const navItems = ['services', 'solutions', 'industries', 'work', 'insights', 'company'];
    for (const itemId of navItems) {
      // Hover over the item link
      const hovered = await page.evaluate((id) => {
        const links = Array.from(document.querySelectorAll('nav a'));
        const link = links.find(l => l.getAttribute('href')?.includes(id));
        if (!link) return null;
        link.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
        return true;
      }, itemId);

      if (hovered) {
        await new Promise(r => setTimeout(r, 300));
        const menuRect = await page.evaluate(() => {
          const menu = document.querySelector('[role="menu"]');
          if (!menu) return null;
          const r = menu.getBoundingClientRect();
          return {
            left: r.left,
            right: r.right,
            width: r.width,
            exceedsRight: r.right > window.innerWidth,
            exceedsLeft: r.left < 0,
            overflowAmountRight: Math.round(r.right - window.innerWidth),
            overflowAmountLeft: Math.round(-r.left)
          };
        });

        if (menuRect && (menuRect.exceedsRight || menuRect.exceedsLeft)) {
          findings.push({
            type: 'MegaMenu Overflow',
            viewportWidth: width,
            itemId,
            menuRect
          });
          console.warn(`[MEGA MENU OVERFLOW] at ${width}px on item "${itemId}":`, menuRect);
        }
      }
    }
  }

  // TEST 2: Inspect Hero Section at 320, 360, 375, 480, 640, 768, 1024, 1440
  for (const width of [320, 360, 375, 480, 640, 768, 1024]) {
    await page.setViewport({ width, height: 600 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 800));

    const heroDetails = await page.evaluate((w) => {
      const h1 = document.querySelector('h1');
      const ctaContainer = document.querySelector('h1 + p + div');
      const ctaButtons = ctaContainer ? Array.from(ctaContainer.querySelectorAll('button')) : [];

      let h1Details = null;
      if (h1) {
        const r = h1.getBoundingClientRect();
        const style = window.getComputedStyle(h1);
        h1Details = {
          text: h1.innerText.trim(),
          scrollWidth: h1.scrollWidth,
          clientWidth: h1.clientWidth,
          fontSize: style.fontSize,
          whiteSpace: style.whiteSpace,
          isClipping: h1.scrollWidth > h1.clientWidth + 1,
          exceedsWindow: r.right > window.innerWidth
        };
      }

      const buttons = ctaButtons.map(b => {
        const r = b.getBoundingClientRect();
        return {
          text: b.innerText.trim(),
          width: Math.round(r.width),
          height: Math.round(r.height),
          left: Math.round(r.left),
          right: Math.round(r.right),
          exceeds: r.right > window.innerWidth
        };
      });

      return { width: w, h1Details, buttons };
    }, width);

    if (heroDetails.h1Details?.isClipping || heroDetails.h1Details?.exceedsWindow) {
      findings.push({
        type: 'Hero H1 Clipping/Overflow',
        viewportWidth: width,
        details: heroDetails
      });
      console.warn(`[HERO H1 ISSUE] at ${width}px:`, heroDetails.h1Details);
    }
  }

  // TEST 3: Inspect Mobile Drawer at 320, 360, 375, 414, 480
  for (const width of [320, 360, 375, 414]) {
    await page.setViewport({ width, height: 640 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    // Open mobile menu
    const clicked = await page.evaluate(() => {
      const btn = document.querySelector('button[aria-label="Open menu"]');
      if (btn) {
        btn.click();
        return true;
      }
      return false;
    });

    if (clicked) {
      await new Promise(r => setTimeout(r, 500));
      const drawerDetails = await page.evaluate(() => {
        const drawer = document.getElementById('mobile-navigation-drawer');
        if (!drawer) return null;
        const r = drawer.getBoundingClientRect();
        return {
          scrollWidth: drawer.scrollWidth,
          clientWidth: drawer.clientWidth,
          hasOverflow: drawer.scrollWidth > drawer.clientWidth,
          boundingRight: r.right,
          winWidth: window.innerWidth
        };
      });

      if (drawerDetails && (drawerDetails.hasOverflow || drawerDetails.boundingRight > width)) {
        findings.push({
          type: 'Mobile Drawer Overflow',
          viewportWidth: width,
          details: drawerDetails
        });
        console.warn(`[MOBILE DRAWER OVERFLOW] at ${width}px:`, drawerDetails);
      }
    }
  }

  // TEST 4: Inspect Forms on /contact and /start-project for mobile touch targets and overflow
  for (const formUrl of ['http://localhost:3000/contact', 'http://localhost:3000/start-project']) {
    for (const width of [320, 360, 375, 480]) {
      await page.setViewport({ width, height: 700 });
      await page.goto(formUrl, { waitUntil: 'domcontentloaded' });
      await new Promise(r => setTimeout(r, 1000));

      const formIssues = await page.evaluate((w, url) => {
        const inputs = Array.from(document.querySelectorAll('input, select, textarea, button'));
        const issues = [];
        for (const el of inputs) {
          const r = el.getBoundingClientRect();
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || r.width === 0) continue;
          if (r.right > window.innerWidth + 1) {
            issues.push({
              tag: el.tagName,
              name: el.name || el.id || el.placeholder || el.innerText,
              rect: { left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) }
            });
          }
        }
        return { width: w, url, issues };
      }, width, formUrl);

      if (formIssues.issues.length > 0) {
        findings.push({
          type: 'Form Element Overflow',
          formIssues
        });
        console.warn(`[FORM ELEMENT OVERFLOW] on ${formUrl} at ${width}px:`, formIssues.issues);
      }
    }
  }

  // TEST 5: Inspect Footer layout across 320, 360, 480, 640, 768, 1024, 1440
  for (const width of [320, 360, 480, 640, 768]) {
    await page.setViewport({ width, height: 800 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));

    const footerDetails = await page.evaluate((w) => {
      const footer = document.querySelector('footer');
      if (!footer) return null;
      const r = footer.getBoundingClientRect();
      const grid = footer.querySelector('.grid') || footer;
      const gridStyle = window.getComputedStyle(grid);
      return {
        width: w,
        scrollWidth: footer.scrollWidth,
        clientWidth: footer.clientWidth,
        gridColumns: gridStyle.gridTemplateColumns,
        hasOverflow: footer.scrollWidth > footer.clientWidth
      };
    }, width);

    if (footerDetails && footerDetails.hasOverflow) {
      findings.push({
        type: 'Footer Overflow',
        viewportWidth: width,
        details: footerDetails
      });
      console.warn(`[FOOTER OVERFLOW] at ${width}px:`, footerDetails);
    }
  }

  await browser.close();

  fs.mkdirSync('scratch', { recursive: true });
  fs.writeFileSync('scratch/deep_audit_results.json', JSON.stringify(findings, null, 2));
  console.log(`\nDeep interactive audit finished. Total findings: ${findings.length}`);
}

deepAudit().catch(console.error);
