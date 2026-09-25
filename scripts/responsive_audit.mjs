import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { width: 320, height: 568, name: '320_small_mobile_portrait' },
  { width: 360, height: 800, name: '360_android_portrait' },
  { width: 375, height: 667, name: '375_iphone_se_portrait' },
  { width: 390, height: 844, name: '390_iphone14_portrait' },
  { width: 414, height: 896, name: '414_iphone_plus_portrait' },
  { width: 480, height: 854, name: '480_large_mobile' },
  { width: 640, height: 360, name: '640_landscape_mobile_short' },
  { width: 768, height: 1024, name: '768_ipad_portrait' },
  { width: 820, height: 1180, name: '820_ipad_air_portrait' },
  { width: 1024, height: 768, name: '1024_ipad_landscape_laptop' },
  { width: 1280, height: 720, name: '1280_short_laptop' },
  { width: 1366, height: 768, name: '1366_common_laptop_short' },
  { width: 1440, height: 900, name: '1440_macbook' },
  { width: 1536, height: 864, name: '1536_scaled_laptop' },
  { width: 1920, height: 1080, name: '1920_fhd_desktop' },
  { width: 2560, height: 1440, name: '2560_qhd_ultrawide' }
];

const PAGES = [
  '/',
  '/services',
  '/solutions',
  '/technology',
  '/work',
  '/industries',
  '/careers',
  '/pricing',
  '/company',
  '/contact',
  '/start-project',
  '/faq',
  '/insights'
];

const CHROME_PATH = fs.existsSync('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe')
  ? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  : 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';

async function runAudit() {
  console.log(`Launching browser from: ${CHROME_PATH}`);
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const allIssues = [];

  for (const pagePath of PAGES) {
    const pageUrl = `http://localhost:3000${pagePath}`;
    console.log(`\n========================================\nAuditing Page: ${pageUrl}\n========================================`);

    const page = await browser.newPage();
    
    // Set English language header
    await page.setExtraHTTPHeaders({
      'Accept-Language': 'en-US,en;q=0.9'
    });

    try {
      await page.goto(pageUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
      // Wait extra for client components & fonts to settle
      await new Promise(r => setTimeout(r, 1500));
    } catch (e) {
      console.error(`Failed to load ${pageUrl}: ${e.message}`);
      await page.close();
      continue;
    }

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.width, height: vp.height });
      await new Promise(r => setTimeout(r, 400));

      const evaluation = await page.evaluate((vpInfo) => {
        const docWidth = document.documentElement.scrollWidth;
        const bodyWidth = document.body.scrollWidth;
        const winWidth = window.innerWidth;
        const hasHorizontalOverflow = docWidth > winWidth + 1 || bodyWidth > winWidth + 1;

        // Find elements that bleed beyond the window boundary
        const overflowingElements = [];
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
          // ignore script, style, svg inner tags
          if (['SCRIPT', 'STYLE', 'HEAD', 'META', 'TITLE', 'PATH', 'G', 'DEFS'].includes(el.tagName)) continue;
          
          const rect = el.getBoundingClientRect();
          // Element is visible if it has width and height and not display none
          const style = window.getComputedStyle(el);
          if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;

          // Check if right edge exceeds window width significantly
          if (rect.right > winWidth + 2 && rect.width > 0 && rect.height > 0) {
            // Check if element has an ancestor with overflow: hidden or auto
            let parent = el.parentElement;
            let clipped = false;
            while (parent && parent !== document.body && parent !== document.documentElement) {
              const pStyle = window.getComputedStyle(parent);
              if (['hidden', 'auto', 'scroll'].includes(pStyle.overflowX)) {
                clipped = true;
                break;
              }
              parent = parent.parentElement;
            }

            if (!clipped) {
              overflowingElements.push({
                tag: el.tagName,
                id: el.id || '',
                className: (typeof el.className === 'string' ? el.className.split(' ').slice(0, 4).join(' ') : ''),
                rect: { left: Math.round(rect.left), right: Math.round(rect.right), width: Math.round(rect.width) },
                textPreview: (el.textContent || '').trim().slice(0, 40)
              });
            }
          }
        }

        // Check for small interactive touch targets on mobile (widths <= 640)
        const smallTouchTargets = [];
        if (winWidth <= 640) {
          const interactives = document.querySelectorAll('button, a, input, select, textarea, [role="button"]');
          for (const item of interactives) {
            const rect = item.getBoundingClientRect();
            const style = window.getComputedStyle(item);
            if (style.display === 'none' || style.visibility === 'hidden' || rect.width === 0 || rect.height === 0) continue;
            // standard target is min 40-44px
            if ((rect.width < 32 || rect.height < 32) && rect.top >= 0 && rect.bottom <= window.innerHeight) {
              smallTouchTargets.push({
                tag: item.tagName,
                text: (item.textContent || '').trim().slice(0, 30),
                width: Math.round(rect.width),
                height: Math.round(rect.height),
                className: (typeof item.className === 'string' ? item.className.split(' ').slice(0, 3).join(' ') : '')
              });
            }
          }
        }

        return {
          vp: vpInfo,
          winWidth,
          docWidth,
          bodyWidth,
          hasHorizontalOverflow,
          overflowingCount: overflowingElements.length,
          overflowingElements: overflowingElements.slice(0, 5),
          smallTouchTargetCount: smallTouchTargets.length,
          smallTouchTargets: smallTouchTargets.slice(0, 5)
        };
      }, vp);

      if (evaluation.hasHorizontalOverflow || evaluation.overflowingCount > 0) {
        console.warn(`[OVERFLOW] ${pagePath} @ ${vp.width}x${vp.height} (${vp.name}): docWidth=${evaluation.docWidth} vs winWidth=${evaluation.winWidth}`);
        if (evaluation.overflowingElements.length > 0) {
          console.warn('  Offenders:', JSON.stringify(evaluation.overflowingElements, null, 2));
        }
        allIssues.push({
          page: pagePath,
          viewport: vp,
          issue: 'Horizontal Overflow',
          details: evaluation
        });
      } else {
        process.stdout.write(`.`);
      }
    }
    console.log(` done.`);
    await page.close();
  }

  await browser.close();

  const reportPath = path.resolve('scratch/responsive_audit_results.json');
  fs.mkdirSync(path.dirname(reportPath), { recursive: true });
  fs.writeFileSync(reportPath, JSON.stringify(allIssues, null, 2));
  console.log(`\nAudit complete! Found ${allIssues.length} total overflow issues across matrix. Report saved to: ${reportPath}`);
}

runAudit().catch(err => {
  console.error('Audit run error:', err);
  process.exit(1);
});
