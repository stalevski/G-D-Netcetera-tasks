import { Page, Locator, expect } from '@playwright/test';

export class LoginPage {
    private readonly page: Page;
    private readonly signInHeader: Locator;
    private readonly emailLabel: Locator;
    private readonly emailInput: Locator;
    private readonly passwordLabel: Locator;
    private readonly passwordInput: Locator;
    private readonly passwordToggle: Locator;
    private readonly resetLink: Locator;
    private readonly signInButton: Locator;
    private readonly otherSignInOptionsLink: Locator;
    private readonly registerLink: Locator;
    private readonly languageDropdown: Locator;
    private readonly englishLanguageOption: Locator;
    private readonly frenchLanguageOption: Locator;
    private readonly germanLanguageOption: Locator;
    private readonly italianLanguageOption: Locator;

    constructor(page: Page) {
        this.page = page;
        this.signInHeader = page.getByText('Sign in to the insured portal');
        this.emailLabel = page.getByTestId('email-label');
        this.emailInput = page.getByTestId('email-input');
        this.passwordLabel = page.getByTestId('password-label');
        this.passwordInput = page.getByTestId('password-input');
        this.passwordToggle = page.getByRole('button', { name: /password$/ });
        this.resetLink = page.getByRole('link', { name: 'Reset password or 2-factor' });
        this.signInButton = page.getByTestId('sign-in-input');
        this.otherSignInOptionsLink = page.getByRole('link', { name: 'Use different sign-in options' });
        this.registerLink = page.getByRole('link', { name: 'Register' });
        this.languageDropdown = page.getByRole('link', { name: 'English down' });
        this.englishLanguageOption = page.getByRole('link', { name: 'English', exact: true });
        this.frenchLanguageOption = page.getByRole('link', { name: 'French (Français)' });
        this.germanLanguageOption = page.getByRole('link', { name: 'German (Deutsch)' });
        this.italianLanguageOption = page.getByRole('link', { name: 'Italian (Italiano)' });
    }

    async navigateToLoginPage(): Promise<void> {
        await this.page.goto('');
    }

    async fillEmail(email: string): Promise<void> {
        await this.emailInput.click();
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string): Promise<void> {
        await this.passwordInput.click();
        await this.passwordInput.fill(password);
    }

    async togglePasswordVisibility(): Promise<void> {
        await this.passwordToggle.click();
    }

    async goToResetPassword(): Promise<void> {
        await this.resetLink.click();
    }

    async signIn(): Promise<void> {
        await this.signInButton.click();
    }

    async useDifferentSignInOptions(): Promise<void> {
        await this.otherSignInOptionsLink.click();
    }

    async openLanguageDropdown(): Promise<void> {
        await this.languageDropdown.click();
    }

    async goToRegisterPage(): Promise<void> {
        await this.registerLink.click();
    }

    async assertInvalidLoginError(): Promise<void> {
        const invalidCredentialsMessage = this.page.getByText('Invalid username or password.');
        await expect(invalidCredentialsMessage).toBeVisible();
    }

    async goToRegistrationPage(): Promise<void> {
        await this.navigateToLoginPage();
        await this.goToRegisterPage();
    }

    async navigatingToRegistrationForm(): Promise<void> {
        console.log('Navigating to login page');
        await this.navigateToLoginPage();
        console.log('Clicking "Register" link');
        await this.goToRegisterPage();
        console.log('Navigating to registration form');
    }
}