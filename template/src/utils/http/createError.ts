import { AxiosResponse } from 'axios';
import iHttp from './request';

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
  '-1': '当前请求异常'
}

function createError(responseError: AxiosResponse) {
  let errorCode, errorMsg, response = {};

  // 请求已经发送，并且服务器有返回
  if (responseError.data || responseError.status) {
    response = responseError.data || responseError;

    let data = responseError.data;

    if (data && typeof data === 'object') {
      errorMsg =
        data.result ||
        data.error_msg ||
        data.message ||
        data.description;
      errorCode = data.code || data.status || responseError.status;
    }
    if (!errorCode) {
      errorCode = responseError.status;
    }
    if (!errorMsg) {
      errorMsg = responseError.statusText;
    }
    // @ts-ignore
  } else if (responseError.request) { // 请求已经发送但是没有收到服务端响应
    console.log('请求已经发送但是没有收到服务端响应');
    if (!errorCode) {
      errorCode = responseError.status;
      errorMsg = responseError.statusText;
    }

  } else { // 请求未发送
    errorMsg = '请求未发送成功';
  }

  if (!errorCode) {
    errorCode = -1;
  }

  const error: iHttp.ErrorMsg = new Error(errorMsg);
  error.errorCode = errorCode;
  error.errorMsg = errorMsg || ERROR_MSG[errorCode];
  error.response = response;

  return Promise.reject(error);
}

export default createError;