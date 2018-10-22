import { AxiosRequestConfig } from 'axios';

declare namespace iHttp {
  interface ServerResponse<T> {
    /**
     * 业务逻辑码
     */
    readonly code: number,

    /**
     * 接口是否请求成功
     */
    readonly success: boolean,

    /**
     * 请求结果情况文字描述
     */
    readonly result: string,

    /**
     * 请求之后的数据
     */
    readonly data: T
  }

  interface ParseResult<T> extends ServerResponse<T> {
    /**
     * 网络状态码
     */
    status: number
  }

  interface HttpRequestConfig extends AxiosRequestConfig {
    requestType?: 'JSONString' | 'paramString' | 'formdata',
    hasToken?: boolean,
    token?: string,
    useJson?: boolean
  }

  interface ErrorCode {
    [key: number]: string
  }

  interface ErrorMsg extends Error {
    errorCode?: number | string,
    errorMsg?: string,
    response?: any
  }
}

export default iHttp;