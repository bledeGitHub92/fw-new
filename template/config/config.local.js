import config from './config';

export default {
  ...config,
  define: {
    // 在此填写项目名
    'process.env.DEV_HOST': generateHostanem(),
  },
}


/**
 * @param {stirng} projectName 项目名
 * - 要和 /api/admin/menu/getUserMenu 接口返回的最外层菜单的 path 值相同。
 * @example
 * [
 *   {
 *     "name":"优惠券系统",
 *     "path":"coupon", --> 这个值
 *     ...
 *   },
 *   ...
 * ]
 */
function generateHostanem(projectName) {
  if (typeof projectName !== 'string' || projectName === '') {
    throw new Error('请在 /config/config.local.js 填写项目名!');
  }
  return `dev${projectName}.feewee.cn`;
}
