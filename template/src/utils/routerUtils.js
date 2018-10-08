import React, { createElement } from 'react';
// import Loadable from 'react-loadable';  // https://github.com/jamiebuilds/react-loadable
// import { routerRedux } from 'dva/router';
import dynamic from 'dva/dynamic'; // https://dvajs.com/api/#dva-dynamic
import Spin from 'antd/lib/spin';
import 'antd/lib/spin/style/css';
import { AUTH_NAME } from './const';
import { isUrl, isFunction, isPlainObject } from './utils';
import { getCookie, delCookie } from './helpers/Cookie';
import { geneLoginUrl } from './http/utils';


/**
 * Checkout Authority Cookie
 */
export const checkAuthority = () => {
  return getCookie(AUTH_NAME);
}

/**
 * Remove Authority Cookie
 */
export const removeAuthority = () => {
  return delCookie(AUTH_NAME);
}

export const getBashRedirect = (routes) => {
  // According to the url parameter to redirect
  // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
  const urlParams = new URL(window.location.href);
  const redirect = urlParams.searchParams.get('redirect');

  // Remove the parameters in the url
  if (redirect) {
    urlParams.searchParams.delete('redirect');
    window.history.replaceState(null, 'redirect', urlParams.href);
  }

  return redirect || (routes[0] && routes[0].path);
}

export const redirectToPath = (redirect) => {
  if (!redirect) redirect = geneLoginUrl();
  const location = window.location;

  if (isUrl(redirect)) {
    return location.replace(redirect)
  } else {
    // get location pathname
    const pathname = location.hash && location.hash.replace(/\#?/, '')

    // add the parameters in the url
    if (pathname && /\/.+/.test(pathname)) {
      // return routerRedux.push(pathname ? `${redirect}?redirect=${pathname}` : redirect)
      // return window.history.replaceState(null, 'login', redirect)
      return location.href = `${redirect}?redirect=${pathname}`
    }

    return location.href = redirect;
  }
}

const cached = {};
export function registerModel(app, model) {
  model = model.default || model;
  if (!cached[model.namespace]) {
    app.model(model);
    cached[model.namespace] = 1;
  }
}

export const lazyLoadModels = (app, models) => {
  if (!Array.isArray(models)) {
    models = [models];
  }

  // Execute all promises
  models = models.map(model => model())

  // return `Promise.all`
  return Promise.all(...models).then(ret => {
    ret.forEach(m => {
      m = m.default || m;
      (Array.isArray(m) ? m : [m]).map(_ => registerModel(app, _));
    })
  })
}

// wrapper of dynamic,
// lazyLoad component and add loading effect
export const dynamicWrapper = (app, models, component) => {
  // register models
  // support require('model'), () => import(model) and () => [import(model), import(model1)]
  if (models) {
    if (isPlainObject(models)) { // for CMD `require('module')`
      registerModel(app, models);
    } else if (typeof models === 'function') { // for async load `() => [import('module1'), import('module2')]`
      return lazyLoadModels(app, models).then(
        () => lazyLoadComponent(isFunction(component) ? component() : component)
      )
    } else if(typeof models === 'string') { // for string path
      // 因为这里使用全局的上下文，所以这样相对位置的引用会比较尴尬
      // 推荐在传入 model 的时候包上绝对路径
      // registerModel(models.includes('/') ? require(models) : require(`../models/${models}`))
    }
  }

  // works for () => require('module') `CMD`
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    return props => createElement(
      component().default,
      { ...props }
    );
  }

  // webpack lazy load `() => ('module')`
  // () => import('module')
  return lazyLoadComponent(isFunction(component) ? component() : component);
};


const Loadable = (obj) => obj;
export const lazyLoadComponent = (component) => {
  return Loadable({
    // loader: component,
    loader: () => {
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            // routerData: routerDataCache,
          });
      });
    },
    delay: 300,
    loading: Loading
  });
}


function Loading(props) {
  if (props.error) {
    return <div>Error! <button onClick={ props.retry }>Retry</button></div>;
  } else if (props.timedOut) {
    return <div>Taking a long time... <button onClick={ props.retry }>Retry</button></div>;
  } else if (props.pastDelay) {
    return <Spin size="large" className="global-spin" />;
  } else {
    return null;
  }
}


export const dvaLazyLoad = (app, routes) => {
  return routes.reduce((config, { path, models, component, ...restConfig }) => {
    if (isFunction(component) || isFunction(models)) {
      config[path] = {
        path,
        component: dynamic({
          app,
          models,
          component,
          LoadingComponent: () => <Spin size="large" className="global-spin" />,
          ...restConfig,
        })
      }
    } else {
      config[path] = { path, models, component }
    }

    return config
  }, {})
}


export const loadableLazyLoad = (app, routes) => {
  return routes.reduce((config, { path, models, component }) => {
    if (isFunction(component)) {
      config[path] = { path, component: dynamicWrapper(app, models, component), }
    } else {
      config[path] = { path, component, }
    }

    return config
  }, {});
}


/**
 * flattenChildren
 * @param {Array<Object>} arr
 */
export const flattenChildren = (arr) => {
  let flattened = []

  arr.forEach(item => {
    if (item.children && item.children.length) {
      flattened.push(...flattenChildren(item.children))
    } else {
      flattened.push(item)
    }
  })

  return flattened;
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
export let MENUS = [];
export function getMenuData(oldMenus = [], newMenus = []) {
  const newMenuData = formatMenus(newMenus);
  const oldMenuData = formatMenus(oldMenus || []);

  return MENUS = [...oldMenuData, ...newMenuData]
}


/**
 * flattenMenuData
 * @desc 递归展开所有菜单数据
 * @author antd-pro
 * @param {Array<Menu>} menus
 * @return {Object<Menu>}
 * @example
 *  flattenMenuData(formatMenus(menus)) // { '/a': Menu1, '/ab': Menus11, '/abc': Menus111, '/b': Menu2 }
 */
export function flattenMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...flattenMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}


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
    let { path, domain } = item;

    if (!isUrl(path)) {
      path = parentPath + item.path;

      // only add the host in `development` env
      if (parentDomain) {
        if (process.env.NODE_ENV === 'development') {
          parentDomain = window.location.host;
        }

        path = window.location.protocol + '//' + parentDomain + '/#' + path
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
