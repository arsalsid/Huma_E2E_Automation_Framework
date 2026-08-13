import { test, expect } from './test-base';
import { AUTH_ERRORS } from '../../../Fixtures/constants';

/**
 * Page under test: LoginPage
 * Shared POM used: RegisterPage, NavigationPage, GamePage, SettingsPage
 */
test.describe('Critical Flow - Login', () => {
  test('TC-TTT-004: Login with existing account', async ({
    registerPage,
    loginPage,
    navPage,
    gamePage,
    settingsPage,
  }) => {
    const name = `Login_${Date.now()}`;
    await registerPage.goto();
    await settingsPage.setLanguage('en');
    await registerPage.register(name);
    await navPage.logout();

    await registerPage.goToLoginPage();
    await loginPage.login(name);

    await navPage.expectLoggedInAs(name);
    await gamePage.expectLoaded();
  });

  test('TC-TTT-005: Login fails when account does not exist', async ({
    registerPage,
    loginPage,
    settingsPage,
  }) => {
    await registerPage.goto();
    await settingsPage.setLanguage('en');
    await registerPage.goToLoginPage();

    await loginPage.login(`Missing_${Date.now()}`);
    await expect(loginPage.error).toContainText(AUTH_ERRORS.notFound);
  });

  test('TC-TTT-006: Switch between Register and Login modes', async ({
    registerPage,
    loginPage,
    settingsPage,
  }) => {
    await registerPage.goto();
    await settingsPage.setLanguage('en');
    await registerPage.expectRegisterMode();

    await registerPage.goToLoginPage();
    await loginPage.expectLoginMode();

    await loginPage.goToRegisterPage();
    await registerPage.expectRegisterMode();
  });
});
