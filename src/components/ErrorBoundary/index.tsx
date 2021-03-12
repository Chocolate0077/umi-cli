import type { PropsWithChildren } from 'react';
import React from 'react';
import * as Sentry from '@sentry/react';
import { Integrations } from '@sentry/tracing';
import { Button, Result } from 'antd';
import { useModel } from 'umi';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  autoSessionTracking: true,
  integrations: [new Integrations.BrowserTracing()],
  release: '1.0.0',
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

interface ErrorBoundaryProps {}
const SentryErrorBoundary = ({
  children,
}: PropsWithChildren<ErrorBoundaryProps>) => {
  const { user } = useModel('useUser', (model) => ({ user: model.user }));

  return (
    <Sentry.ErrorBoundary
      showDialog
      beforeCapture={(scope) => {
        scope.setTag('username', user?.username);
        scope.setTag('userEmail', user?.userEmail);
      }}
      fallback={
        <Result
          title="未知错误"
          subTitle="出现了预期之外的错误,请刷新重新或联系管理员"
          extra={[
            <Button
              onClick={() => {
                window.location.reload();
              }}
            >
              刷新
            </Button>,
          ]}
        />
      }
    >
      {children}
    </Sentry.ErrorBoundary>
  );
};

export default SentryErrorBoundary;
