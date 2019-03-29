import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Button } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import logo from '@/assets/logo.png';
import loginBg from '@/assets/login_bg.png';
import { routerRedux } from 'dva/router';

/**
 * 二维码错误状态
 *  - error: img 加载失败
 *  - overDue: 二维码失效
 */
const statusList = ['', 'error', 'overDUe']

@connect(({ user, loading }) => ({
  user,
  fetchCodeLoading: loading.effects['user/fetchQRCode'],
}))
class LoginPage extends Component {
  state = {
    qrCodeStatus: '',
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

  componentDidMount() {
    this.props.dispatch({ type: 'user/fetchQRCode', payload: 328 });
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  handleQRCodeError = (e) => {
    this.setState({ qrCodeStatus: 'error' })
    this.props.dispatch({ type: 'user/setQRData', payload: { qrCode: '', qrToken: '' } });
    this.props.dispatch({ type: 'user/changeReload', payload: true });
  }

  handleQRCodeLoad = () => {
    this.startTimer();
    this.setState({ qrCodeStatus: '' })
    this.props.dispatch({ type: 'user/changeReload', payload: false });
  }

  startTimer = () => {
    clearInterval(this.timer);
    this.loopstartTime = Date.now();
    this.timer = setInterval(() => {
      if (Date.now() - this.loopstartTime > this.overDueTimeLimit) {
        clearInterval(this.timer);
        this.setState({ qrCodeStatus: 'overDue' });
        this.props.dispatch({ type: 'user/changeReload', payload: true });
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
    const { qrCode, showReload } = this.props.user;
    const { qrCodeStatus } = this.state;
    const qrDesc = qrCodeStatus === 'error' ? '二维码加载失败' : '二维码已失效';
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
                {showReload && (
                  <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(255, 255, 255, 0.9)', justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column', }}>
                    <div style={{ color: '#333', fontSize: 14, marginBottom: 15 }}>{qrDesc}</div>
                    <Button
                      loading={this.props.fetchCodeLoading}
                      onClick={this.fetchQrCode}
                      style={{ color: '#fff', fontSize: 16, backgroundColor: '#4189FD', height: '32px', lineHeight: '32px', textAlign: 'center', borderRadius: 4 }}>
                      点击刷新
                    </Button>
                  </div>
                )}
                {typeof qrCode === 'string' && qrCode !== '' && (
                  <img
                    src={qrCode}
                    onError={this.handleQRCodeError}
                    onLoad={this.handleQRCodeLoad}
                    style={{ width: '100%', objectFit: 'contain' }}
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
