import iHttp from '../request';

export default [
  (config: iHttp.HttpRequestConfig) => {
    if (!config.timeout) {
      config.timeout = 10 * 1000;
    }

    /**
     * @desc 给每个请求新增时间戳
     */
    config.params = Object.assign({ _s: Date.now() }, config.params);

    if (config.token) {
      config.headers.Authorization = config.token;
    }

    if (config.requestType && config.requestType === 'JSONString') {
      config.headers['Content-Type'] = 'application/json';
    }

    if (config.requestType && config.requestType === 'paramString') {
      config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      config.transformRequest = (data) => {
        let key,
          result = [];
        if (typeof data === 'string') {
          return data;
        }

        for (key in data) {
          if (Object.prototype.hasOwnProperty.call(data, key)) {
            result.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
          }
        }
        return result.join('&');
      };
    }

    if (config.requestType && config.requestType === 'formdata') {
      // TODO
      config.headers['Content-Type'] = 'multipart/form-data';
      config.transformRequest = (data) => {
        if (data instanceof FormData) {
          return data;
        }
        const f = new FormData();
        Object.entries(data).forEach(([key, value]: any[]) => {
          f.append(key, value);
        });
        return f;
      }
    }

    return config;
  }
]