'use client';

import React, { ReactNode, useEffect } from 'react';
import { SessionProvider, signOut, useSession } from 'next-auth/react';
import PAGE_ROUTES from '@/app/constants/page-routes.constant';

interface UiProviderProps {
  children: ReactNode;
}

/**
 * How often the client re-fetches /api/auth/session. That route is where the
 * access token is refreshed (and the rotated refresh token persisted), so
 * this keeps the 15-minute access token fresh while the app is open.
 */
const SESSION_REFETCH_SECONDS = 5 * 60;

/** Signs the user out cleanly once their session can't be refreshed. */
const SessionExpiryGuard = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.error) {
      signOut({ callbackUrl: PAGE_ROUTES.login });
    }
  }, [session?.error]);

  return null;
};

const NextAuthProvider: React.FC<UiProviderProps> = ({ children }) => {
  return (
    <SessionProvider
      refetchInterval={SESSION_REFETCH_SECONDS}
      refetchOnWindowFocus
    >
      <SessionExpiryGuard />
      {children}
    </SessionProvider>
  );
};

export default NextAuthProvider;
