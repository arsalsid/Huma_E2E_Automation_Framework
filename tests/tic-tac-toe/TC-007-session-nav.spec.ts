import { test, expect } from './test-base';

/**
 * Page under test: NavigationPage
 * Shared POM used: GamePage, ProfilePage, HistoryPage
 */
test.describe('Critical Flow - Session and Navigation', () => {
  test('TC-TTT-023: Session persists after page reload', async ({
    registerFreshUser,
    navPage,
    gamePage,
    page,
  }) => {
    const name = await registerFreshUser();
    await gamePage.expectLoaded();

    await page.reload();

    await navPage.expectLoggedInAs(name);
    await gamePage.expectLoaded();
  });

  test('TC-TTT-024: Navigation between Play, Profile and History', async ({
    registerFreshUser,
    navPage,
    gamePage,
    profilePage,
    historyPage,
  }) => {
    await registerFreshUser();

    await navPage.goToProfile();
    await profilePage.expectLoaded();

    await navPage.goToHistory();
    await historyPage.expectLoaded();

    await navPage.goToPlay();
    await gamePage.expectLoaded();
  });
});
