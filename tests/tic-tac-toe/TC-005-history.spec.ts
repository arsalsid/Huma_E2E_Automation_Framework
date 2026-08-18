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
    await gamePage.setDifficulty('easy');
    const result = await gamePage.playUntilGameEnds(9, 'best');

    await navPage.goToHistory();
    await historyPage.expectHasResults();
    await expect(historyPage.row(0)).toHaveAttribute(
      'data-result',
      result === 'human' ? 'win' : result === 'computer' ? 'loss' : 'draw'
    );
  });

  test('TC-TTT-021: Clear history removes all records', async ({
    registerFreshUser,
    navPage,
    gamePage,
    historyPage,
  }) => {
    await registerFreshUser();
    await navPage.goToPlay();
    await gamePage.setDifficulty('easy');
    await gamePage.playUntilGameEnds(9, 'best');

    await navPage.goToHistory();
    await historyPage.expectHasResults();
    await historyPage.clearHistory();
    await historyPage.expectEmpty();
  });
});
