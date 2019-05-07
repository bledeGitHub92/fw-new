import React, { Component } from 'react';
import { connect } from 'dva';
import { common } from '@/interface/common';
import PageLoading from '@/components/PageLoading';
import { Spin } from 'antd';
import isEqual from 'lodash/isEqual';
import router from 'umi/router';
import customRouterList from './customRouterList';

interface Props {
  children: any
}

interface Injected extends common.ConnectProps, Props {
  menus: any[];
}

interface State {
  next: boolean;
}

@connect(({ global }) => ({
  menus: global.menus,
}))
class AuthMenu extends Component<Props, State> {
  get injected() {
    return this.props as Injected;
  }

  state: State = {
    next: false,
  }

  componentDidMount() {
    const { dispatch } = this.injected;
    dispatch({ type: 'global/fetchMenu' });
  }

  componentDidUpdate(prevProps) {
    if (!isEqual(prevProps.menus, this.injected.menus)) {
      this.setState({ next: false, });
      const isRedirect = this.getNextRoute();
      this.setState({ next: !isRedirect, });
    }
  }
  
  getNextRoute() {
    const { menus } = this.injected;
    const isDev = process.env.NODE_ENV === 'development';
    const DEV_HOST = process.env.DEV_HOST;
    const isNoPower = menus.length === 0;
    const hostname = isDev ? DEV_HOST : window.location.hostname;
    const currHost = menus.find(({ domain }) => domain === hostname);
    const isRedirect = !currHost || currHost.children.length === 0;

    if (isNoPower) {
      return router.replace('/403');
    }

    const targetMenu = currHost && this.getTargetMenu(currHost);
    const targetPath = targetMenu
      ? targetMenu.path
      : currHost
        ? this.getDefaultPath(currHost.children)
        : this.getDefaultPath(menus[0].children);
    window.location.href = targetPath;
    return isRedirect;
  }
  
  getTargetMenu = (currHost) => {
    const pathname = this.injected.location.pathname;

    // 刷新页面时，保留在自定义的子路由页面
    const routerName = customRouterList.find(router => router === pathname);
    if (routerName) {
      let query = this.injected.location.search;
      return { path: `#${routerName}${query}`, }
    }

    // 刷新页面时，在权限菜单里查找路由
    const children = Array.isArray(currHost.children) ? currHost.children : [];
    let targetMenu = null;
    for (let i = 0, len = children.length; i < len; i++) {
      let cur = children[i];
      if (cur.path.split('#')[1] === pathname) {
        targetMenu = cur;
        return targetMenu;
      } else {
        const ret = this.getTargetMenu(cur);
        if (ret) {
          targetMenu = ret;
          break;
        }
      }
    }
    return targetMenu;
  }

  // 没有匹配到菜单时，获取第一个菜单路径
  getDefaultPath = (list: any[]) => {
    let first = list[0];
    let children = first.children;
    return Array.isArray(children) && children.length > 0 ? this.getDefaultPath(children) : first.path;
  }

  render() {
    const { next, } = this.state;

    return (
      <Spin spinning={!next} tip="初始化中...">
        {this.injected.children}
      </Spin>
    );
  }
}

export default AuthMenu;
