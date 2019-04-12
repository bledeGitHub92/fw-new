import { message } from 'antd';
import { Descriptor } from './interface.d';

interface Config {
  /**
   * 错误信息，默认使用error对象
   */
  msg?: string;
  /**
   * 是否显示错误消息
   */
  isLog?: boolean;
  /**
   * 错误提示持续时间
   */
  duration?: number;
  /**
   * 失败之后调用的 action list
   */
  errorActions?: { type: string, payload?: any }[];
}

/**
 * 捕获错误
 */
function catchError(config: Config = { isLog: true, duration: 6, errorActions: [] }) {
  const { isLog = true, duration = 6, errorActions = [] } = config;
  return function (target: any, name: string, descriptor: Descriptor) {
    const oldFunc = descriptor.value;
    descriptor.value = function* (...args) {
      try {
        yield oldFunc.apply(this, args);
      } catch (e) {
        const msg = config.msg || e.message;
        errorActions.forEach(action => {
          // @ts-ignore
          window.g_app._store.dispatch(action);
        });
        isLog && message.error(msg, duration);
      }
    };
    descriptor.enumerable = true;
    return descriptor;
  };
}

export default catchError;
