import React, { PureComponent } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { common } from '@/interface/common';
import { Card, } from 'antd';
import { connect } from 'dva';

interface State {
}
interface Injected extends common.ConnectProps {
}

@connect(({ loading, }) => ({
}))
class Location extends PureComponent {
  get injected () {
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


  render () {

    return (
      <PageHeaderWrapper title='库位管理'>
        <Card>
        </Card>
      </PageHeaderWrapper>
    )
  }
}

export default Location;
