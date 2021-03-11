import { fetch } from '@/utils/request';

export interface LoginParams {
  username: string;
  password: string;
}

interface LoginResult {
  tokenHead: string;
  token: string;
}

const login = (params: LoginParams) => {
  return fetch<LoginResult>('/sso/login', {
    method: 'POST',
    data: params,
  });
};

enum RoleEnum {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}
export interface UserInfo {
  createdAt: string;
  id: number;
  isDeleted: DeleteEnum;
  updatedAt: string;
  userEmail: string;
  userRole: RoleEnum;
  userStatus: UserStatusEnum;
  userType: 'OPERATION';
  username: string;
}

const list = () => {
  return fetch<UserInfo[]>('/users', {
    method: 'GET',
  });
};

const detail = () => {
  return fetch<UserInfo>('/sso/info', {
    method: 'GET',
  });
};

export default {
  login,
  list,
  detail,
};
