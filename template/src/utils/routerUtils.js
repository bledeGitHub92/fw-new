import 'antd/lib/spin/style/css';
import { AUTH_NAME } from './const';
import { isUrl } from './utils';
import { getCookie, delCookie } from './cookie';

/**
 * Checkout Authority Cookie
 */
export const checkAuthority = () => getCookie(AUTH_NAME);

/**
 * Remove Authority Cookie
 */
export const removeAuthority = () => delCookie(AUTH_NAME);

/**
 * formatMenus
 * @desc 格式化菜单数据，并支持`domain`属性
 * @inspired antd-pro
 * @param {Array<Object>} menu
 * @param {String} parentPath   上一节点路径
 * @return {Array<Menu>}   菜单路由
 * @example
 *  const menus = [{
 *    "name":"基础管理系统",
 *    "icon":"dashboard",
 *    "path":"admin",
 *    "domain":"admin.feewee.cn",
 *    "children":[{
 *      "name":"系统管理",
 *      "icon":"setting",
 *      "path":"system"
 *    }]
 *  }]
 *
 *  const menuRoutes = formatMenus(menus); //[{"name":"基础管理系统","icon":"dashboard","path":"/admin","domain":"admin.feewee.cn","children":[{"name":"系统管理","icon":"setting","path":"/admin/system"}]}]
 */
export function formatMenus(menu, parentPath = '/', parentDomain = null) {
  return menu.map(item => {
    const { domain } = item;
    let { path } = item;
    let advcanedParemtDomain = parentDomain;

    if (!isUrl(path)) {
      path = parentPath + item.path;

      // only add the host in `development` env
      if (advcanedParemtDomain) {
        if (process.env.NODE_ENV === 'development') {
          advcanedParemtDomain = window.location.host;
        }

        path = `${window.location.protocol}//${advcanedParemtDomain}/#${path}`;
      }
    }

    const result = {
      ...item,
      path,
    };

    if (item.children) {
      result.children = formatMenus(item.children, `${parentPath}${item.path}/`, domain);
    }

    return result;
  });
}

/**
 * getMenuData
 * @desc 向当前业务层 菜单中注入 开发环境 菜单
 *  1. server 会返回原有的 oldMenus 菜单数据，需要格式化
 *  2. 新的菜单数据 newMenus 需要被格式化加入 菜单
 * @param {Array<Menus>} oldMenus
 * @return {Function? Array<RouteConfig> => }
 * @example
 *  const oldMenus = [{name: 'a', path: 'a', children: [{ name: 'b', path: 'b' }]}]
 *  const newMenus = [{name: 'c', path: 'c', children: [{ name: 'd', path: 'd' }]}]
 *  const menusData = @injectMenus(newMenus)(oldMenus)
 */
export function getMenuData(oldMenus = [], newMenus = []) {
  const newMenuData = formatMenus(newMenus);
  const oldMenuData = formatMenus(oldMenus || []);

  return [...oldMenuData, ...newMenuData];
}
