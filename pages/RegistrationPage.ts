import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
    private readonly page: Page;
    private readonly registerHeader: Locator;
    private readonly emailInput: Locator;
    private readonly passwordInput: Locator;
    private readonly confirmPasswordInput: Locator;
    private readonly firstPasswordToggle: Locator;
    private readonly secondPasswordToggle: Locator;
    private readonly registerButton: Locator;
    private readonly signInLink: Locator;
    private readonly openInstructionsLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.registerHeader = page.getByText('Register to the insured portal');
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
        this.confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password' });
        this.firstPasswordToggle = page.getByRole('button', { name: /password$/ }).first();
        this.secondPasswordToggle = page.getByRole('button', { name: /password$/ }).last();
        this.registerButton = page.getByRole('button', { name: 'Register' });
        this.signInLink = page.getByRole('link', { name: 'Sign in' });
        this.openInstructionsLink = page.getByRole('link', { name: 'Open instructions' });
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
    }

    async fillConfirmPassword(password: string): Promise<void> {
        await this.confirmPasswordInput.fill(password);
    }

    async toggleFirstPasswordVisibility(): Promise<void> {
        await this.firstPasswordToggle.click();
    }

    async toggleSecondPasswordVisibility(): Promise<void> {
        await this.secondPasswordToggle.click();
    }

    async submitRegistration(): Promise<void> {
        await this.registerButton.click();
    }

    async goToSignIn(): Promise<void> {
        await this.signInLink.click();
    }

    async navigateToInstructions(): Promise<Page> {
        const [newPage] = await Promise.all([
            this.page.context().waitForEvent('page'),
            this.openInstructionsLink.click(),
        ]);
        await newPage.waitForLoadState();
        return newPage;
    }

    async assertPleaseSpecifyEmailMessage(): Promise<void> {
        const pleaseSpecifyEmailMessage = this.page.getByText('Please specify email.');
        await expect(pleaseSpecifyEmailMessage).toBeVisible();
    }

    async assertInvalidEmailMessage(): Promise<void> {
        const invalidEmailMessage = this.page.getByText('Invalid email address.');
        await expect(invalidEmailMessage).toBeVisible();
    }

    async assertEmailAlreadyExistsMessage(): Promise<void> {
        const emailAlreadyExistsMessage = this.page.getByText('Email already exists.');
        await expect(emailAlreadyExistsMessage).toBeVisible();
    }

    async assertPleaseSpecifyPasswordMessage(): Promise<void> {
        const pleaseSpecifyPasswordMessage = this.page.getByText('Please specify password.');
        await expect(pleaseSpecifyPasswordMessage).toBeVisible();
    }

    async assertPasswordConfirmationMismatchMessage(): Promise<void> {
        const passwordMismatchMessage = this.page.getByText(`Password confirmation doesn't match.`);
        await expect(passwordMismatchMessage).toBeVisible();
    }

    async fillRegistrationForm(email: string, password: string): Promise<void> {
        console.log(`Filling email: ${email}`);
        await this.fillEmail(email);
        console.log(`Filling password: ${password}`);
        await this.fillPassword(password);
        console.log(`Confirming password: ${password}`);
        await this.fillConfirmPassword(password);
    }

    async togglePasswordVisibilityAndTakeScreenshot(screenshotPath?: string): Promise<void> {
        console.log('Toggling visibility of password input');
        await this.toggleFirstPasswordVisibility();
        console.log('Toggling visibility of confirm password input');
        await this.toggleSecondPasswordVisibility();
        if (screenshotPath) {
            console.log('Taking screenshot after toggling passwords');
            await this.page.screenshot({ path: screenshotPath, fullPage: true });
        }
    }
}