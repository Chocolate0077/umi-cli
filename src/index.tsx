import type { FC } from 'react';
import React from 'react';
import type { UmiPageProps } from 'commonTypes';
import ErrorBoundary from '@/components/ErrorBoundary';

interface AppProps extends UmiPageProps {}

const App: FC<AppProps> = ({ children }) => {
  return <ErrorBoundary>{children}</ErrorBoundary>;
};

export default App;
