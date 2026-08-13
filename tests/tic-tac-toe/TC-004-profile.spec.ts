import { test, expect } from './test-base';
import { PROFILE_MESSAGES } from '../../Fixtures/constants';

/**
 * Page under test: ProfilePage
 * Shared POM used: NavigationPage (menu), RegisterPage/LoginPage (after delete)
 */
test.describe('Critical Flow - Profile', () => {
  test('TC-TTT-012: Profile shows stats and allows rename', async ({
    registerFreshUser,
    navPage,
    profilePage,
  }) => {
    const original = await registerFreshUser();
    await navPage.goToProfile();
    await profilePage.expectLoaded();

    await expect(profilePage.wins).toHaveText('0');
    await expect(profilePage.losses).toHaveText('0');
    await expect(profilePage.draws).toHaveText('0');

    const renamed = `${original}_X`;
    await profilePage.updateName(renamed);
    await expect(profilePage.successMessage).toContainText(PROFILE_MESSAGES.saved);
    await navPage.expectLoggedInAs(renamed);
  });

  test('TC-TTT-013: Delete account returns to Register and blocks login', async ({
    registerFreshUser,
    navPage,
    profilePage,
    registerPage,
    loginPage,
    settingsPage,
  }) => {
    const name = await registerFreshUser();
    await navPage.goToProfile();
    await profilePage.deleteAccount();

    await registerPage.expectRegisterMode();
    await settingsPage.setLanguage('en');
    await registerPage.goToLoginPage();
    await loginPage.login(name);
    await expect(loginPage.error).toBeVisible();
  });
});
