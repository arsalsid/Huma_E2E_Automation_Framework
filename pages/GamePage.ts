import { Page, Locator, expect } from '@playwright/test';

export type Difficulty = 'easy' | 'medium' | 'hard';

export class GamePage {
  readonly page: Page;
  readonly view: Locator;
  readonly board: Locator;
  readonly status: Locator;
  readonly difficultySelect: Locator;
  readonly newGameButton: Locator;
  readonly hintButton: Locator;
  readonly resetButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.view = page.getByTestId('view-play');
    this.board = page.getByRole('grid', { name: /Tic-Tac-Toe board/i });
    // status keeps test id so we can assert data-status reliably
    this.status = page.getByTestId('status');
    this.difficultySelect = page.getByTestId('select-difficulty');
    this.newGameButton = page.getByRole('button', { name: 'New Game' });
    this.hintButton = page.getByRole('button', { name: 'Get Hint' });
    this.resetButton = page.getByRole('button', { name: 'Reset' });
  }

  cell(index: number): Locator {
    // Indexed test id remains best for exact board coordinates.
    return this.page.getByTestId(`cell-${index}`);
  }

  async expectLoaded() {
    await expect(this.view).toBeVisible();
    await expect(this.board).toBeVisible();
    await expect(this.status).toBeVisible();
  }

  async setDifficulty(difficulty: Difficulty) {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.difficultySelect.selectOption(difficulty);
    await expect(this.difficultySelect).toHaveValue(difficulty);
  }

  async clickCell(index: number) {
    await this.cell(index).click();
  }

  async waitForYourTurn(timeout = 5000) {
    await expect(this.status).toHaveAttribute('data-status', 'your-turn', { timeout });
  }

  async waitAfterHumanMove(timeout = 5000) {
    await expect
      .poll(async () => this.status.getAttribute('data-status'), { timeout })
      .toMatch(/your-turn|human|computer|draw/);
  }

  async getCellState(index: number) {
    return this.cell(index).getAttribute('data-state');
  }

  async getEmptyCellIndexes(): Promise<number[]> {
    const indexes: number[] = [];
    for (let i = 0; i < 9; i++) {
      if ((await this.getCellState(i)) === 'empty') indexes.push(i);
    }
    return indexes;
  }

  async startNewGame() {
    await this.newGameButton.click();
    await this.expectBoardCleared();
  }

  async resetGame() {
    await this.resetButton.click();
    await this.expectBoardCleared();
  }

  async expectBoardCleared() {
    for (let i = 0; i < 9; i++) {
      await expect(this.cell(i)).toHaveAttribute('data-state', 'empty');
    }
    await this.waitForYourTurn();
  }

  async useHint() {
    await this.waitForYourTurn();
    await this.hintButton.click();
    await expect(this.page.locator('.cell.is-hint')).toBeVisible();
  }

  async getStatusAttribute() {
    return this.status.getAttribute('data-status');
  }

  isTerminalStatus(status: string | null): status is 'human' | 'computer' | 'draw' {
    return status === 'human' || status === 'computer' || status === 'draw';
  }

  async playUntilGameEnds(maxMoves = 9): Promise<'human' | 'computer' | 'draw'> {
    for (let move = 0; move < maxMoves; move++) {
      const status = await this.getStatusAttribute();
      if (this.isTerminalStatus(status)) return status;

      await this.waitForYourTurn();
      const empty = await this.getEmptyCellIndexes();
      if (empty.length === 0) {
        const ended = await this.getStatusAttribute();
        if (this.isTerminalStatus(ended)) return ended;
        throw new Error('No empty cells but game not finished');
      }

      await this.clickCell(empty[0]);
      await this.page.waitForTimeout(700);

      const after = await this.getStatusAttribute();
      if (this.isTerminalStatus(after)) return after;
    }

    const finalStatus = await this.getStatusAttribute();
    if (this.isTerminalStatus(finalStatus)) return finalStatus;
    throw new Error(`Game did not finish. Last status: ${finalStatus}`);
  }

  async expectPlayerMarkAt(index: number) {
    await expect(this.cell(index)).toHaveAttribute('data-state', 'x');
    await expect(this.cell(index)).toHaveText('X');
  }

  async expectComputerHasMoved() {
    await expect
      .poll(async () => {
        for (let i = 0; i < 9; i++) {
          if ((await this.getCellState(i)) === 'o') return true;
        }
        const status = await this.getStatusAttribute();
        return this.isTerminalStatus(status);
      }, { timeout: 5000 })
      .toBeTruthy();
  }
}
