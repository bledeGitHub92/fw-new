import React, { Component } from 'react';
import { connect } from 'dva';
import { Menu, Avatar, Icon, Spin } from 'antd';
import styles from './styles.module.css';

const { SubMenu } = Menu;
const MenuItemGroup = Menu.ItemGroup;
@connect(({ global: { shops }, loading }) => ({
  shops,
  fetchingShop: loading.effects['global/fetchShop'],
}))
class ShopList extends Component {
  componentDidMount() {
    const { dispatch, shops } = this.props;

    // only request data once
    if (!shops || !shops.length) {
      dispatch({ type: 'global/fetchShop' });
    }
  }

  handleItemClick = ({ key: shopId }) => {
    if (!shopId) return;

    const { dispatch } = this.props;

    dispatch({
      type: 'global/switch',
      payload: { shopId },
    });
  };

  render() {
    const { shops = [], fetchingShop, isMobile } = this.props;

    if (!shops || !shops.length) return '暂无门店';
    const thisShop = shops && shops.length && shops.find(shop => shop && shop.selected);

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
              key={thisShop.id}
              title={
                thisShop ? (
                  <span>
                    {thisShop.shopLogo ? (
                      <Avatar src={thisShop.shopLogo} alt={thisShop.shopName} />
                    ) : (
                      <Icon type="shop" />
                    )}{' '}
                    <span className="shops__current">{thisShop.shopName}</span>{' '}
                  </span>
                ) : (
                  '无关联门店'
                )
              }
            >
              <MenuItemGroup title="切换门店">
                {shops.length >= 2 &&
                  shops.map(
                    ({ id, selected, shopLogo, shopName }) =>
                      !selected && (
                        <Menu.Item key={id} disabled={selected}>
                          {
                            <span>
                              {shopLogo ? (
                                <Avatar src={shopLogo} alt={shopName} />
                              ) : (
                                <Icon type="shop" />
                              )}{' '}
                              <span>{shopName}</span>{' '}
                            </span>
                          }
                        </Menu.Item>
                      )
                  )}
              </MenuItemGroup>
            </SubMenu>
          </Menu>
        </Spin>
      </div>
    );
  }
}

export default ShopList;
