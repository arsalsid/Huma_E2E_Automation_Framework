import { Page, Locator, expect } from '@playwright/test';

export type Difficulty = 'easy' | 'medium' | 'hard';

const WIN_LINES: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

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

  async setDifficulty(difficulty: Difficulty, acceptConfirm = true) {
    const dialogPromise = this.page
      .waitForEvent('dialog', { timeout: 2000 })
      .catch(() => null);
    const selectPromise = this.difficultySelect.selectOption(difficulty);
    const dialog = await dialogPromise;

    if (dialog) {
      if (acceptConfirm) await dialog.accept();
      else await dialog.dismiss();
    }

    if (acceptConfirm) {
      await selectPromise;
      await expect(this.difficultySelect).toHaveValue(difficulty);
      return;
    }

    await selectPromise.catch(() => undefined);
    await expect(this.difficultySelect).toHaveValue(/^(easy|medium|hard)$/);
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

  async playUntilGameEnds(
    maxMoves = 9,
    strategy: 'first-empty' | 'best' = 'best'
  ): Promise<'human' | 'computer' | 'draw'> {
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

      const index =
        strategy === 'best' ? await this.chooseStrategicCell() : empty[0];
      const oBefore = await this.countMarks('o');
      await this.clickCell(index);
      await this.expectComputerHasMoved(oBefore);

      const after = await this.getStatusAttribute();
      if (this.isTerminalStatus(after)) return after;
    }

    const finalStatus = await this.getStatusAttribute();
    if (this.isTerminalStatus(finalStatus)) return finalStatus;
    throw new Error(`Game did not finish. Last status: ${finalStatus}`);
  }

  async chooseStrategicCell(): Promise<number> {
    const board = await this.getBoardStates();
    const win = this.findLineMove(board, 'x');
    if (win !== null) return win;
    const block = this.findLineMove(board, 'o');
    if (block !== null) return block;
    const preference = [4, 0, 2, 6, 8, 1, 3, 5, 7];
    for (const index of preference) {
      if (board[index] === 'empty') return index;
    }
    throw new Error('No strategic cell available');
  }

  async getBoardStates(): Promise<string[]> {
    const states: string[] = [];
    for (let i = 0; i < 9; i++) {
      states.push((await this.getCellState(i)) ?? 'empty');
    }
    return states;
  }

  findLineMove(board: string[], mark: 'x' | 'o'): number | null {
    for (const line of WIN_LINES) {
      const states = line.map((i) => board[i]);
      const marks = states.filter((state) => state === mark).length;
      const emptyAt = states.indexOf('empty');
      if (marks === 2 && emptyAt !== -1) return line[emptyAt];
    }
    return null;
  }

  async expectFinishedResult(result: 'human' | 'computer' | 'draw') {
    await expect(this.status).toHaveAttribute('data-status', result);
    const winning = this.page.locator('.cell.is-win');
    if (result === 'draw') {
      await expect(winning).toHaveCount(0);
    } else {
      await expect(winning).toHaveCount(3);
    }
  }

  async expectOccupiedCellUnchanged(index: number) {
    const before = await this.getCellState(index);
    expect(before).not.toBe('empty');
    await expect(this.cell(index)).toBeDisabled();
    await this.cell(index).click({ force: true });
    await expect(this.cell(index)).toHaveAttribute('data-state', before as string);
  }

  async expectPlayerMarkAt(index: number) {
    await expect(this.cell(index)).toHaveAttribute('data-state', 'x');
    await expect(this.cell(index)).toHaveText('X');
  }

  async countMarks(mark: 'x' | 'o'): Promise<number> {
    let count = 0;
    for (let i = 0; i < 9; i++) {
      if ((await this.getCellState(i)) === mark) count += 1;
    }
    return count;
  }

  async expectComputerHasMoved(previousOCount = 0) {
    await expect
      .poll(async () => {
        const status = await this.getStatusAttribute();
        if (this.isTerminalStatus(status)) return true;
        return (await this.countMarks('o')) > previousOCount;
      }, { timeout: 5000 })
      .toBeTruthy();
  }
}
