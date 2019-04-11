import { AxiosError } from 'axios';
import router from 'umi/router';
import iHttp from './request.d';

export const ERROR_MSG: iHttp.ErrorCode = {
  500: '500, 服务器异常，请稍后再试',
  503: '抱歉，当前服务器异常，请稍后再试',
  504: '服务器响应超时',

  401: '抱歉，您还未登录',
  40101: '抱歉，您还未登录',
  40102: '抱歉，您还未登录',
  40103: '抱歉，您还未登录',
  40104: '登录已过期，您需要重新登录',
  40001: '获取版本信息失败',
  403: '抱歉，您没有权限访问该页面',
  404: '你访问的接口不存在',

  // 自定义
  10001: '解析失败，_bodyInit为非正确的JSON格式字符串',
  10002: '网络异常，请确保您能够正常访问网络',
  10003: '该数据为app版本发布信息，数据格式与普通的返回结果不一致',
  10004: '请求已经终止',
  10005: '请求超时，请重试。',
  10006: '请求未发送成功',
  '-1': '当前请求异常'
};

function createError(error: AxiosError) {
  const response = error.response;
  let request = error.request;
  let config = error.config;
  let errorCode = -1;
  let data: any = {};

  // 请求已经发送，并且服务器有返回
  if (response) {
    // 重新登录
    if (response.status === 401) {
      errorCode = 401;
      router.push('/user/login');
    }

    data = response.data || response;

    if (data && typeof data === 'object') {
      errorCode = data.code
        || data.status
        || response.status;
    }
    if (!errorCode) {
      errorCode = response.status;
    }
    // 请求已经发送但是没有收到服务端响应
  } else if (request) {
    errorCode = 10005;
    // 请求未发送
  } else {
    errorCode = 10006;
  }

  if (!errorCode) {
    errorCode = -1;
  }

  const newError: iHttp.ErrorMsg = new Error(ERROR_MSG[errorCode]);
  newError.errorCode = errorCode;
  newError.errorMsg = ERROR_MSG[errorCode];
  newError.response = data;

  return Promise.reject(newError);
}

export default createError;