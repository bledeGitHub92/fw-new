import React, { Component } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { common } from '@/interface/common';
import PageLoading from '@/components/PageLoading';
import isEqual from 'lodash/isEqual';

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
      if (process.env.NODE_ENV === 'development') {
        return this.setState({ next: true });
      }
      this.setState({ next: false, });
      const isRedirect = this.getNextRoute();
      this.setState({ next: !isRedirect, });
    }
  }

  getNextRoute() {
    const { menus, dispatch, location } = this.injected;
    const isDev = process.env.NODE_ENV === 'development';
    const DEV_HOST = process.env.DEV_HOST;
    const isNoPower = menus.length === 0;
    const hostname = isDev ? DEV_HOST : window.location.hostname;
    const currHost = menus.find(({ domain }) => domain === hostname);
    const isRedirect = !currHost || currHost.children.length === 0;

    if (isNoPower) {
      return dispatch(routerRedux.replace('/403'));
    }

    const targetMenu = currHost && currHost.children.find(({ path }) => path.split('#')[1] === location.pathname);
    const targetPath = targetMenu
      ? targetMenu.path
      : currHost
        ? currHost.children[0].path
        : menus[0].children[0].path;

    window.location.href = targetPath;
    return isRedirect;
  }

  render() {
    const { next, } = this.state;

    if (!next) { return <PageLoading />; }

    return (
      <>
        {this.injected.children}
      </>
    );
  }
}

export default AuthMenu;