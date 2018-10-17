import { getErrorMsg, handleUnauthorized, showErrorMsg } from '@/utils/http/utils';

export default [
  function (response) {
    // handle server response error
    const { data, status, statusText, /* headers, */ config = {} } = response; // 参见0 参见1

    // if it is a external request, just return its data
    if (config.external) {
      return data;
    } else {
      // if no data returns from server, do nothing
      // and just return empty data object
      if (data) {
        const { code, success, data: serverData, result } = data;

        // 默认当 success && code === 0 的时候
        // 理解为下游不需要手动处理 data.code，所以直接返回 data
        if (success && code === 0) {
          return serverData;
        }
        // 需要自己处理成功后的code
        // 或者 code 不为0的情况
        // else if (config.allData || code !== 0) {
        //   return data;
        // } 
        else {
          let message = '请求返回异常';
          // 不交由下游处理
          if (!config.handleError) {
            showErrorMsg(message = getErrorMsg(data, status, result || statusText));
          }

          return Promise.reject({ message, code, data });
        }
      }
      /*  else {
       // 这里的异常不能吃！！！
       return Promise.reject(new Error('Data is not a valid object'))
       } */
    }
  },
  function (error) {
    // handle http status code error `401|403|500`
    const { config = {}, code, request = {}, response = {} } = error; // 参见1

    if (error && (config || request || response)) {
      const { data, status, statusText, code: respCode /* headers */ } = response; // 参见0

      let errorMsg = '请求发生错误';
      let errorCode = code || respCode || status;

      if (errorCode && errorCode === 'ECONNABORTED') {
        errorMsg = getErrorMsg(data, status || 504, statusText);
      } else {
        errorMsg = getErrorMsg(data, status, statusText);
      }

      // 不交由下游处理
      if (!config.handleError) {
        if (status) {
          if (status === 401 && data && typeof data === 'object') { //unauthorized
            handleUnauthorized(errorCode || status, data);
          } else {
            showErrorMsg(errorCode || status, errorMsg);
          }
        }
      }

      if (errorMsg) error.message = errorMsg;
      if (errorCode) error.code = errorCode;

    } else {
      showErrorMsg('Unknown Error', error);
    }

    return Promise.reject(error);
  }
]