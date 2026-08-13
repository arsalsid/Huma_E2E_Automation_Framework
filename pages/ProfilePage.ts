import { Page, Locator, expect } from '@playwright/test';

export class ProfilePage {
  readonly page: Page;
  readonly view: Locator;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly saveButton: Locator;
  readonly successMessage: Locator;
  readonly errorMessage: Locator;
  readonly wins: Locator;
  readonly losses: Locator;
  readonly draws: Locator;
  readonly deleteAccountButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.view = page.getByTestId('view-profile');
    this.title = page.getByRole('heading', { name: 'Your Profile' });
    this.nameInput = page.getByRole('textbox');
    this.saveButton = page.getByRole('button', { name: 'Save Changes' });
    this.successMessage = page.getByTestId('profile-message');
    this.errorMessage = page.getByRole('alert');
    this.wins = page.getByTestId('profile-wins');
    this.losses = page.getByTestId('profile-losses');
    this.draws = page.getByTestId('profile-draws');
    this.deleteAccountButton = page.getByRole('button', { name: 'Delete Account' });
  }

  async expectLoaded() {
    await expect(this.view).toBeVisible();
    await expect(this.title).toBeVisible();
  }

  async updateName(newName: string) {
    await this.nameInput.fill(newName);
    await this.saveButton.click();
  }

  async deleteAccount() {
    this.page.once('dialog', async (dialog) => {
      await dialog.accept();
    });
    await this.deleteAccountButton.click();
  }
}
