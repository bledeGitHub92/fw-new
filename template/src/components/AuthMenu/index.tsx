import React, { Props, Component } from 'react';
import { connect } from 'dva';
import { common } from '@/interface/common';
import { routerRedux } from 'dva/router';
import { reloadAuthorized } from '@/utils/Authorized';
import { removeAuthority } from '@/utils/routerUtils';
import { message } from 'antd';
import Redirect from 'umi/redirect';

interface Injected extends common.ConnectProps, Props<undefined> {
  menus: any[];
}

interface State {
  next: boolean;
  isNotFound: Boolean;
  menus: any[];
  prevPath: string;
}

@connect()
class AuthMenu extends Component {
  get injected () {
    return this.props as Injected;
  }

  state: State = {
    next: false,
    isNotFound: false,
    menus: [],
    prevPath: '',
  }

  async componentDidMount () {
    const { dispatch } = this.injected;

    const menus = await dispatch({ type: 'global/fetchMenu' });
    this.setState({
      menus,
    });
    this.getNextRoute(menus);
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
    const CurrHost = menus.find(({ domain }) => domain === hostname);

    if (isNoPower) {
      message.info('请向管理员索取权限!');
      removeAuthority();
      reloadAuthorized();
      dispatch(routerRedux.push('/'));
    }

    this.setState({
      next: true,
      prevPath: `/${CurrHost.path + '/' + CurrHost.children[0].path}`,
    });


    if (!isNotFound) return;

    if (CurrHost) {
      dispatch(routerRedux.replace(`/${CurrHost.path + '/' + CurrHost.children[0].path}`));
    } else {
      window.location.href = `http://${menus[0].domain}/#/${menus[0].path + '/' + menus[0].children[0].path}`;
    }
  }

  render () {
    const { next, } = this.state;

    return (
      <>
        {next && this.injected.children}
      </>
    )
  }
}

export default AuthMenu;