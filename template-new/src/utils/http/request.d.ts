import { AxiosRequestConfig } from "axios";


export interface RequestConfig extends AxiosRequestConfig {
  requestType?: 'JSONString' | 'formData' | 'paramString'
}
