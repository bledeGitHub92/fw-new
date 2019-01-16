import React from 'react';
import { Modal, Form, Input, message, Button, Table, Divider } from 'antd';
import _ from 'lodash';
import { common } from '@/interface/common';
import * as api from './api';
import { includes, deRepetition, deimg } from './utils';

// @ts-ignore
import st from './style.less';

const Item = Form.Item;
const Column = Table.Column;

interface MallProps {
  onChange: (value: goods.Goods[]) => any,
  value: any[],
  visible: boolean,
  onCancel: () => any,
  multiple?: boolean
}

interface MallState {
  list: goods.Goods[],
  selected: goods.Goods[],
  pagination: common.Pagination,
  goodsName: string,
  skuId: string,
  loading: boolean
}

class Mall extends React.Component<MallProps, MallState> {
  constructor(props) {
    super(props);
    this.getGoodsList = _.debounce(this.getGoodsList, 600);
  }

  public state = {
    list: [],
    selected: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
      lastPage: false
    },
    goodsName: '',
    skuId: '',
    loading: false
  }

  componentDidMount() {
    this.getGoodsList();
  }

  public onOk = (): void => {
    this.props.onCancel && this.props.onCancel();
  }

  public goodsNameChange = (event): void => {
    const { skuId } = this.state;
    const goodsName = event.target.value;
    this.setState({
      goodsName
    });

    this.getGoodsList({ keyWord: goodsName, materielCode: skuId });
  }

  public skuIdChange = (event): void => {
    const { goodsName } = this.state;
    const skuId = event.target.value;
    this.setState({
      skuId
    })

    this.getGoodsList({ keyWord: goodsName, materielCode: skuId });
  }

  public tabChange = (pagination: common.Pagination): void => {
    const { goodsName, skuId } = this.state;
    
    const param: goods.Param = { ...pagination, keyWord: goodsName, materielCode: skuId };
    this.getGoodsList(param);
  }

  public getGoodsList = (param: goods.Param = {}): void => {
    const { pagination } = this.state;
    
    this.setState({ loading: true });

    api.goodsApi(param).then(res => {
      this.setState({
        list: res.data.data,
        pagination: {
          ...pagination,
          current: res.data.current,
          pageSize: res.data.pageSize,
          lastPage: res.data.lastPage,
          total: res.data.total
        },
        loading: false
      });
    })
    .catch(e => {
      message.error(e.message);
      this.setState({
        loading: false
      });
    })
  }

  public reset = (): void => {
    this.setState({ goodsName: '', skuId: '' }, () => {
      this.getGoodsList();
    });
  }

  render() {
    const { visible, onCancel, onChange, value, multiple = true } = this.props;
    const { goodsName, skuId, list, loading, pagination } = this.state;

    return (
      <Modal 
        title="商品选择" 
        visible={visible} 
        onCancel={onCancel}
        onOk={this.onOk}
        style={{ minWidth: 850 }}
      >
        <Form layout="inline">
          <Item label="商品名称">
            <Input placeholder="输入商品名称自动搜索" onChange={this.goodsNameChange} value={goodsName} />
          </Item>
          <Item label="物料代码">
            <Input placeholder="输入商品skuId自动搜索" onChange={this.skuIdChange} value={skuId} />
          </Item>
          <Item><Button type="primary" onClick={this.reset}>重置</Button></Item>
        </Form>

        <Table
          dataSource={list}
          style={{ marginTop: 20 }}
          rowKey={record => record.skuId}
          loading={loading}
          pagination={pagination}
          onChange={this.tabChange}
          scroll={{ y: 600 }}
          rowSelection={{
            type: multiple ? 'checkbox' : 'radio',
            onChange: (rowKeys: number[], selectedRows) => {
              const { selected } = this.state;
              const _new = deRepetition(selected.concat(selectedRows), 'skuId')
                .filter((item: goods.Goods) => rowKeys.includes(item.skuId))
                .map(item => ({
                  ...item,
                  number: item.number || 1
                }));
              this.setState({
                selected: _new
              });
              onChange && onChange(_new);
            },
            getCheckboxProps: (record) => ({
              checked: includes(value, record, 'skuId')
            })
          }}
        >
          <Column width={200} title="名称" dataIndex="goodsName" />
          <Column 
            title="缩略图" 
            width={140}
            dataIndex="goodsImg" 
            render={(text) => (
              <div className={st.divimg} style={{ backgroundImage: `url(${text || deimg})` }} />
            )}
          />
          <Column title="价格" width={140} dataIndex="price" />
          <Column title="物料代码" width={140} dataIndex="materielCode" />
        </Table>
      </Modal>
    );
  }
}

export default Mall;
