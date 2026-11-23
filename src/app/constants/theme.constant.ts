/** Cookie holding the user's theme preference, read on the server to avoid a flash. */
export const THEME_COOKIE = 'expenso-theme';

export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_PREFERENCES: ThemePreference[] = ['light', 'dark', 'system'];

export const isThemePreference = (value: unknown): value is ThemePreference =>
  THEME_PREFERENCES.includes(value as ThemePreference);
