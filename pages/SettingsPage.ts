import { Page, Locator, expect } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly languageSelect: Locator;
  readonly themeButton: Locator;
  readonly title: Locator;

  constructor(page: Page) {
    this.page = page;
    this.languageSelect = page.getByTestId('select-language');
    this.themeButton = page.getByTestId('btn-theme');
    this.title = page.getByTestId('title');
  }

  async setLanguage(lang: 'en' | 'fa') {
    await this.languageSelect.selectOption(lang);
    await expect(this.page.locator('html')).toHaveAttribute('lang', lang);
    await expect(this.page.locator('html')).toHaveAttribute('dir', lang === 'fa' ? 'rtl' : 'ltr');
  }

  async toggleTheme() {
    const before = await this.page.locator('html').getAttribute('data-theme');
    await this.themeButton.click();
    const expected = before === 'dark' ? 'light' : 'dark';
    await expect(this.page.locator('html')).toHaveAttribute('data-theme', expected);
  }
}
