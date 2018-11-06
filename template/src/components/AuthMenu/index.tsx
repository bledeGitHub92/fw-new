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
      this.getNextRoute();
      this.setState({ next: true, });

    }
  }

  getNextRoute () {
    const { menus, dispatch, location } = this.injected
    const isDev = process.env.NODE_ENV === 'development';
    const DEV_HOST = process.env.DEV_HOST;
    const isNoPower = menus.length === 0;
    const hostname = isDev ? DEV_HOST : window.location.hostname;
    const currHost = menus.find(({ domain }) => domain === hostname);

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