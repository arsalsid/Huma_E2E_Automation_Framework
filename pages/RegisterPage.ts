import { Page, Locator, expect } from '@playwright/test';

/**
 * Welcome screen in Create Account (register) mode.
 * Default view when the app first loads.
 */
export class RegisterPage {
  readonly page: Page;
  readonly form: Locator;
  readonly title: Locator;
  readonly nameInput: Locator;
  readonly error: Locator;
  readonly createAccountButton: Locator;
  readonly switchToLoginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    // Keep form/mode-switch on test ids (mode switch label changes by screen).
    this.form = page.getByTestId('auth-form');
    this.title = page.getByRole('heading', { name: 'Welcome' });
    this.nameInput = page.getByRole('textbox');
    this.error = page.getByRole('alert');
    this.createAccountButton = page.getByRole('button', { name: 'Create Account' });
    this.switchToLoginLink = page.getByTestId('btn-switch-mode');
  }

  async goto() {
    await this.page.goto('/index.html');
    await this.page.evaluate(() => localStorage.clear());
    await this.page.reload();
    await this.expectRegisterMode();
  }

  async expectRegisterMode() {
    await expect(this.form).toBeVisible();
    await expect(this.form).toHaveAttribute('data-mode', 'register');
    await expect(this.createAccountButton).toBeVisible();
  }

  async ensureRegisterMode() {
    if ((await this.form.getAttribute('data-mode')) !== 'register') {
      await this.switchToLoginLink.click();
    }
    await this.expectRegisterMode();
  }

  async register(name: string) {
    await this.ensureRegisterMode();
    await this.nameInput.fill(name);
    await this.createAccountButton.click();
  }

  async goToLoginPage() {
    await this.ensureRegisterMode();
    await this.switchToLoginLink.click();
    await expect(this.form).toHaveAttribute('data-mode', 'login');
  }
}
