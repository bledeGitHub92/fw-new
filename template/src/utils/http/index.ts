import axios from 'axios';
import { AxiosPromise, AxiosRequestConfig } from 'axios/index'
import { RequestConfig } from './request'
import { stringify } from 'querystring';
import requestInterceptor from './interceptors/request';
import responseInterceptor from './interceptors/response';

axios.interceptors.request.use(...requestInterceptor);
axios.interceptors.response.use(...responseInterceptor);

export function get(
  requestURL: string,
  config: AxiosRequestConfig
): AxiosPromise {
  return axios.get(requestURL, config);
}

export function post(
  requestURL: string,
  data: any,
  config: RequestConfig = {}
): AxiosPromise {
  const defaultConfig: RequestConfig = {
    requestType: 'JSONString',
    headers: { 'Content-Type': 'application/json;charset=utf-8' }
  };
  const options: RequestConfig = { ...defaultConfig, ...config };

  if (options.requestType && ['JSONString', 'formData', 'paramString'].includes(options.requestType)) {
    options.headers['Content-Type'] = 'application/json';
    switch (options.requestType) {
      case 'JSONString':
        data = JSON.stringify(data);
        break;
      case 'formData':
        options.headers['Content-Type'] = 'multipart/form-data';
        data = stringify(data);
        break;
      case 'paramString':
        options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        data = Object.entries(data).map(([key, value]) => `${key}=${value}`).join('&');
        break;
    }
  }
  return axios.post(requestURL, data, options);
}

export default { get, post };