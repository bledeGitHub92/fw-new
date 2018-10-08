import React, { Component } from 'react';
import { connect } from 'dva';
import { /* routerRedux, */ Link } from 'dva/router';
import { Divider, Form, Input, Button, Select, Row, Col, Popover, Progress, message } from 'antd';
import Result from '@/components/Result';
import styles from './ForgetPassword.less';

const FormItem = Form.Item;
const { Option } = Select;
const InputGroup = Input.Group;

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

const passwordProgressMap = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};

// noinspection JSUnusedGlobalSymbols
@connect(({ user, loading }) => ({
  user,
  sending: loading.effects['user/sendSms'],
  submitting: loading.effects['user/resetPassword'],
}))
@Form.create()
export default class Register extends Component {
  state = {
    count: 0,
    account: null,
    confirmDirty: false,
    visible: false,
    help: '',
    prefix: '86',
    resetSuccess: false
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGetCaptcha = () => {
    const { dispatch, form } = this.props;
    form.validateFields(['account', 'mobile'], (errors, values) => {
      if (errors) {
        return;
      }
      dispatch({
        type: 'user/sendSms',
        payload: values,
        callback: (success, data) => {
          if (success) {
            let count = 60;
            this.setState({ count });
            this.interval = setInterval(() => {
              count -= 1;
              this.setState({ count });
              if (count === 0) {
                clearInterval(this.interval);
              }
            }, 1000);
          } else {
            message.warn(data);
          }
        }
      });
    });
  };


  getPasswordStatus = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields({ force: true }, (err, values) => {
      if (!err) {
        delete values.confirm;
        this.props.dispatch({
          type: 'user/resetPassword',
          payload: values,
          callback: (success, data) => {
            if (success) {
              this.setState({ account: values.account, resetSuccess: true });
            } else {
              message.warn(data);
            }
          }
        });
      }
    });
  };

  checkConfirm = (rule, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配!');
    } else {
      callback();
    }
  };

  checkPassword = (rule, value, callback) => {
    if (!value) {
      this.setState({
        help: '请输入密码！',
        visible: !!value,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });
      if (!this.state.visible) {
        this.setState({
          visible: !!value,
        });
      }
      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;
        if (value && this.state.confirmDirty) {
          form.validateFields(['confirm'], { force: true });
        }
        callback();
      }
    }
  };

  changePrefix = (value) => {
    this.setState({
      prefix: value,
    });
  };

  renderPasswordProgress = () => {
    const { form } = this.props;
    const value = form.getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          className={styles.progress}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };

  render() {
    const { form, sending, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { count, prefix, resetSuccess, account } = this.state;
    if (resetSuccess) {
      return (
        <Result
          type="success"
          title={
            <div className={styles.title}>
              你的账户：{account}密码重置成功！
            </div>
          }
          description={
            <span>
              密码重置完成，点击&nbsp;<Link to="/user/login">登陆</Link>&nbsp;返回登陆页面，使用新密码登陆。
            </span>
          }
          style={{ marginTop: 56 }}
        />
      );
    }
    return (
      <div className={styles.main}>
        <Row className={styles.title} type="flex" justify="center">
          <h2>忘记密码</h2>
        </Row>
        <Divider />
        <Row type="flex" justify="center">
          <Col className={styles.form}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem hasFeedback>
                {getFieldDecorator('account', {
                  rules: [
                    {
                      required: true,
                      message: '请输入账号！',
                    }
                  ],
                })(<Input size="large" placeholder="请填写账号" />)}
              </FormItem>
              <FormItem hasFeedback>
                <InputGroup compact>
                  <Select
                    size="large"
                    value={prefix}
                    onChange={this.changePrefix}
                    disabled
                    style={{ width: '20%' }}
                  >
                    <Option value="86">+86</Option>
                  </Select>
                  {getFieldDecorator('mobile', {
                    rules: [
                      {
                        required: true,
                        message: '请输入手机号！',
                      },
                      {
                        pattern: /^1\d{10}$/,
                        message: '手机号格式错误！',
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      style={{ width: '80%' }}
                      placeholder="请输入11位手机号"
                    />
                  )}
                </InputGroup>
              </FormItem>
              <FormItem help={this.state.help} hasFeedback>
                <Popover
                  content={
                    <div style={{ padding: '4px 0' }}>
                      {passwordStatusMap[this.getPasswordStatus()]}
                      {this.renderPasswordProgress()}
                      <div style={{ marginTop: 10 }}>
                        请至少输入 6 个字符。请不要使用容易被猜到的密码。
                      </div>
                    </div>
                  }
                  overlayStyle={{ width: 240 }}
                  placement="right"
                  visible={this.state.visible}
                >
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        validator: this.checkPassword,
                      },
                    ],
                  })(
                    <Input
                      size="large"
                      type="password"
                      placeholder="至少6位密码，区分大小写"
                    />
                  )}
                </Popover>
              </FormItem>
              <FormItem hasFeedback>
                {getFieldDecorator('confirm', {
                  rules: [
                    {
                      required: true,
                      message: '请确认密码！',
                    },
                    {
                      validator: this.checkConfirm,
                    },
                  ],
                })(<Input size="large" type="password" placeholder="确认密码" />)}
              </FormItem>
              <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                    {getFieldDecorator('smsCode', {
                      rules: [
                        {
                          required: true,
                          message: '请输入验证码！',
                        },
                      ],
                    })(<Input size="large" placeholder="验证码" />)}
                  </Col>
                  <Col span={8}>
                    <Button
                      size="large"
                      disabled={count}
                      loading={sending}
                      className={styles.getCaptcha}
                      onClick={this.onGetCaptcha}
                    >
                      {sending ? '' : (count ? `${count} s` : '获取验证码')}
                    </Button>
                  </Col>
                </Row>
              </FormItem>
              <FormItem>
                <Button
                  size="large"
                  loading={submitting}
                  type="primary"
                  htmlType="submit"
                  className={styles.submit}
                >
                  重置密码
                </Button>
              </FormItem>
            </Form>
          </Col>
        </Row>
      </div>
    )
      ;
  }
}
