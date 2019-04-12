import React, { PureComponent } from 'react';
import { connect, } from 'dva';
import { common } from '@/interface/common';
import { Modal, Button, Tag } from 'antd';
import { Model as RetryModel } from '@/models/retry';

interface Props {

}

interface State {
  loading: boolean;
}

interface Injected extends common.ConnectProps, Props, RetryModel {

}

@connect(({ retry }) => ({
  ...retry
}))
class GlobalRetry extends PureComponent<Props, State> {
  state = {
    loading: false,
  }

  get injected() {
    return this.props as Injected;
  }

  get show() {
    const errorList = this.injected.errorList;
    return Array.isArray(errorList) && errorList.length > 0;
  }

  renderFooter = () => {
    const { loading } = this.state;
    return <Button loading={loading} type="primary" onClick={this.retry}>重试</Button>;
  }

  retry = async () => {
    try {
      this.setState({ loading: true });
      const errorList = this.injected.errorList;
      await Promise.all(errorList.map(item => this.injected.dispatch({ type: item.type, payload: item.config.params })));
      this.setState({ loading: false });
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  render() {
    return (
      <Modal footer={this.renderFooter()} visible={this.show} title="以下接口请求失败：" centered closable={false}>
        {this.injected.errorList.map(item => <Tag key={item.type} color="#f50">{item.name}</Tag>)}
      </Modal>
    );
  }
}

export default GlobalRetry;
