import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Button, Icon } from 'antd';
import Login from '@/components/Login';
import { routerRedux } from 'dva/router';
import styles from './Login.less';
import logo from '@/assets/logo.png';
import loginBg from '@/assets/login_bg.png';

/**
 * 二维码错误状态
 *  - error: img 加载失败
 *  - overDue: 二维码失效
 */
const statusList = ['', 'error', 'overDUe'];

@connect(({ user, loading }) => ({
  user,
  fetchCodeLoading: loading.effects['user/fetchQRCode'],
}))
class LoginPage extends Component {
  state = {
  };

  timer = -1;

  /**
   * 轮询开始时间
   */
  loopstartTime = -1;

  /**
   * 二维码超时时间
   */
  overDueTimeLimit = 1000 * 60;

  get qrDesc() {
    const { user } = this.props;
    const descMap = {
      '1999': '二维码加载失败',
      '2001': '二维码已过期',
      '2003': '扫码成功',
      '2004': '已取消授权',
      '2010': '扫码异常',
    };
    return descMap[user.qrStatusCode] || '';
  }

  get showShade() {
    const { user } = this.props;
    return [1999, 2001, 2003, 2004, 2010].includes(user.qrStatusCode);
  }

  get showRefresh() {
    const { user } = this.props;
    return [1999, 2001, 2004, 2010].includes(user.qrStatusCode);
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'user/fetchQRCode', payload: 328 });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleQRCodeError = (e) => {
    this.props.dispatch({ type: 'user/setQRData', payload: { qrCode: '', qrToken: '' } });
    this.props.dispatch({ type: 'user/changeQrStatus', payload: 1999 });
  }

  handleQRCodeLoad = () => {
    this.startTimer();
    this.props.dispatch({ type: 'user/changeQrStatus', payload: 0 });
  }

  startTimer = () => {
    clearInterval(this.timer);
    this.loopstartTime = Date.now();
    this.timer = setInterval(() => {
      if (Date.now() - this.loopstartTime > this.overDueTimeLimit) {
        clearInterval(this.timer);
        this.props.dispatch({ type: 'user/changeQrStatus', payload: 2001 });
      } else {
        this.props.dispatch({ type: 'user/checkCodeScaned', payload: this.props.user.qrToken })
      }
    }, 1000);
  }

  fetchQrCode = () => {
    if (!this.props.fetchCodeLoading) {
      this.props.dispatch({ type: 'user/fetchQRCode' });
    }
  }

  render() {
    const { fetchCodeLoading, user, } = this.props;
    const { qrCode, qrStatusCode } = user;
    const style = {
      bg: {
        background: `url(${loginBg})`,
        backgroundColor: '#0d019',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 188%',
        backgroundPositionX: 'center',
        backgroundPositionY: '36%',
      }
    };
    return (
      <div>
        <div className={styles.header}>
          <div className={styles.left}>
            <div className={styles.logo}>
              <img src={logo} alt="logo" />
            </div>
            <div>
              <p style={{ fontSize: '24px', fontWeight: 'bold' }}>霏微汽车云平台服务</p>
              <p style={{ fontSize: '14px' }}>帮助车商打造互联网+新零售第一品牌</p>
            </div>
          </div>
          <div className={styles.right}>
            <a style={{ marginRight: '16px' }}>APP下载</a>|<a style={{ marginLeft: '16px' }}>关于霏微</a>
          </div>
        </div>
        <div className={styles.loginWrapper} style={style.bg}>
          <div className={styles.main}>
            <div>
              <div style={{ width: '200px', height: '200px', border: '1px solid #eee', marginBottom: '20px', position: 'relative', top: 0, left: 0 }}>
                {this.showShade && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', }}>
                    <div style={{ color: '#333', fontSize: 14 }}>{
                      qrStatusCode === 2003 ? (
                        <>
                          <span>{this.qrDesc}</span>
                          <Icon type="check-circle" theme="filled" style={{ color: '#1890ff', marginLeft: '6px' }} />
                        </>
                      ) : (
                          this.qrDesc
                        )}
                    </div>
                    {this.showRefresh && (
                      <Button
                        size="small"
                        type="primary"
                        style={{ marginTop: '15px' }}
                        loading={fetchCodeLoading}
                        onClick={this.fetchQrCode}
                      >
                        点击刷新
                      </Button>
                    )}
                  </div>
                )}
                {typeof qrCode === 'string' && qrCode !== '' && (
                  <img
                    src={qrCode}
                    onError={this.handleQRCodeError}
                    onLoad={this.handleQRCodeLoad}
                    style={{ width: '100%', objectFit: 'contain' }}
                    alt=""
                  />
                )}
              </div>
              <div style={{ color: '#333', fontSize: 14 }}>打开霏微汽车云APP扫描二维码</div>
            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default LoginPage;
