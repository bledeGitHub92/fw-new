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
  fetchingShop: boolean;
}

@connect(({ global: { identityList }, loading }) => ({
  identityList,
  fetchingShop: loading.effects['global/fetchIdentityList'],
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

  handleItemClick = ({ key }) => {
    if (!key) return;
    const { dispatch } = this.injected;

    dispatch({
      type: 'global/switch',
      payload: { key },
    });
  };

  render() {
    const { identityList = [], fetchingShop, isMobile } = this.injected;

    return (
      <div className={styles.shops__menu__wrapper}>
        <Spin spinning={fetchingShop}>
          <Menu
            theme="dark"
            mode={isMobile ? 'inline' : 'vertical'}
            style={{ width: '100%', height: 'auto', background: 'transparent' }}
            onClick={this.handleItemClick}
          >
            <SubMenu
              title={<span style={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }}>霏车车集团版</span>}
            />
          </Menu>
        </Spin>
      </div>
    );
  }
}

export default ShopList;
