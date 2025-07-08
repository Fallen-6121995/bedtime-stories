const puppeteer = require('puppeteer');

async function scrapeScribdWithPuppeteer(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: 'networkidle2' });

  // Wait for the content to load and select the correct element
  // You may need to update the selector based on the actual page structure
  const storyText = await page.evaluate(() => {
    // Try to find the main content
    const el = document.querySelector('div#document-content');
    return el ? el.innerText : '';
  });

  await browser.close();
  return storyText.trim();
}

// Usage
scrapeScribdWithPuppeteer('https://www.scribd.com/document/474669807/Panchatantra')
  .then(story => console.log(story));