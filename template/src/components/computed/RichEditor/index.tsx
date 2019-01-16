import React from 'react';
import BraftEditor, { EditorState } from 'braft-editor';
import { ContentUtils } from 'braft-utils';
import { Upload, Icon } from 'antd';

import 'braft-editor/dist/index.css';
// @ts-ignore
import st from './style.less';

class RichEditor extends React.Component<any> {
  public state = {
    fileList: [],
    editorState: null,
    // 用来保存记录上一次的props传入的value，更新时做对比
    value: ''
  }

  public onSave = (editorState: EditorState): void => {
    this.props.onChange(editorState.toHTML());
  }

  public onChange = (editorState: EditorState): void => {
    this.setState({ editorState });
  }

  public uplodaChange = (info): void => {
    let { editorState } = this.state;
    let fileList = [];
    if (Array.isArray(info)) {
      fileList = info;
    } else {
      fileList = info.fileList
    }

    if (fileList.length > 0) {
      fileList = fileList.slice(-1);
    }

    if (fileList[0].status === 'done') {
      editorState = ContentUtils.insertMedias(editorState, [
        {
          type: 'IMAGE',
          url: fileList[0].response.data
        }
      ])
    }

    this.setState({ 
      fileList,
      editorState
    });
  }

  static getDerivedStateFromProps(nextProps, preState) {
    if (nextProps.value !== preState.value) {
      return {
        ...preState,
        value: nextProps.value,
        editorState: BraftEditor.createEditorState(nextProps.value)
      }
    }

    return null;
  }

  render() {
    const { fileList, editorState } = this.state;

    return (
      <BraftEditor
        value={editorState}
        className={st.antd_braft_editor}
        onSave={this.onSave}
        onChange={this.onChange}
        extendControls={[
          {
            key: 'antd-uploader',
            type: 'component',
            component: (
              <Upload
                accept="image/*"
                showUploadList={false}
                action="api/promotion/util/file/uploadStatic"
                onChange={this.uplodaChange}
                fileList={fileList}
              >
                <button type="button" className="control-item button upload-button" data-title="插入图片">
                  <Icon type="upload" />
                </button>
              </Upload>
            )
          }
        ]}
      />
    );
  }
}

export default RichEditor;
