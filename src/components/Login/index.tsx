import type { FC } from 'react';
import React from 'react';
import { useModel, useRequest } from 'umi';
import _ from 'lodash';
import { Form, Input, Button } from 'antd';
import { useHistory } from 'react-router-dom';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { LoginAlert } from './LoginAlert';
import { ReactComponent as Logo } from './logo.svg';
import style from './style.module.css';
import type { LoginParams } from '@/apis/user';
import userApis from '@/apis/user';
/**
 * 账号密码登录
 *
 * @author Witee<github.com/Witee>
 * @date 2020-10-21
 */
const Login: FC = () => {
  const history = useHistory();

  const { user, fetchUser, loading } = useModel('useUser');

  const loginRequest = useRequest(userApis.login, {
    manual: true,
    onSuccess: async (result) => {
      if (!result) return;
      const { token, tokenHead } = result;
      localStorage.setItem('sms_token', `${tokenHead}${token}`);
      fetchUser().then((userInfo) => {
        if (!userInfo) return;
        history.push('/');
      });
    },
  });

  const handleFinish = async (values: LoginParams) => {
    loginRequest.run(values);
  };

  const errorDetail = _.get(loginRequest.error, 'response.data.msg');

  return (
    <div className={style.container}>
      <div className={style.logo}>
        <Logo width="100%" height="100%" />
      </div>

      {loginRequest.error && <LoginAlert content={errorDetail} />}

      <Form className={style.form} onFinish={handleFinish}>
        <Form.Item name="username" rules={[{ required: true, message: '用户名' }]}>
          <Input size="large" prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Form.Item>

        <Form.Item name="password" rules={[{ required: true, message: '密码' }]}>
          <Input size="large" prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            className={style.button}
            loading={loginRequest.loading}
          >
            登录
          </Button>

          <a
            className={style.forgot}
            target="_blank"
            rel="noopener noreferrer"
            href="https://account.mininglamp.com/password/retrieve"
          >
            忘记密码
          </a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
