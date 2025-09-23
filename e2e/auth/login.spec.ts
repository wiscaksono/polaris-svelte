import { test, expect } from '../fixtures/auth';

test.describe('Authentication Flow', () => {
	// NEW TEST: Verifies redirect from /login if already authenticated
	test('redirects to dashboard if user is already logged in', async ({ page }) => {
		// 1. Go to the base URL to establish a valid origin for localStorage
		await page.goto('/');

		// 2. NOW it's safe to set the token in localStorage
		await page.evaluate(() => window.localStorage.setItem('api_token', 'my-fake-auth-token'));

		// 3. Navigate to the login page to trigger the redirect
		await page.goto('/login');

		// 4. Assert that the app redirects correctly
		await expect(page).toHaveURL('/');
	});

	test('redirects to login if user visits a protected route while logged out', async ({ page }) => {
		// Attempt to go directly to the dashboard
		await page.goto('/');

		// Assert that the app redirects to the login page
		await expect(page).toHaveURL('/login');
		await expect(page.getByRole('heading', { name: 'Login to your account' })).toBeVisible();
	});

	test('successful login redirects to dashboard', async ({ page, loginPage }) => {
		await loginPage.goto();
		await loginPage.login('billi', 'Asdf12345');

		await expect(page).toHaveURL('/'); // Your onSuccess redirects to '/'
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
	});

	test('shows loading spinner and disables button on submission', async ({ page, loginPage }) => {
		await loginPage.goto();
		await loginPage.login('billi', 'Asdf12345');

		await expect(loginPage.loginButton).toBeDisabled();
		await expect(loginPage.loadingSpinner).toBeVisible();

		await expect(page).toHaveURL('/');
		await expect(loginPage.loadingSpinner).toBeHidden();
		await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
	});
});
