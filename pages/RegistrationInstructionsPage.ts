import { Page, Locator, expect } from '@playwright/test';

export class RegistrationInstructionsPage {
    private readonly page: Page;
    private readonly registerHeader: Locator;
    private readonly manuallyAddAccountLink: Locator;
    private readonly googlePlayButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerHeader = page.getByText('Register to employee portal');
        this.manuallyAddAccountLink = page.getByRole('link', { name: 'manually add an account to' });
        this.googlePlayButton = page.getByRole('img', { name: 'Get it on Google Play' });
    }

    async navigateToManualRegistrationInstructionsPage(): Promise<void> {
        await this.manuallyAddAccountLink.click()
    }

    async assertUrlContainsRegistration(): Promise<void> {
        await expect(this.page).toHaveURL(/instructions\/en\/registration$/);
    }

    async navigateToGooglePlay(): Promise<void> {
        await this.googlePlayButton.click()
    }
}