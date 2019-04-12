import { Descriptor } from './interface.d';

interface Config {
  /**
   * 接口中文名，用户提示
   */
  name: string;
  namespace: string;
}

/**
 * 请求失败显示重试按钮
 */
function retry(config: Config) {
  const { namespace, name } = config;
  return function (target: any, key: string, descriptor: Descriptor) {
    const type = `${namespace}/${key}`;
    const oldFunc = descriptor.value;
    descriptor.value = function* (...args) {
      try {
        yield oldFunc.apply(this, args);
        // @ts-ignore
        window.g_app._store.dispatch({ type: 'retry/removeFailing', payload: { type, } });
      } catch (e) {
        console.log('error', e);
        console.log('config', e.config);
        // 如果是请求失败，会有请求对象
        if (e.config) {
          // @ts-ignore
          window.g_app._store.dispatch({ type: 'retry/addFailing', payload: { name, type, config: e.config } });
        }
      }
    };
    descriptor.enumerable = true;
    return descriptor;
  };
}

export default retry;
