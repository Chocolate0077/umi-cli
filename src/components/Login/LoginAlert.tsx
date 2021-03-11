import React from 'react';
import { Alert } from 'antd';

import style from './style.module.css';

export type AlertContent = string | React.ReactNode | undefined;

export type AlertType = 'success' | 'info' | 'warning' | 'error';

export interface AlertParams {
  content: AlertContent;
  type?: AlertType;
}

export const LoginAlert = ({ content, type = 'error' }: AlertParams) => {
  return (
    <Alert
      className={style.alert}
      message={content || 'Login failed'}
      type={type}
      showIcon
      closable
    />
  );
};
