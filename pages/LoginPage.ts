import { Page, Locator, expect } from '@playwright/test';

/**
 * Welcome screen in Log in mode.
 * Opened from Register/Welcome via "Already have an account? Log in".
 */
export class LoginPage {
  readonly page: Page;
  readonly form: Locator;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly error: Locator;
  readonly loginButton: Locator;
  readonly switchToRegisterLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.form = page.getByTestId('auth-form');
    this.title = page.getByTestId('auth-title');
    this.nameInput = page.getByRole('textbox');
    this.error = page.getByRole('alert');
    this.loginButton = page.getByRole('button', { name: 'Log In' });
    this.switchToRegisterLink = page.getByTestId('btn-switch-mode');
  }

  async expectLoginMode() {
    await expect(this.form).toBeVisible();
    await expect(this.form).toHaveAttribute('data-mode', 'login');
    await expect(this.loginButton).toBeVisible();
  }

  async ensureLoginMode() {
    if ((await this.form.getAttribute('data-mode')) !== 'login') {
      await this.switchToRegisterLink.click();
    }
    await this.expectLoginMode();
  }

  async login(name: string) {
    await this.ensureLoginMode();
    await this.nameInput.fill(name);
    await this.loginButton.click();
  }

  async goToRegisterPage() {
    await this.ensureLoginMode();
    await this.switchToRegisterLink.click();
    await expect(this.form).toHaveAttribute('data-mode', 'register');
  }
}
