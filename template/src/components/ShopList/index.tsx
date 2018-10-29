import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Avatar, Icon, Spin } from 'antd';
import { common } from '@/interface/common';
import ShopListTypes from './interface';

import Shops = ShopListTypes.Shops;

const styles = require('./styles.module.css')
const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;

interface Props {
  isMobile: boolean;
}

interface Injected extends common.ConnectProps, Props {
  shops: Shops;
  fetchingShop: boolean;
}

@connect(({ global: { shops }, loading }) => ({
  shops,
  fetchingShop: loading.effects['global/fetchShop'],
}))
class ShopList extends Component<Props> {
  get injected () {
    return this.props as Injected;
  }
  componentDidMount () {
    const { dispatch, shops } = this.injected;

    // only request data once
    if (!shops || !shops.length) {
      dispatch({ type: 'global/fetchShop' });
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

  render () {
    const { shops = [], fetchingShop, isMobile } = this.injected;

    if (!shops || !shops.length) return '暂无门店';
    const thisShop = shops.find(shop => shop && shop.selected);

    if (!thisShop) return '暂无门店';

    return (
      <div className={styles.shops__menu__wrapper}>
        <Spin spinning={fetchingShop}>
          <Menu
            style={{ width: '100%', height: 'auto', background: 'transparent' }}
            selectable
            theme="dark"
            mode={isMobile ? 'inline' : 'vertical'}
            onClick={this.handleItemClick}
          >
            <SubMenu
              key={thisShop.authId}
              title={
                thisShop ? (
                  <span>
                    {thisShop.logo ? (
                      <Avatar src={thisShop.logo} alt={thisShop.name} />
                    ) : (
                        <Icon type="shop" />
                      )}{' '}
                    <span className="shops__current">{thisShop.name}</span>{' '}
                  </span>
                ) : (
                    '无关联门店'
                  )
              }
            >
              {shops.length >= 2 &&
                <MenuItemGroup>
                  {shops.map(
                    ({ authId, selected, logo, name }) =>
                      !selected && (
                        <Menu.Item key={authId} disabled={selected}>
                          {
                            <span>
                              {logo ? (
                                <Avatar src={logo} alt={name} />
                              ) : (
                                  <Icon type="shop" />
                                )}{' '}
                              <span>{name}</span>{' '}
                            </span>
                          }
                        </Menu.Item>
                      )
                  )}
                </MenuItemGroup>
              }
            </SubMenu>
          </Menu>
        </Spin>
      </div>
    );
  }
}

export default ShopList;
