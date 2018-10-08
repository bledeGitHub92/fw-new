import React, { Component } from 'react';
import { connect } from 'dva';
import { Popover, Avatar, Icon, Spin, Tooltip } from 'antd';
// import classnames from 'classnames';
import Ellipsis from '@/components/Ellipsis'
import styles from './styles.less';

@connect(({ global: { shops }, loading }) => ({
  shops,
  fetchingShop: loading.effects['global/fetchShop'],
}))
export default class ShopList extends Component {
  state = {
    toggle: false,
  }

  componentWillMount() {
    const { dispatch } = this.props;

    dispatch({ type: "global/fetchShop" })
  }

  handleToggle = () => {
    this.setState({
      toggle: !this.state.toggle,
    })
  }

  handleClickShop = (id) => {
    console.log('handleClickShop====================================');
    console.log(id);
    console.log('handleClickShop====================================');
  }

  render() {
    const { toggle } = this.state;
    const { shops, fetchingShop } = this.props;

    if (!shops || !shops.length) return '';
    const thisShop = shops.find((shop) => shop && shop.selected);

    const menu = (
      <ul className={styles.shop}>
        {
          shops.map(({ id, selected, shopLogo, shopName }) => (
            <li key={id} className={selected ? styles.shop__item__selected : styles.shop__item} onClick={() => this.handleClickShop(id)}>
              {shopLogo ? <Avatar src={shopLogo} alt={shopName} /> : <Icon type="shop" />}
              <span className={styles.shop__item__name}>
                {
                  selected ? '(当前)' + shopName : shopName
                }
              </span>
            </li>
          ))
        }
      </ul>
    )

    return (
      <div className={styles.shops__wrapper}>
        <Spin spinning={fetchingShop}>
          <span className={styles.shops__current}>
            <Popover content={menu} placement="bottomRight" trigger="click" visible={toggle && shops.length >= 2}>
              <Ellipsis length={12} tooltip={thisShop.shopName}>{thisShop.shopName}</Ellipsis>
            </Popover>
          </span>

          {
            shops.length >= 2 && <Tooltip title="点击切换门店">
              <Icon onClick={e => { e.preventDefault(); this.handleToggle() }} style={{ marginLeft: 5 }} type={toggle ? "up" : "down"} />
            </Tooltip>
          }
        </Spin>
      </div>
    );
  }
}
