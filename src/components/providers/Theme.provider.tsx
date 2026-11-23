'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { THEME_COOKIE, ThemePreference } from '@/app/constants/theme.constant';

interface IThemeContext {
  /** What the user picked */
  theme: ThemePreference;
  /** What's actually applied right now */
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: ThemePreference) => void;
}

const ThemeContext = createContext<IThemeContext | null>(null);

const DARK_QUERY = '(prefers-color-scheme: dark)';

const systemPrefersDark = () => window.matchMedia(DARK_QUERY).matches;

const subscribeToSystemTheme = (onChange: () => void) => {
  const media = window.matchMedia(DARK_QUERY);
  media.addEventListener('change', onChange);
  return () => media.removeEventListener('change', onChange);
};

const applyTheme = (resolved: 'light' | 'dark') => {
  const root = document.documentElement;
  root.classList.toggle('dark', resolved === 'dark');
  root.style.colorScheme = resolved;
};

/**
 * Holds the light / dark / system preference. The server already rendered the
 * right class from the cookie (see app/layout.tsx), so this only reacts to
 * changes: user picks, and OS changes while on "system".
 */
const ThemeProvider: React.FC<{
  initialTheme: ThemePreference;
  children: React.ReactNode;
}> = ({ initialTheme, children }) => {
  const [theme, setThemeState] = useState<ThemePreference>(initialTheme);

  // Track the OS setting (server snapshot: light)
  const systemDark = useSyncExternalStore(
    subscribeToSystemTheme,
    systemPrefersDark,
    () => false,
  );

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? (systemDark ? 'dark' : 'light') : theme;

  useEffect(() => applyTheme(resolvedTheme), [resolvedTheme]);

  const setTheme = useCallback((next: ThemePreference) => {
    setThemeState(next);
    // Persist for a year so the server can render the right theme next time
    document.cookie = `${THEME_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>');
  return ctx;
};

export default ThemeProvider;
