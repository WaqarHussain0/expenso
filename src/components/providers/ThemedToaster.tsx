'use client';

import { Toaster } from 'sonner';
import { useTheme } from './Theme.provider';

/** Toasts that follow the app's light/dark theme. */
const ThemedToaster = () => {
  const { resolvedTheme } = useTheme();
  return <Toaster position="bottom-right" richColors theme={resolvedTheme} />;
};

export default ThemedToaster;
