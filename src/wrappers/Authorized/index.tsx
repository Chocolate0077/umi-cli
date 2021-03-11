import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useModel, useHistory } from 'umi';
import PageLoading from '@/components/PageLoading';
import { notification, Button } from 'antd';

interface AuthorizedProps {}
const Authorized: FC<AuthorizedProps> = ({ children }) => {
  const { user, fetchUser, loading } = useModel('useUser');
  const history = useHistory();

  useEffect(() => {
    const token = localStorage.getItem('sms_token');
    if (!token) {
      history.push('/login');
    } else if (!user) {
      fetchUser().then((res) => {
        if (!res) {
          notification.error({
            message: '错误提示',
            description: '获取用户信息失败',
            btn: (
              <Button type="primary" onClick={() => history.replace({ pathname: '/login' })}>
                登录
              </Button>
            ),
          });
        }
      });
    }
  }, [fetchUser, history, user]);

  if (!user || loading) return <PageLoading />;

  return <>{children}</>;
};

export default Authorized;
