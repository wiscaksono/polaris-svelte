import puppeteer, { type Browser, type Page } from 'puppeteer';
import { error, type RequestHandler } from '@sveltejs/kit';

let browserPromise: Promise<Browser> | null = null;
let idleTimeout: NodeJS.Timeout | null = null;

function getBrowser(): Promise<Browser> {
	if (!browserPromise) {
		console.log('No active browser found. Initializing new shared instance...');
		browserPromise = puppeteer.launch({
			headless: true,
			args: [
				'--no-sandbox',
				'--disable-setuid-sandbox',
				'--disable-dev-shm-usage',
				'--disable-accelerated-2d-canvas',
				'--no-first-run',
				'--no-zygote',
				'--disable-gpu'
			]
		});
	}
	return browserPromise;
}

async function closeBrowser() {
	if (!browserPromise) return;
	console.log('Browser has been idle. Closing instance to free resources...');
	const browser = await browserPromise;
	await browser.close();
	browserPromise = null;
	if (idleTimeout) {
		clearTimeout(idleTimeout);
		idleTimeout = null;
	}
}

export const POST: RequestHandler = async ({ request }) => {
	if (idleTimeout) {
		clearTimeout(idleTimeout);
		idleTimeout = null;
	}

	const { url, selector } = (await request.json()) as { url?: string; selector?: string };

	if (!url || !/^https?:\/\/.+/.test(url)) return error(400, 'Invalid or missing URL parameter.');
	if (!selector) return error(400, 'Missing selector parameter for element capture.');

	let page: Page | null = null;

	try {
		const browser = await getBrowser();
		page = await browser.newPage();

		await page.setViewport({ width: 1920, height: 1080 });
		await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

		const element = await page.waitForSelector(selector, { timeout: 90000 });
		if (!element) return error(404, 'The specified element was not found on the page.');

		const screenshot = await element.screenshot({ encoding: 'binary' });

		return new Response(screenshot, {
			status: 200,
			headers: {
				'Content-Type': 'image/png',
				'Content-Length': screenshot.length.toString()
			}
		});
	} catch (err: unknown) {
		let errorMessage = 'An unknown error occurred while capturing the screenshot.';
		if (err instanceof Error) errorMessage = `An error occurred: ${err.message}`;
		console.error(errorMessage);
		return error(500, errorMessage);
	} finally {
		if (page) await page.close();
		console.log('Request finished. Setting idle timeout for 60 seconds.');
		idleTimeout = setTimeout(closeBrowser, 30000); // 30 seconds
	}
};
