import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, message } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import logo from '@/assets/logo.png';
import loginBg from '@/assets/login_bg.png';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['user/login'],
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
  };

  onTabChange = type => {
    this.setState({ type });
  };

  onGetCaptcha = () =>
    new Promise((resolve, reject) => {
      this.loginForm.validateFields(['mobile'], {}, (err, values) => {
        if (err) {
          reject(err);
        } else {
          const { dispatch } = this.props;
          dispatch({
            type: 'login/getCaptcha',
            payload: values.mobile,
          })
            .then(resolve)
            .catch(reject);
        }
      });
    });

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      this.props.dispatch({
        type: 'user/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render () {
    const user = {};
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
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
          { /* <img className={styles.backImg} src={loginBg} alt="img" /> */}
          <div className={styles.main}>
            <Login
              defaultActiveKey={type}
              onTabChange={this.onTabChange}
              onSubmit={this.handleSubmit}
            >
              <Tab key="account" tab="账户密码登录">
                {
                  user.status === 'error' &&
                  user.type === 'account' &&
                  !user.submitting &&
                  this.renderMessage('账户或密码错误（admin/888888）')
                }
                <UserName name="account" placeholder="请输入您的账号" />
                <Password name="password" placeholder="请输入您的密码" />
              </Tab>
              {/* <Tab key="mobile" tab="手机号登录">
                {
                  user.status === 'error' &&
                  user.type === 'mobile' &&
                  !user.submitting &&
                  this.renderMessage('验证码错误')
                }
                <Mobile name="mobile" />
                <Captcha name="captcha" />
              </Tab> */}
              <div>
                <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
                <Link style={{ float: 'right' }} to="/user/forget-password">忘记密码？</Link>
              </div>
              <Submit loading={submitting}>登录</Submit>
            </Login>
          </div>
        </div>

      </div>
    );
  }
}

export default LoginPage;
