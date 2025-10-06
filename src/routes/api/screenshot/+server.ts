import puppeteer from 'puppeteer';

import { error } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

// example 
// /api/screenshot?url=https://www.google.com&selector=div.g

export const GET: RequestHandler = async ({ url: internalURL }) => {
  const url = internalURL.searchParams.get('url');
  const selector = internalURL.searchParams.get('selector');

  console.log(url, selector)

  if (!url || !/^https?:\/\/.+/.test(url)) return error(400, { message: 'Invalid or missing URL' });
  if (!selector) return error(400, { message: 'Missing selector for element capture' });

  let browser;

  try {
    browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });

    const page = await browser.newPage();

    // Set viewport ke 1080p
    await page.setViewport({
      width: 1920,
      height: 1080
    });

    await page.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    // Tunggu element muncul
    const element = await page.waitForSelector(selector, { timeout: 60000 });

    if (!element) return error(404, { message: 'Element not found' });

    // Screenshot hanya elemen itu beserta anak-anaknya
    const screenshot = await element.screenshot({ type: 'png' });

    return new Response(screenshot, {
      headers: { 'Content-Type': 'image/png' }
    });
  } catch (err) {
    console.error(err);
    return error(500, { message: 'Failed to capture element screenshot' });
  } finally {
    if (browser) {
      await browser.close();
    }
  }

}
