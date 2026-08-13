import { test, expect } from './test-base';

/**
 * Page under test: HistoryPage
 * Shared POM used: NavigationPage, GamePage (to create a finished game)
 */
test.describe('Critical Flow - History', () => {
  test('TC-TTT-014: History is empty for a new user', async ({
    registerFreshUser,
    navPage,
    historyPage,
  }) => {
    await registerFreshUser();
    await navPage.goToHistory();
    await historyPage.expectLoaded();
    await historyPage.expectEmpty();
  });

  test('TC-TTT-015: Completed game appears in History', async ({
    registerFreshUser,
    navPage,
    gamePage,
    historyPage,
  }) => {
    await registerFreshUser();

    await navPage.goToPlay();
    await gamePage.setDifficulty('hard');
    const result = await gamePage.playUntilGameEnds();

    await navPage.goToHistory();
    await historyPage.expectHasResults();
    await expect(historyPage.row(0)).toHaveAttribute(
      'data-result',
      result === 'human' ? 'win' : result === 'computer' ? 'loss' : 'draw'
    );
  });
});
