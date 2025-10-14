import puppeteer, { type Browser } from 'puppeteer';
import { error, type RequestHandler } from '@sveltejs/kit';

// Helper function to launch a Puppeteer browser instance.
// It's defined outside the request handler to allow for potential reuse or caching.
async function launchBrowser(): Promise<Browser> {
	return puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});
}

export const POST: RequestHandler = async ({ request }) => {
	const { url, selector } = (await request.json()) as { url?: string; selector?: string };

	// Validate 'url' and 'selector' query parameters.
	if (!url || !/^https?:\/\/.+/.test(url)) {
		return error(400, 'Invalid or missing URL parameter.');
	}
	if (!selector) {
		return error(400, 'Missing selector parameter for element capture.');
	}

	let browser: Browser | null = null;

	try {
		browser = await launchBrowser();
		const page = await browser.newPage();

		// Set a standard viewport size.
		await page.setViewport({ width: 1920, height: 1080 });

		// Navigate to the URL and wait for the network to be idle.
		// Increased timeout for SPAs that might have longer loading times.
		await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });

		// Wait for the specified element to be rendered on the page.
		const element = await page.waitForSelector(selector, { timeout: 90000 });
		if (!element) return error(404, 'The specified element was not found on the page.');

		// Take a screenshot of the element.
		const screenshot = await element.screenshot({ encoding: 'binary' });

		// Return the screenshot as a PNG image.
		return new Response(screenshot, {
			status: 200,
			headers: {
				'Content-Type': 'image/png',
				'Content-Length': screenshot.length.toString()
			}
		});
	} catch (err: unknown) {
		// More detailed error handling.
		let errorMessage = 'An unknown error occurred while capturing the screenshot.';
		if (err instanceof Error) {
			if (err.name === 'TimeoutError') {
				errorMessage = `Navigation or element selection timed out: ${err.message}`;
			} else {
				errorMessage = `An error occurred: ${err.message}`;
			}
		}
		console.error(errorMessage); // Log the error for debugging.
		return error(500, errorMessage);
	} finally {
		// Ensure the browser is closed, even if an error occurred.
		if (browser) {
			await browser.close();
		}
	}
};
