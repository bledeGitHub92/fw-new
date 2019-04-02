import React, { PureComponent } from 'react';
import { formatMessage } from 'umi/locale';
import { Layout, message, Modal, Icon, Spin } from 'antd';
import Animate from 'rc-animate';
import { connect } from 'dva';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';
import Authorized from '@/utils/Authorized';

const { Header } = Layout;

class HeaderView extends PureComponent {
  state = {
    visible: true,
    showIdentity: false,
  };

  static getDerivedStateFromProps(props, state) {
    if (!props.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    const { dispatch } = this.props;
    document.addEventListener('scroll', this.handScroll, { passive: true });
    dispatch({ type: 'user/fetchUser' });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed, setting } = this.props;
    const { fixedHeader, layout } = setting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };

  handleNoticeClear = type => {
    message.success(`${formatMessage({ id: 'component.noticeIcon.cleared' })} ${type}`);
    const { dispatch } = this.props;
    dispatch({
      type: 'global/clearNotices',
      payload: type,
    });
  };

  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    if (key === 'changeIdentity') {
      this.switchIdentityShow(true);
    }
    if (key === 'logout') {
      dispatch({ type: 'user/logout' });
    }
  };

  switchIdentityShow = (show = false) => {
    show = typeof show === 'boolean' ? show : false;
    this.setState({ showIdentity: show });
  }

  switchIdentity = (identity) => {
    const { selected, psmId } = identity;
    if (selected) return;
    this.props.dispatch({
      type: 'user/switchIdentity',
      payload: identity.psmId,
      callback: this.switchIdentityShow
    })
  }

  handleNoticeVisibleChange = visible => {
    if (visible) {
      const { dispatch } = this.props;
      dispatch({
        type: 'global/fetchNotices',
      });
    }
  };

  handScroll = () => {
    const { autoHideHeader } = this.props;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
          this.scrollTop = scrollTop;
          return;
        }
        if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        }
        if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
    this.ticking = false;
  };

  render() {
    const { isMobile, handleMenuCollapse, setting, identityList, switchIdentityLoading } = this.props;
    const { navTheme, layout, fixedHeader } = setting;
    const { visible, showIdentity } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            Authorized={Authorized}
            onCollapse={handleMenuCollapse}
            onNoticeClear={this.handleNoticeClear}
            onMenuClick={this.handleMenuClick}
            onNoticeVisibleChange={this.handleNoticeVisibleChange}
            {...this.props}
          />
        ) : (
            <GlobalHeader
              onCollapse={handleMenuCollapse}
              onNoticeClear={this.handleNoticeClear}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
              {...this.props}
            />
          )}
      </Header>
    ) : null;
    return (
      <>
        <Animate component="" transitionName="fade">
          {HeaderDom}
        </Animate>
        <Modal footer={null} title="切换身份" visible={showIdentity} onCancel={switchIdentityLoading ? null : this.switchIdentityShow}>
          <Spin spinning={!!switchIdentityLoading}>
            {identityList.map(identity => {
              const cardClass = identity.selected ? `${styles.card} ${styles.checked}` : styles.card;
              return (
                <div key={identity.psmId} onClick={() => this.switchIdentity(identity)} className={cardClass}>
                  <div style={{ marginRight: '30px' }}>
                    <div className={styles.title}>{identity.postName}</div>
                    <div className={styles.subText}>{identity.orgFname}</div>
                  </div>
                  <Icon className={styles.check} type="check-circle" theme="filled" />
                </div>
              );
            })}
          </Spin>
        </Modal>
      </>
    );
  }
}

export default connect(({ loading, user, global, setting }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
  identityList: global.identityList,
  switchIdentityLoading: loading.effects['user/switchIdentity'],
  setting,
}))(HeaderView);
