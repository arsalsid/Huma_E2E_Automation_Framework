import { test, expect } from './test-base';

/**
 * Page under test: SettingsPage (theme + language in header)
 * Shared POM used: NavigationPage, RegisterPage
 */
test.describe('Critical Flow - Settings', () => {
  test('TC-TTT-016: Theme and language settings update the UI', async ({
    registerFreshUser,
    settingsPage,
    registerPage,
    navPage,
  }) => {
    await registerFreshUser();

    await settingsPage.toggleTheme();
    await settingsPage.setLanguage('fa');
    await expect(settingsPage.title).toBeVisible();

    await settingsPage.setLanguage('en');
    await navPage.logout();
    await registerPage.expectRegisterMode();
  });
});
