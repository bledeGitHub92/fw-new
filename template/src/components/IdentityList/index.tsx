import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Avatar, Icon, Spin } from 'antd';
import { routerRedux } from 'dva/router';
import { common } from '@/interface/common';
import ShopListTypes from './interface.d';

import Shops = ShopListTypes.Shops;

const styles = require('./styles.module.css');

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

interface Props {
  isMobile: boolean;
}

interface Injected extends common.ConnectProps, Props {
  identityList: Shops;
}

@connect(({ global: { identityList }, loading }) => ({
  identityList,
}))
class ShopList extends Component<Props> {
  get injected() {
    return this.props as Injected;
  }

  componentDidMount() {
    const { dispatch, identityList } = this.injected;

    // only request data once
    if (!identityList || !identityList.length) {
      dispatch({ type: 'global/fetchIdentityList' });
    }
  }

  render() {
    const { identityList = [], isMobile } = this.injected;

    return (
      <div className={styles.shops__menu__wrapper}>
        <Menu
          theme="dark"
          mode={isMobile ? 'inline' : 'vertical'}
          style={{ width: '100%', height: 'auto', background: 'transparent' }}
        >
          <SubMenu
            title={<span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>霏车车集团版</span>}
          />
        </Menu>
      </div>
    );
  }
}

export default ShopList;
