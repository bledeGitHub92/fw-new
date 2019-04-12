import { AxiosRequestConfig } from 'axios';
import { message } from 'antd';
import { common } from '@/interface/common';

type Action<T> = common.Action<T>;

interface DispatchItem {
  /**
   * 接口中文名，用于提示
   */
  name: string;
  /**
   * dispatch type
   */
  type: string;
  config: AxiosRequestConfig;
}

export interface Model {
  errorList: DispatchItem[];
}

export default {
  namespace: 'retry',

  state: {
    /**
     * 失败的请求列表
     */
    errorList: []
  } as Model,

  effects: {

  },

  reducers: {
    /**
     * 添加失败请求配置
     */
    addFailing(state: Model, action: Action<DispatchItem>): Model {
      const dispatchItem = action.payload;
      // 防止重复添加
      const isExist = state.errorList.some(item => item.type === dispatchItem.type);
      return {
        ...state,
        errorList: isExist ? [...state.errorList] : state.errorList.concat(dispatchItem),
      };
    },

    /**
     * 删除失败请求配置
     */
    removeFailing(state: Model, action: Action<DispatchItem>): Model {
      return {
        ...state,
        errorList: state.errorList.filter(item => item.type !== action.payload.type),
      };
    }
  }
};