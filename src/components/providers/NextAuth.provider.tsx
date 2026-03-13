'use client';

import React, { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

interface UiProviderProps {
  children: ReactNode;
}

const NextAuthProvider: React.FC<UiProviderProps> = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default NextAuthProvider;
