import { Page, Locator, expect } from '@playwright/test';

export class HistoryPage {
  readonly page: Page;
  readonly view: Locator;
  readonly title: Locator;
  readonly emptyState: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.view = page.getByTestId('view-history');
    this.title = page.getByTestId('history-title');
    this.emptyState = page.getByTestId('history-empty');
    this.clearButton = page.getByTestId('btn-clear-history');
  }

  row(index: number): Locator {
    return this.page.getByTestId(`history-row-${index}`);
  }

  async expectLoaded() {
    await expect(this.view).toBeVisible();
    await expect(this.title).toBeVisible();
  }

  async expectEmpty() {
    await expect(this.emptyState).toBeVisible();
  }

  async expectHasResults() {
    await expect(this.row(0)).toBeVisible();
  }

  async clearHistory() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.clearButton.click();
  }
}
