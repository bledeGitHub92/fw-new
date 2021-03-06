import axios from 'axios';
import requestInterceptor from './interceptors/request';
import responseInterceptor from './interceptors/response';
import iHttp from '@/utils/http/request';

axios.interceptors.request.use(...requestInterceptor);
axios.interceptors.response.use(...responseInterceptor);

export function get<T>(requestURL: string, config?: iHttp.HttpRequestConfig): Promise<iHttp.ParseResult<T>> {
  // @ts-ignore
  return axios.get(requestURL, config);
}

export function post<T>(requestURL: string, params: any, config?: iHttp.HttpRequestConfig): Promise<iHttp.ParseResult<T>> {
  // @ts-ignore
  return axios.post(requestURL, params, config);
}

export default { get, post };