import { test as base, expect, type Page } from '@playwright/test';
import { RegisterPage } from '../../../pages/RegisterPage';
import { LoginPage } from '../../../pages/LoginPage';
import { NavigationPage } from '../../../pages/NavigationPage';
import { GamePage } from '../../../pages/GamePage';
import { ProfilePage } from '../../../pages/ProfilePage';
import { HistoryPage } from '../../../pages/HistoryPage';
import { SettingsPage } from '../../../pages/SettingsPage';

type TicTacToeFixtures = {
  registerPage: RegisterPage;
  loginPage: LoginPage;
  navPage: NavigationPage;
  gamePage: GamePage;
  profilePage: ProfilePage;
  historyPage: HistoryPage;
  settingsPage: SettingsPage;
  registerFreshUser: () => Promise<string>;
};

type Use<T> = (value: T) => Promise<void>;

/**
 * Shared Playwright test base for Tic-Tac-Toe specs.
 * Provides page objects and helpers; not the same as Fixtures/ test-data folder.
 */
export const test = base.extend<TicTacToeFixtures>({
  registerPage: async ({ page }: { page: Page }, use: Use<RegisterPage>) => {
    await use(new RegisterPage(page));
  },
  loginPage: async ({ page }: { page: Page }, use: Use<LoginPage>) => {
    await use(new LoginPage(page));
  },
  navPage: async ({ page }: { page: Page }, use: Use<NavigationPage>) => {
    await use(new NavigationPage(page));
  },
  gamePage: async ({ page }: { page: Page }, use: Use<GamePage>) => {
    await use(new GamePage(page));
  },
  profilePage: async ({ page }: { page: Page }, use: Use<ProfilePage>) => {
    await use(new ProfilePage(page));
  },
  historyPage: async ({ page }: { page: Page }, use: Use<HistoryPage>) => {
    await use(new HistoryPage(page));
  },
  settingsPage: async ({ page }: { page: Page }, use: Use<SettingsPage>) => {
    await use(new SettingsPage(page));
  },
  registerFreshUser: async (
    {
      registerPage,
      navPage,
      settingsPage,
    }: {
      registerPage: RegisterPage;
      navPage: NavigationPage;
      settingsPage: SettingsPage;
    },
    use: Use<() => Promise<string>>
  ) => {
    await use(async () => {
      const name = `Player_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      await registerPage.goto();
      await settingsPage.setLanguage('en');
      await registerPage.register(name);
      await navPage.expectLoggedInAs(name);
      return name;
    });
  },
});

// Clear storage so Tic-Tac-Toe does not reuse other project auth state.
test.use({ storageState: { cookies: [], origins: [] } });

export { expect };
