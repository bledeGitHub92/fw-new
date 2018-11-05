import React, { Props, Component } from 'react';
import { connect } from 'dva';
import { common } from '@/interface/common';
import { routerRedux } from 'dva/router';
import PageLoading from '@/components/PageLoading';

interface Injected extends common.ConnectProps, Props<undefined> {
  menus: any[];
}

interface State {
  next: boolean;
}

@connect(({ global }) => ({
  menus: global.menus,
}))
class AuthMenu extends Component {
  get injected () {
    return this.props as Injected;
  }

  state: State = {
    next: false,
  }

  componentDidMount () {
    const { dispatch } = this.injected;

    dispatch({ type: 'global/fetchMenu' });
  }

  componentDidUpdate (prevProps, prevState) {
    if (prevProps.menus !== this.injected.menus) {
      this.setState({ next: false, });
      this.getNextRoute(this.injected.menus);
    }
  }

  getNextRoute (menus) {
    const isDev = process.env.NODE_ENV === 'development';
    const DEV_HOST = process.env.DEV_HOST;
    const { dispatch, location } = this.injected
    const hostname = isDev ? DEV_HOST : window.location.hostname;
    const isNoPower = menus.length === 0;
    const isNotFound = menus.every(({ path, children }) => {
      return children.every(({ path: childPath }) => `/${path}/${childPath}` !== location.pathname)
    });
    const currHost = menus.find(({ domain }) => domain === hostname);
    const targetMenu = currHost && currHost.children.find(({ path }) => path.split('#')[1] === location.pathname);
    const targetPath = targetMenu
      ? targetMenu.path
      : currHost
        ? currHost.children[0].path
        : menus[0].children[0].path;

    this.setState({
      next: true,
    });

    if (isNoPower) {
      return dispatch(routerRedux.replace('/403'));
    }


    if (!isNotFound) return;

    window.location.href = currHost ? targetPath : menus[0].children[0].path;
  }

  render () {
    const { next, } = this.state;

    if (!next) { return <PageLoading /> }

    return (
      <>
        {this.injected.children}
      </>
    )
  }
}

export default AuthMenu;