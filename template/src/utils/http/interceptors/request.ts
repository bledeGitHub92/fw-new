import { showErrorMsg } from '@/utils/http/utils';

export default [
  function (config) {
    if (config.debug) {
      console.log('request => config ====================================');
      console.log(config);
      console.log('request => config ====================================');
    }
    return config;
  },
  function (error) {
    return Promise.reject(error).then(error => {
      showErrorMsg(error);
      console.dir(error);
    });
  }
]