import type { FC } from 'react';
import React from 'react';
import { Dropdown, Avatar, Menu, Space } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd/es/menu';
import './index.less';
import { useHistory } from 'umi';
import { UserOutlined } from '@ant-design/icons';

interface AvatarDropdownProps {
  name?: string;
}
const AvatarDropdown: FC<AvatarDropdownProps> = ({ name }) => {
  const history = useHistory();
  const onMenuClick: MenuProps['onClick'] = (event) => {
    if (event.key === 'logout') {
      localStorage.removeItem('sms_token');
      history.push('/login');
    }
  };

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );

  return (
    <Dropdown overlay={menuHeaderDropdown} className="avatar-dropdown">
      <Space>
        <Avatar size="small" style={{ backgroundColor: '#3b7fff' }} icon={<UserOutlined />} />
        <span className="avatar-name">{name}</span>
      </Space>
    </Dropdown>
  );
};

export default AvatarDropdown;
