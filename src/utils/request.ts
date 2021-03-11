/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import type { RequestOptionsWithResponse } from 'umi-request';
import { extend } from 'umi-request';
import { notification, Modal } from 'antd';
import type { ResponseData } from 'commonTypes';

/* 访问的基础路径 */
const basePath = BASE_PATH;
// '/m/sms/api/v1';

const codeMessage: Record<number, string> = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 *  约定code Handler
 */
const errCodeHandler: Record<number, () => void> = {
  1071: () => {
    Modal.error({
      title: '登录超时或未登录',
      content: '点击以下按钮将跳转至登录页面，请重新登录',
      okText: '登录',
      onOk: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
      },
    });
  },
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;

  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
  timeout: 50000,
});

/**
 * 响应拦截器 通过约定的code处理各种情况
 */
// request.interceptors.response.use(async response => {
//   const data = await response.clone().json();
//   const code = data.code;
//   if (!errCodeHandler[code]) return response;
//   errCodeHandler[code](data);
//   return response;
// });

/**
 * 结果封装
 */
export async function fetch<T = any>(
  url: string,
  options: Omit<RequestOptionsWithResponse, 'getResponse'>,
) {
  const requestUrl = url.includes('http') || url.includes('https') ? url : basePath + url;

  const result = await request<ResponseData<T>>(requestUrl, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: localStorage.getItem('sms_token') || '',
    },
    getResponse: false,
  });

  if (errCodeHandler[result.code]) {
    errCodeHandler[result.code]();
    return result;
  }

  if (!result || !result.isSuccess) {
    notification.error({
      message: `${result.message}`,
      description: (result && result.data) || '请求出错，请重试或联系管理员!',
    });
  }

  return result;
}

/**
 *  fetch response 成功处理
 */
export function resSuccessHandler({
  response,
  message,
  callback,
}: {
  response: ResponseData | null;
  message: string;
  callback?: () => void;
}) {
  if (!response || !response.isSuccess) return;
  notification.success({ message });
  if (callback) {
    callback();
  }
}

export default request;
