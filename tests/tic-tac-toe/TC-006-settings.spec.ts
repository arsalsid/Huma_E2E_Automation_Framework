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
    page,
  }) => {
    await registerFreshUser();

    await settingsPage.toggleTheme();
    await settingsPage.setLanguage('fa');
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(navPage.playLink).toHaveCount(0);
    await expect(page.getByTestId('nav-play')).toBeVisible();

    await settingsPage.setLanguage('en');
    await expect(navPage.playLink).toBeVisible();
    await navPage.logout();
    await registerPage.expectRegisterMode();
  });

  test('TC-TTT-022: Language and theme persist after reload', async ({
    registerFreshUser,
    settingsPage,
    page,
  }) => {
    await registerFreshUser();
    await settingsPage.toggleTheme();
    const theme = await page.locator('html').getAttribute('data-theme');
    await settingsPage.setLanguage('fa');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'fa');
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
    await expect(page.locator('html')).toHaveAttribute('data-theme', theme as string);
  });
});
