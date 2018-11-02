import React, { Component } from 'react';
import { connect } from 'dva';
import Link from 'umi/link';
import { Checkbox, Alert, Icon, message } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
import logo from '@/assets/logo.png';
import loginBg from '@/assets/login_bg.png';
import { routerRedux } from 'dva/router';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login }) => ({
  login,
}))
class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
    submitting: false,
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

  handleSubmit = async (err, values) => {
    try {
      const { dispatch } = this.props;
      const { type } = this.state;
      if (!err) {
        this.setState({
          submitting: true,
        });
        const isAuth = await dispatch({
          type: 'user/login',
          payload: {
            ...values,
            type,
          },
        });

        if (!isAuth) {
          throw new Error('登录失败');
        }

        dispatch(routerRedux.push('/'));
      }
    } catch (e) {
      this.setState({
        submitting: false,
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
    const { login } = this.props;
    const { type, autoLogin, submitting, } = this.state;
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
            <Login
              defaultActiveKey={type}
              onTabChange={this.onTabChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
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
