import puppeteer from 'puppeteer-core';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:3000';
const sleep = ms => new Promise(r => setTimeout(r, ms));

async function runJourney1() {
  console.log('--- TESTING JOURNEY 1 COMPLETE 5-STEP CONVERSION ---');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--window-size=1440,900']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  page.on('console', msg => {
    if (msg.type() === 'error') console.error('Browser console error:', msg.text());
  });

  page.on('request', req => {
    if (req.url().includes('/api/start-project')) {
      console.log('POST /api/start-project payload:', req.postData());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('/api/start-project')) {
      console.log('POST /api/start-project response status:', res.status());
      try {
        const body = await res.text();
        console.log('POST /api/start-project response body:', body);
      } catch (e) {
        console.log('Could not read response body:', e.message);
      }
    }
  });

  // 1. Home
  await page.goto(`${BASE_URL}/en`, { waitUntil: 'networkidle2' });
  console.log('1. On Home Page');

  // 2. Service
  await page.goto(`${BASE_URL}/en/services/ai-development`, { waitUntil: 'networkidle2' });
  console.log('2. On Service Page: AI Development');

  // 3. Case Study
  await page.goto(`${BASE_URL}/en/work/case-studies/financeflow`, { waitUntil: 'networkidle2' });
  console.log('3. On Case Study: FinanceFlow');

  // 4. Start Project
  await page.goto(`${BASE_URL}/en/start-project`, { waitUntil: 'networkidle2' });
  console.log('4. On Start Project Page');
  await sleep(1000);

  // STEP 1: Project Discipline
  console.log('Interacting with Step 1: Project Discipline');
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div, button, label'));
    const target = cards.find(c => c.innerText && c.innerText.includes('AI Development & Agents'));
    if (target) target.click();
  });
  await sleep(500);

  // Click Continue to Step 2
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText && b.innerText.includes('Continue to Step 2'));
    if (nextBtn) nextBtn.click();
  });
  await sleep(800);

  // STEP 2: Project Scope
  console.log('Interacting with Step 2: Project Scope');
  await page.waitForSelector('textarea');
  await page.type('textarea', 'We need an enterprise AI system that scales automatically, securely, and seamlessly.');

  // Select Industry: Fintech
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const indBtn = btns.find(b => b.innerText && b.innerText.includes('Fintech'));
    if (indBtn) indBtn.click();
  });
  await sleep(300);

  // Select Product State: New Product
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[role="button"], div'));
    const prodCard = cards.find(c => c.innerText && c.innerText.includes('New Product from Scratch'));
    if (prodCard) prodCard.click();
  });
  await sleep(500);

  // Click Continue to Step 3
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText && b.innerText.includes('Continue to Step 3'));
    if (nextBtn) nextBtn.click();
  });
  await sleep(800);

  // STEP 3: Parameters
  console.log('Interacting with Step 3: Parameters');
  // Budget
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
    const budgetBtn = btns.find(b => b.innerText && b.innerText.includes('$25,000 - $50,000'));
    if (budgetBtn) budgetBtn.click();
  });
  await sleep(300);

  // Timeline
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button, div[role="button"]'));
    const timeBtn = btns.find(b => b.innerText && b.innerText.includes('3 - 6 Months'));
    if (timeBtn) timeBtn.click();
  });
  await sleep(300);

  // Stage
  await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('div[role="button"], div'));
    const stageCard = cards.find(c => c.innerText && c.innerText.includes('Ready to Build Immediately'));
    if (stageCard) stageCard.click();
  });
  await sleep(500);

  // Click Continue to Step 4
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText && b.innerText.includes('Continue to Step 4'));
    if (nextBtn) nextBtn.click();
  });
  await sleep(800);

  // STEP 4: Contact Info
  console.log('Interacting with Step 4: Contact Info');
  await page.waitForSelector('#wizard-name');
  await page.type('#wizard-name', 'Alex QA Tester');
  await page.type('#wizard-email', 'alex.qa@astraiv-test.com');
  await page.type('#wizard-company', 'Astraiv QA Corp');

  // Click Continue to Step 5
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const nextBtn = btns.find(b => b.innerText && b.innerText.includes('Continue to Step 5'));
    if (nextBtn) nextBtn.click();
  });
  await sleep(1000);

  // STEP 5: Review & Submit
  console.log('On Step 5: Review & Submit');
  // Wait to satisfy anti-spam velocity threshold (> 2.5s)
  console.log('Waiting 3.5 seconds to pass anti-spam velocity check...');
  await sleep(3500);

  // Click Final Submit
  console.log('Clicking "Submit Project Brief"...');
  await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    const submitBtn = btns.find(b => b.innerText && b.innerText.includes('Submit Project Brief'));
    if (submitBtn) submitBtn.click();
  });

  console.log('Waiting for Thank You page redirect...');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 }).catch(() => null);

  const finalUrl = page.url();
  console.log('Final URL after submit:', finalUrl);

  const pageTitle = await page.title();
  const heading = await page.$eval('h1', el => el.innerText.trim()).catch(() => 'No H1');
  console.log(`Final Page Title: "${pageTitle}", H1: "${heading}"`);

  if (finalUrl.includes('/thank-you')) {
    console.log('SUCCESS: JOURNEY 1 COMPLETE! Reached Thank You page successfully.');
  } else {
    const errorText = await page.evaluate(() => {
      const err = document.querySelector('[role="alert"], .text-destructive');
      return err ? err.innerText : 'No visible alert';
    });
    console.log('Current page alert:', errorText);
  }

  await browser.close();
}

runJourney1().catch(console.error);
