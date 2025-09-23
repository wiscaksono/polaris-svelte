import { test as base } from '@playwright/test';
import { LoginPage } from '../pom/login-page';
import type { Page } from '@playwright/test';

type AuthFixtures = {
	loggedInPage: Page;
	loginPage: LoginPage;
};

export const test = base.extend<AuthFixtures>({
	loginPage: async ({ page }, use) => {
		await use(new LoginPage(page));
	},

	loggedInPage: async ({ page }, use) => {
		const loginPage = new LoginPage(page);

		await loginPage.goto();
		await loginPage.login('testuser@example.com', 'strong-password-123');
		await page.waitForURL('/');

		await use(page);
	}
});

export { expect } from '@playwright/test';
