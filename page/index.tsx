import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { common } from '@/interface/common';
import { Card, } from 'antd';
import { connect } from 'dva';

interface Injected extends common.ConnectProps {

}

interface State {

}

@connect(({ loading, }) => ({
}))
class Foo extends PureComponent {
  get injected() {
    // @ts-ignore
    return this.props as Injected;
  }

  state: State = {
  }

  /**
   * ====== 生命周期 ======
   */

  /**
   * ====== 生命周期 工具函数 ======
   */

  /**
   * ====== 工具函数 事件句柄 ======
   */

  /**
   * ====== 事件句柄 ======
   */


  render() {
    return (
      <PageHeaderWrapper title="">
        <Card>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Foo;
