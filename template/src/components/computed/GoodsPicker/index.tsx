import React from 'react';
import { Card, Table, Button, Popconfirm, Divider } from 'antd';
import EditableCell, { EditableFormRow, EditableContext } from './EditableCell';
import Mall from './Mall';
import { deimg } from './utils';

// @ts-ignore
import st from './style.less';

export interface GoodsPickerProps {
  value: Array<goods.Goods>,
  onChange: (value: Array<goods.Goods>) => any,
  multiple?: boolean
}

export interface GoodsPickerState {
  visible: boolean,
  selected: Array<goods.Goods>,
  editingKey: number
}

const Column = Table.Column;

class GoodsPicker extends React.Component<GoodsPickerProps, GoodsPickerState> {
  static getDerivedStateFromProps(nextProps, preState) {
    return {
      ...preState,
      selected: nextProps.value
    };
  }
  
  public state = {
    visible: false,
    selected: [],
    editingKey: null
  }

  public onMallChange = (value: goods.Goods[]): void => {
    const { onChange } = this.props;
    this.setState({
      selected: value
    });
    onChange && onChange(value);
  }

  public onMallCancel = (): void => {
    this.setState({ visible: false });
  }

  public isEditing = (record: goods.Goods) => record.skuId === this.state.editingKey;

  public cancel = (): void => {
    this.setState({ editingKey: null })
  }

  public edit = (id: number) => {
    this.setState({ editingKey: id })
  }

  public save = (form, id: number): void => {
    const { onChange } = this.props;
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      const newData = [...this.state.selected];
      const index = newData.findIndex(item => id === item.skuId);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ selected: newData, editingKey: null });
        onChange && onChange(newData);
      } else {
        newData.push(row);
        this.setState({ selected: newData, editingKey: null });
        onChange && onChange(newData);
      }
    });
  }

  public remove = (skuId: number): void => {
    const { onChange } = this.props;
    const { selected } = this.state;

    const index = selected.findIndex(item => skuId === item.skuId);
    selected.splice(index, 1);
    
    this.setState({ selected });
    onChange && onChange(selected);
  }

  render() {
    const { visible, selected } = this.state;
    const { multiple = true } = this.props;

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };

    return (
      <>
        <Card title="选择商品" extra={<Button type="primary" onClick={() => this.setState({ visible: true })}>新增商品</Button>}>
          <Table
            rowKey="skuId"
            dataSource={selected}
            bordered
            pagination={false}
            components={components}
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
            <Column title="价格" dataIndex="price" />
            <Column title="物料代码" dataIndex="materielCode" />
            <Column 
              title="数量" 
              dataIndex="number"
              onCell={(record: goods.Goods) => ({
                record,
                inputType: 'number',
                dataIndex: 'number',
                title: '数量',
                editing: this.isEditing(record),
              })}
            />
            <Column 
              title="操作" 
              render={(text, record: goods.Goods) => {
                const editable = this.isEditing(record);
                return (
                  <div>
                    {editable ? (
                      <span>
                        <EditableContext.Consumer>
                          {form => (
                            <a href="javascript:;" onClick={() => this.save(form, record.skuId)} style={{ marginRight: 8 }}>保存</a>
                          )}
                        </EditableContext.Consumer>
                        <Popconfirm
                          title="确定要取消吗?"
                          onConfirm={() => this.cancel()}
                        >
                          <a>取消</a>
                        </Popconfirm>
                      </span>
                    ) : (
                      <>
                        <a onClick={() => this.edit(record.skuId)}>编辑</a>
                        <Divider type="vertical" />
                        <a onClick={() => this.remove(record.skuId)}>删除</a>
                      </>
                    )}
                  </div>
                );
              }}
            />
          </Table>
        </Card>
        <Mall visible={visible} onChange={this.onMallChange} value={selected} onCancel={this.onMallCancel} multiple={multiple} />
      </>
    );
  }
}

export default GoodsPicker;