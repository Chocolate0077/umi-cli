import type { FC } from 'react';
import React, { useEffect } from 'react';
import { useModel } from 'umi';

/*
  配置全局数据持久化
*/
const GlobalData: FC = ({ children }) => {
  const { fetchUser, users } = useModel('useExternalUsers');
  const { fetchResource, resourceOpts } = useModel('useResource');

  useEffect(() => {
    if (!users || !users.length) fetchUser();
  }, [users, fetchUser]);

  useEffect(() => {
    if (!resourceOpts || !resourceOpts.length) fetchResource();
  }, [resourceOpts, fetchResource]);

  return <>{children}</>;
};

export default GlobalData;
