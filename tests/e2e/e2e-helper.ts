import puppeteer, { Browser, Page } from 'puppeteer-core';
import fs from 'fs';

export const BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

/**
 * Discovers the local browser executable across Windows, Linux, and macOS environments.
 */
export function findBrowserExecutable(): string {
  if (process.env.PUPPETEER_EXECUTABLE_PATH && fs.existsSync(process.env.PUPPETEER_EXECUTABLE_PATH)) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) {
    return process.env.CHROME_BIN;
  }

  // Windows candidate locations
  const windowsCandidates = [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
  ];

  // Linux / CI candidate locations
  const linuxCandidates = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium-browser',
    '/usr/bin/chromium',
  ];

  // macOS candidate locations
  const macCandidates = [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ];

  const allCandidates = [...windowsCandidates, ...linuxCandidates, ...macCandidates];
  for (const candidate of allCandidates) {
    if (candidate && fs.existsSync(candidate)) {
      return candidate;
    }
  }

  throw new Error(
    'No valid Chrome or Edge browser executable found. Please install Chrome or set PUPPETEER_EXECUTABLE_PATH.'
  );
}

/**
 * Checks whether the target web server is reachable.
 */
export async function isServerReachable(url = BASE_URL): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);
    return res.status >= 200 && res.status < 500;
  } catch {
    return false;
  }
}

/**
 * Launches headless browser with optimized flags for CI and local automated testing.
 */
export async function createE2EBrowser(): Promise<{ browser: Browser; page: Page }> {
  const executablePath = findBrowserExecutable();
  const browser = await puppeteer.launch({
    executablePath,
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--window-size=1280,800',
    ],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  return { browser, page };
}

/**
 * Safely clicks an element matching a selector or containing specific text.
 */
export async function clickByText(page: Page, selector: string, text: string | RegExp): Promise<boolean> {
  return page.evaluate(
    ({ selector, text, isRegex }) => {
      const elements = Array.from(document.querySelectorAll(selector));
      const target = elements.find((el) => {
        const content = el.textContent || '';
        return isRegex ? new RegExp(text, 'i').test(content) : content.toLowerCase().includes(text.toLowerCase());
      });

      if (target) {
        (target as HTMLElement).click();
        return true;
      }
      return false;
    },
    { selector, text: text instanceof RegExp ? text.source : text, isRegex: text instanceof RegExp }
  );
}
