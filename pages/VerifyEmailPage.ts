import { Page, Locator, expect } from '@playwright/test';

export class VerifyEmailPage {
    private readonly page: Page;
    private readonly verifyHeader: Locator;
    private readonly instructionsMessage: Locator;
    private readonly noEmailReceivedMessage: Locator;
    private readonly resendEmailLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.verifyHeader = page.getByText('Verify email address');
        this.instructionsMessage = page.getByText('We sent an email with');
        this.noEmailReceivedMessage = page.getByText("Haven't received an email");
        this.resendEmailLink = page.getByRole('link', { name: 'Re-send the email.' });
    }

    async assertVerifyEmailPageVisible(): Promise<void> {
        await expect(this.verifyHeader).toBeVisible();
        await expect(this.instructionsMessage).toBeVisible();
        await expect(this.noEmailReceivedMessage).toBeVisible();
    }

    async resendVerificationEmail(): Promise<void> {
        await this.resendEmailLink.click();
    }

    async assertUrlContainsVerifyEmail(): Promise<void> {
        await expect(this.page).toHaveURL(/verify_email/i);
    }
}