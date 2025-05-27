import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { RegistrationInstructionsPage } from '../pages/RegistrationInstructionsPage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { VerifyEmailPage } from '../pages/VerifyEmailPage';
import { RandomDataGenerator } from '../helpers_registration_task/RandomDataGenerator';

let loginPage: LoginPage;
let registrationPage: RegistrationPage;
let verifyEmailPage: VerifyEmailPage;
let registrationInstructionsPage: RegistrationInstructionsPage;

test.describe('User registration tests', () => {
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        registrationPage = new RegistrationPage(page);
        verifyEmailPage = new VerifyEmailPage(page);
    });

    test('Verify successful user registration', async ({ page }) => {
        const randomEmail = RandomDataGenerator.randomEmailAddress();
        const randomPassword = RandomDataGenerator.randomAlphaNumericString(10);
        const screenshotBase = 'screenshots/successful-registration';

        console.log('Starting test: verify successful user registration');

        await loginPage.navigatingToRegistrationForm();
        await registrationPage.fillRegistrationForm(randomEmail, randomPassword);
        await registrationPage.togglePasswordVisibilityAndTakeScreenshot(`${screenshotBase}/after-password-toggle.png`);

        console.log('Submitting registration form');
        await registrationPage.submitRegistration();

        console.log('Verifying email verification page is visible');
        await verifyEmailPage.assertVerifyEmailPageVisible();
        await verifyEmailPage.assertUrlContainsVerifyEmail();
        console.log('Taking screenshot of verification page');
        await page.screenshot({ path: `${screenshotBase}/verify-email-page.png`, fullPage: true });

        console.log('Test complete: registration successful and verification page displayed');
    });

    test(`Verify invalid email can't be used for registration`, async ({ page }) => {
        const invalidEmail = RandomDataGenerator.randomAlphaNumericString(10);
        const screenshotBase = 'screenshots/invalid-email';

        console.log(`Starting test: verify invalid email can't be used for registration`);

        await loginPage.navigatingToRegistrationForm();

        console.log(`Filling invalid email: ${invalidEmail}`);
        await registrationPage.fillEmail(invalidEmail);

        console.log('Taking screenshot after filling invalid email');
        await page.screenshot({ path: `${screenshotBase}/invalid-email-filled-${invalidEmail}.png`, fullPage: true });

        console.log('Submitting registration form');
        await registrationPage.submitRegistration();

        console.log('Asserting invalid email validation message appears');
        await registrationPage.assertInvalidEmailMessage();

        console.log('Taking screenshot of validation error');
        await page.screenshot({ path: `${screenshotBase}/invalid-email-error-${invalidEmail}.png`, fullPage: true });

        console.log('Test complete: invalid email was rejected as expected');
    });


    test(`Verify user can't be created with already existing email`, async ({ page }) => {
        const randomEmail = RandomDataGenerator.randomEmailAddress();
        const randomPassword = RandomDataGenerator.randomAlphaNumericString(10);
        const screenshotBase = 'screenshots/existing-email';

        console.log(`Starting test: user can't be created with already existing email`);

        await loginPage.navigatingToRegistrationForm();
        await registrationPage.fillRegistrationForm(randomEmail, randomPassword);

        console.log('Submitting registration form');
        await registrationPage.submitRegistration();

        console.log('Verifying email verification page is visible');
        await verifyEmailPage.assertVerifyEmailPageVisible();

        console.log('Attempting to register again with the same email');

        console.log('Navigating to login page again');
        await loginPage.navigateToLoginPage();

        console.log('Clicking "Register" link again');
        await loginPage.goToRegisterPage();

        console.log('Filling registration form again with same email');
        await registrationPage.fillRegistrationForm(randomEmail, randomPassword);

        console.log('Submitting form again');
        await registrationPage.submitRegistration();

        console.log('Taking screenshot of email already exists error');
        await page.screenshot({ path: `${screenshotBase}/email-already-exists-${randomEmail}.png`, fullPage: true });

        console.log('Asserting email already exists message is shown');
        await registrationPage.assertEmailAlreadyExistsMessage();

        console.log('Test complete: duplicate email was correctly rejected');
    });

    test(`Verify correct URL in registration instructions page`, async ({ page }) => {
        const screenshotBase = 'screenshots/instructions-url-check';

        console.log('Starting test: verify correct URL in registration instructions page');

        await loginPage.navigatingToRegistrationForm();

        console.log('Opening instructions page in a new tab:');
        const instructionsPage = await registrationPage.navigateToInstructions();
        registrationInstructionsPage = new RegistrationInstructionsPage(instructionsPage);
        console.log(instructionsPage.url());

        console.log('Verifying URL contains `/instructions/en/registration`');
        await registrationInstructionsPage.assertUrlContainsRegistration();

        console.log('Taking screenshot of instructions page');
        await instructionsPage.screenshot({ path: `${screenshotBase}/instructions-page.png`, fullPage: true });

        console.log('Test complete: URL verified successfully');
    });
});