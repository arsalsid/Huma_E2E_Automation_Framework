import { test, expect } from './test-base';

/**
 * Page under test: GamePage
 * Shared POM used: NavigationPage (via registerFreshUser / nav)
 */
test.describe('Critical Flow - Gameplay', () => {
  test('TC-TTT-007: Human move places X and computer responds with O', async ({
    registerFreshUser,
    gamePage,
  }) => {
    await registerFreshUser();
    await gamePage.expectLoaded();
    await gamePage.setDifficulty('easy');
    await gamePage.waitForYourTurn();

    await gamePage.clickCell(0);
    await gamePage.expectPlayerMarkAt(0);
    await gamePage.expectComputerHasMoved();

    const oCount = await gamePage.page.locator('[data-testid^="cell-"][data-state="o"]').count();
    const status = await gamePage.getStatusAttribute();
    expect(oCount === 1 || status === 'human').toBeTruthy();
  });

  test('TC-TTT-008: New Game and Reset clear the board', async ({
    registerFreshUser,
    gamePage,
  }) => {
    await registerFreshUser();
    await gamePage.setDifficulty('easy');
    await gamePage.clickCell(0);
    await gamePage.expectComputerHasMoved();

    await gamePage.startNewGame();
    await gamePage.expectBoardCleared();

    await gamePage.clickCell(4);
    await gamePage.expectComputerHasMoved();
    await gamePage.resetGame();
    await gamePage.expectBoardCleared();
  });

  test('TC-TTT-009: Hint highlights a recommended empty cell', async ({
    registerFreshUser,
    gamePage,
  }) => {
    await registerFreshUser();
    await gamePage.setDifficulty('medium');
    await gamePage.waitForYourTurn();
    await gamePage.useHint();

    const hinted = gamePage.page.locator('.cell.is-hint');
    await expect(hinted).toHaveCount(1);
    await expect(hinted).toHaveAttribute('data-state', 'empty');
  });

  test('TC-TTT-010: Difficulty can be changed', async ({
    registerFreshUser,
    gamePage,
  }) => {
    await registerFreshUser();
    await gamePage.setDifficulty('medium');
    await expect(gamePage.difficultySelect).toHaveValue('medium');
    await gamePage.setDifficulty('hard');
    await expect(gamePage.difficultySelect).toHaveValue('hard');
    await gamePage.setDifficulty('easy');
    await expect(gamePage.difficultySelect).toHaveValue('easy');

    await gamePage.waitForYourTurn();
    await gamePage.clickCell(4);
    await gamePage.expectPlayerMarkAt(4);
    await gamePage.expectComputerHasMoved();
  });

  test('TC-TTT-011: Finished game updates status to win, loss, or draw', async ({
    registerFreshUser,
    gamePage,
    navPage,
    profilePage,
  }) => {
    await registerFreshUser();
    await gamePage.setDifficulty('easy');
    const result = await gamePage.playUntilGameEnds(9, 'best');
    expect(['human', 'computer', 'draw']).toContain(result);
    await gamePage.expectFinishedResult(result);

    await navPage.goToProfile();
    await profilePage.expectLoaded();
    const expectedStat =
      result === 'human'
        ? profilePage.wins
        : result === 'computer'
          ? profilePage.losses
          : profilePage.draws;
    await expect(expectedStat).toHaveText('1');
  });

  test('TC-TTT-018: Occupied cell cannot be overwritten', async ({
    registerFreshUser,
    gamePage,
  }) => {
    await registerFreshUser();
    await gamePage.setDifficulty('easy');
    await gamePage.waitForYourTurn();
    await gamePage.clickCell(0);
    await gamePage.expectPlayerMarkAt(0);
    await gamePage.expectComputerHasMoved();
    await gamePage.expectOccupiedCellUnchanged(0);
  });

  test('TC-TTT-019: Changing difficulty mid-game shows confirm and starts a new game', async ({
    registerFreshUser,
    gamePage,
  }) => {
    await registerFreshUser();
    await gamePage.setDifficulty('easy');
    await gamePage.waitForYourTurn();
    await gamePage.clickCell(0);
    await gamePage.expectPlayerMarkAt(0);
    await gamePage.expectComputerHasMoved();

    await gamePage.setDifficulty('medium', false);
    await expect(gamePage.cell(0)).toHaveAttribute('data-state', 'x');
    await expect(gamePage.difficultySelect).toHaveValue('easy');

    await gamePage.setDifficulty('medium', true);
    await gamePage.expectBoardCleared();
    await expect(gamePage.difficultySelect).toHaveValue('medium');
  });
});
