import { Page, Locator, expect } from '@playwright/test';

export class NavigationPage {
  readonly page: Page;
  readonly nav: Locator;
  readonly helloUser: Locator;
  readonly playLink: Locator;
  readonly profileLink: Locator;
  readonly historyLink: Locator;
  readonly logoutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nav = page.getByTestId('nav');
    this.helloUser = page.getByTestId('hello-user');
    this.playLink = page.getByRole('button', { name: 'Play' });
    this.profileLink = page.getByRole('button', { name: 'Profile' });
    this.historyLink = page.getByRole('button', { name: 'History' });
    this.logoutButton = page.getByRole('button', { name: 'Log Out' });
  }

  async expectLoggedInAs(name: string) {
    await expect(this.nav).toBeVisible();
    await expect(this.helloUser).toContainText(name);
  }

  async goToPlay() {
    await this.playLink.click();
  }

  async goToProfile() {
    await this.profileLink.click();
  }

  async goToHistory() {
    await this.historyLink.click();
  }

  async logout() {
    await this.logoutButton.click();
  }
}
