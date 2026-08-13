import { test, expect } from './test-base';
import { AUTH_ERRORS } from '../../Fixtures/constants';

/**
 * Page under test: RegisterPage
 * Shared POM used: NavigationPage, GamePage, SettingsPage
 */
test.describe('Critical Flow - Register / Sign up', () => {
  test('TC-TTT-001: Register with valid name and land on Play view', async ({
    registerPage,
    navPage,
    gamePage,
    settingsPage,
  }) => {
    const name = `Reg_${Date.now()}`;
    await registerPage.goto();
    await settingsPage.setLanguage('en');
    await registerPage.register(name);

    await navPage.expectLoggedInAs(name);
    await gamePage.expectLoaded();
    await expect(gamePage.status).toHaveAttribute('data-status', 'your-turn');
  });

  test('TC-TTT-002: Register validation - empty, too short, duplicate name', async ({
    registerPage,
    navPage,
    settingsPage,
  }) => {
    await registerPage.goto();
    await settingsPage.setLanguage('en');

    await registerPage.nameInput.fill('');
    await registerPage.createAccountButton.click();
    await expect(registerPage.error).toHaveText(AUTH_ERRORS.emptyName);

    await registerPage.nameInput.fill('A');
    await registerPage.createAccountButton.click();
    await expect(registerPage.error).toHaveText(AUTH_ERRORS.tooShort);

    const name = `Dup_${Date.now()}`;
    await registerPage.register(name);
    await navPage.logout();

    await registerPage.register(name);
    await expect(registerPage.error).toContainText(AUTH_ERRORS.exists);
  });

  test('TC-TTT-003: Logout returns user to Register (Welcome) screen', async ({
    registerFreshUser,
    navPage,
    registerPage,
  }) => {
    await registerFreshUser();
    await navPage.logout();
    await registerPage.expectRegisterMode();
  });
});
