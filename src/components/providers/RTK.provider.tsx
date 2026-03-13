"use client";
import { store } from '@/lib/redux/store';
import { ReactNode } from 'react';
import { Provider as ReduxProvider } from 'react-redux';

interface RTKProviderProps {
  children: ReactNode;
}

const RTKProvider: React.FC<RTKProviderProps> = ({ children }) => {
  return <ReduxProvider store={store}>{children}</ReduxProvider>;
};

export default RTKProvider;
