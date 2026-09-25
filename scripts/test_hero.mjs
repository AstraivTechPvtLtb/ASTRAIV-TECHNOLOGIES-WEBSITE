import puppeteer from 'puppeteer-core';

(async () => {
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    headless: true,
    args: ['--no-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 320, height: 600 });
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await new Promise(r => setTimeout(r, 600));
  const details = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const spans = Array.from(h1.querySelectorAll('span'));
    return {
      h1Width: h1.clientWidth,
      h1Scroll: h1.scrollWidth,
      spans: spans.map(s => ({
        text: s.innerText,
        width: Math.round(s.getBoundingClientRect().width),
        scrollWidth: s.scrollWidth,
        className: s.className
      })).filter(s => s.width > 200)
    };
  });
  console.log('320px details:', JSON.stringify(details, null, 2));
  await browser.close();
})();
