import createError from '../createError';
import iHttp from '../request';
import { AxiosResponse } from 'axios';

/**
 * @desc 如果找不到response.data.data，则将返回格式解析为统一格式
 */
function parseResponse<T>(response: AxiosResponse): iHttp.ParseResult<T> {
  const code: number = response.status;
  const success: boolean = true;
  const result: string = response.statusText;
  const status: number = response.status;
  const data = response.data;

  return { code, success, result, data, status };
}


export default [
  response => {
    let data = response.data;

    if (data) {
      if (data.success === false) {
        return createError(response);
      }

      if (data.data) {
        data.status = response.status;
        return data;
      }

      return parseResponse(response);
    }

    return createError(response);
  }, error => {
    return createError(error.response);
  }
]