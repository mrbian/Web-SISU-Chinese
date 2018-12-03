import React, { Component } from 'react';
import PropTypes from 'prop-types';
import IceContainer from '@icedesign/container';
import { Input, Dropdown, Menu } from '@icedesign/base';
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/braft.css';

class SearchModal extends Component {
  static propTypes = {
    deliveryState: PropTypes.func,
    searchModeText: PropTypes.string,
    predicateValue: PropTypes.string,
    objectValue: PropTypes.string,
  };

  static defaultProps = {
    deliveryState: () => {},
    searchModeText: '请选择',
    predicateValue: '',
    objectValue: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      // editorState: '',
      searchModeText: props.searchModeText || '请选择',
      predicateValue: props.predicateValue || '',
      objectValue: props.objectValue || '',
    };
  }

  handleInputChange(value, evt) {
    const { deliveryState } = this.props;
    const state = {};
    state[evt.target.name] = value;
    this.setState(state, () => {
      deliveryState(this.state);
    });
  }

  render() {
    const trigger = (
      <span className="next-input next-input-single next-input-large">
        <input type="button" height="100%" value={this.state.searchModeText} />
      </span>
    );

    const menu = (
      <Menu onClick={(idx) => {
        if (idx === '0') {
          const { deliveryState } = this.props;
          this.setState({
            searchModeText: '谓宾过滤模式',
          }, () => {
            deliveryState(this.state);
          });
        }
      }}>
        <Menu.Item>谓宾过滤模式</Menu.Item>
      </Menu>
    );

    return <div className="search-modal-content">
      <div className="s-form-group">
        <span className="next-input-group large">
          <span className="next-input-addon next-input-addon-before">检索方式</span>
          <Dropdown trigger={trigger} offset={[12, 0]} afterOpen={() => {}}>
            {menu}
          </Dropdown>
        </span>
      </div>
      <div className="s-form-group">
        <Input name="predicateValue" size="large" addonBefore="谓语" value={this.state.predicateValue} onChange={this.handleInputChange.bind(this)} />
      </div>
      <div className="s-form-group">
        <Input name="objectValue" size="large" addonBefore="宾语" value={this.state.objectValue} onChange={this.handleInputChange.bind(this)} />
      </div>
    </div>;
  }
}

export default class CustomBraftEditor extends Component {
  static displayName = 'CustomBraftEditor';

  static propTypes = {
    onSearch: PropTypes.func,
    reset: PropTypes.func,
  };

  static defaultProps = {
    onSearch: () => {},
    reset: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      predicateValue: '',
      objectValue: '',
      searchModeText: '',
      content: [],
    };
  }

  handleRawChange = (content) => {
    this.setState({
      content: content ? content.blocks || [] : [],
    });
  };

  /**
   * 当弹出层的值有所改变时，传递给父组件
   * @param state
   */
  onModalValueChange(state) {
    this.setState(state);
  }

  onModalConfirm() {
    const { onSearch } = this.props;
    if (this.state.searchModeText === '请选择' || !this.state.content || !this.state.predicateValue || !this.state.objectValue) {
      alert('搜索设定不能为空');
      return;
    }
    onSearch(
      this.state.searchModeText,
      this.state.content,
      this.state.predicateValue,
      this.state.objectValue
    );
  }

  render() {
    // const { editorState } = this.state;
    const controls = [
      'font-size',
      'line-height',
    ];

    const extendControls = [
      'separator',
      {
        key: 'clear-and-reset',
        type: 'button',
        title: '清空并重置',
        html: null,
        text: '清空并重置',
        onClick: () => {
          this.state.content = '';
          this.props.reset();
          this.editorInstance.clear();
        },
      },
      'separator',
      'separator',
      'separator',
      {
        key: 'search-modal',
        type: 'modal',
        title: '检索设置', // 指定鼠标悬停提示文案
        className: 'search-modal', // 指定触发按钮的样式名
        html: null, // 指定在按钮中渲染的html字符串
        text: '设置检索内容', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
        onClick: () => {}, // 指定触发按钮点击后的回调函数
        modal: {
          id: 'search-modal', // 必选属性，传入一个唯一字符串即可
          title: '设置检索方式和内容', // 指定弹窗组件的顶部标题
          className: 'my-modal', // 指定弹窗组件样式名
          width: 500, // 指定弹窗组件的宽度
          height: 500, // 指定弹窗组件的高度
          showFooter: true, // 指定是否显示弹窗组件底栏
          showCancel: true, // 指定是否显示取消按钮
          showConfirm: true, // 指定是否显示确认按钮
          confirmable: true, // 指定确认按钮是否可用
          showClose: true, // 指定是否显示右上角关闭按钮
          closeOnBlur: true, // 指定是否在点击蒙层后关闭弹窗(v2.1.24)
          closeOnConfirm: true, // 指定是否在点击确认按钮后关闭弹窗(v2.1.26)
          closeOnCancel: true, // 指定是否在点击取消按钮后关闭弹窗(v2.1.26)
          cancelText: '取消', // 指定取消按钮文字
          confirmText: '确定', // 指定确认按钮文字
          stripPastedStyles: false,
          onConfirm: this.onModalConfirm.bind(this), // 指定点击确认按钮后的回调函数
          children: <SearchModal deliveryState={this.onModalValueChange.bind(this)} searchModeText={this.state.searchModeText} predicateValue={this.state.predicateValue} objectValue={this.state.objectValue} />,
        },
      },
    ];

    const editorProps = {
      height: 100,
      contentFormat: 'html',
      initialContent: '<p></p>',
      onChange: this.handleChange,
      onRawChange: this.handleRawChange,
      // value: editorState,
      controls,
      extendControls,
    };

    return (
      <IceContainer>
        <BraftEditor ref={instance => this.editorInstance = instance} {...editorProps} />
      </IceContainer>
    );
  }
}
