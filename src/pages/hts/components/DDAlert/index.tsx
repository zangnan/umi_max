import { Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Button, Spin, Table } from 'antd';
import { InfoCircleOutlined, CloseCircleOutlined, CheckCircleFilled, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import './style.less';
import AlertContentForm from './contentForm';
import React from 'react';

class Alert extends Component {
  refAlertContentForm: any = React.createRef();

  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,                // 是否显示提示框
      title: '提示',                      // 标题
      okText: '确定',                     // 标题
      cancelText: '取消',
      isShowcancelText:true,              // 取消按钮是否显示
      modalType: 'info',                  // info confirm form
      infoType: 'success',                // info error success warning question
      info: '',                           // 提示概要
      content: '',                        // 提示描述
      okCallbackFn: function () { },        // 确认 回调函数
      cancelCallbackFn: function () { },    // 取消 回调函数
      button: [],                         // 自定义按钮
      closeStatus: true,                  // 回调后弹窗是否关闭，默认关闭
      isFormContent: false,               // content是否为form
      initFormContentValues: {},         // content为form时初始化值
      width: '',
      customerBtnLoading: false,
      masker: false,
      isTableContent: false,            // content是否为table
      tableData: [],                    // content为table时 Data
      tableColumns: [] ,             // content为table时 columns
      closable:true,  // 是否存在右上角的关闭按钮，默认为true（存在）
      keyboard: true, // 是否支持键盘 esc 关闭
    }
  }

  // open
  open(options: any) {
    const opts: any = this.state;
    const myOptions: any = Object.assign({}, opts, options);
    myOptions.modalVisible = true;
    this.setState({
      ...myOptions
    })
  }

  // close
  close() {
    const opts: any = this.state;
    const { isFormContent } = opts;
    if (isFormContent) {
      this.getForms().resetFields();
    }
    this.setState({
      modalVisible: false,                // 是否显示提示框
      title: '提示',                      // 标题
      okText: '确定',                     // 标题
      cancelText: '取消',                 // 标题
      modalType: 'info',                  // info confirm form
      infoType: 'success',                // info error success warning question
      info: '',                           // 提示概要
      content: '',                        // 提示描述
      button: [],                         // 自定义按钮
      okCallbackFn: function () { },
      cancelCallbackFn: function () { },
      closeStatus: true,
      isFormContent: false,
      initFormContentValues: {},
      width: '',
      customerBtnLoading: false,
      masker: false,
      isTableContent: false,
      tableData: [],
      isShowcancelText:true,
      tableColumns: [],
    });
  }

  // ok
  handleOk() {
    const opts: any = this.state;
    const thisObj = this;
    const { okCallbackFn, closeStatus } = opts;
    okCallbackFn(thisObj);
    if (closeStatus) {
      this.close();
    }
  };

  // cancel
  handleCancel() {
    const opts: any = this.state;
    const { cancelCallbackFn } = opts;
    cancelCallbackFn();
    this.close();
  };

  // icon
  getIcon() {
    const opts: any = this.state;
    const { infoType } = opts;
    let icon: any;
    if (infoType === 'info') {
      icon = <InfoCircleOutlined />;
    } else if (infoType === 'error') {
      icon = <CloseCircleOutlined />;
    } else if (infoType === 'success') {
      icon = <CheckCircleFilled />;
    } else if (infoType === 'warning') {
      icon = <ExclamationCircleOutlined />;
    } else if (infoType === 'question') {
      icon = <QuestionCircleOutlined />;
    }
    return icon;
  }

  // header
  getHeader() {
    const opts: any = this.state;
    const { modalType } = opts;
    if (modalType === 'form') {
      return <></>;
    }
    const header = <>
      <div className="icon">{this.getIcon()}</div>
      <div className="info">{this.getInfo()}</div>
    </>;
    return header;
  }

  // info
  getInfo() {
    const opts: any = this.state;
    const { info } = opts;
    if (Array.isArray(info)) {
      const cc: any = [];
      info?.forEach((item: any, index: any) => {
        cc.push(<p className="item" key={index}>{item}</p>);
      });
      return cc;
    } else {
      return info;
    }
  }
  // content
  getContent() {
    const opts: any = this.state;
    const { content } = opts;
    if (Array.isArray(content)) {
      const cc: any = [];
      content?.forEach((item: any, index: any) => {
        cc.push(<p className="item" key={index}>{item}</p>);
      });
      return cc;
    } else {
      return content;
    }
  }

  // footer
  getFooter() {
    const opts: any = this.state;
    const { okText, cancelText, modalType, button,customerBtnLoading,isShowcancelText } = opts;
    const footerElement: any = [];
    if ((modalType === 'confirm' || modalType === 'form')  && isShowcancelText) {
      footerElement.push(<Button onClick={() => this.handleCancel()} key="cancel" loading={customerBtnLoading}>{cancelText}</Button>);
    }
    if (button && button.length > 0) {
      button.forEach((item: any) => {
        if (item.$$typeof) {
          footerElement.push(item);
        } else {
          // js object
          footerElement.push(<Button loading={customerBtnLoading} onClick={() => {
            if (item.func) {
              const thisObj = this;
              item.func(thisObj);
            }
          }} type={item?.type} key={item?.key}>{item?.name}</Button>);
        }
      });
    }
    footerElement.push(<Button onClick={() => this.handleOk()} type="primary" key="ok" loading={customerBtnLoading}>{okText}</Button>);
    return footerElement;
  }

  getContentFormData() {
    return this.refAlertContentForm.current!.getFormData();
  }
  getValidateFormData() {
    return  this.refAlertContentForm.current!.validateFields();
  }
  getForms() {
    return  this.refAlertContentForm.current!.forms();
  }
  render() {
    const opts: any = this.state;
    const { isFormContent, initFormContentValues, width, masker, isTableContent, tableData, tableColumns,closable } = opts;
    return (
      <Modal
        title={opts.title}
        open={opts.modalVisible}
        width={width == '' ? CONSTANTS.C_MODAL_WIDTH_X1 : width}
        wrapClassName={`${isTableContent? 'standard-modal-1': '' }`} 
        footer={this.getFooter()}
        closable = {closable}
        destroyOnHidden={true}
        onCancel={() => this.close()}
        className={`${isTableContent? '': 'dd_modal_wrap' } ${masker ? 'dd_modal_show_masker' : ''}`}
        // mask={{ closable: false }}
        mask={{ closable: false }}
        keyboard={opts.keyboard}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
        {
          isFormContent ? <>
            <AlertContentForm formItems={this.getContent()} onRef={this.refAlertContentForm} initValue={initFormContentValues} />
          </> : isTableContent? <>
            <Table
              dataSource={tableData}
              columns={tableColumns}
              pagination={false}
              size={'small'}
              bordered={true}
            />
          </>: <>
            <div className={`dd_modal_content ${opts.infoType} ${opts.modalType}`}>
              <div className="header">{this.getHeader()}</div>
              <div className="body">{this.getContent()}</div>
            </div>
          </>
        }
        </Spin>
      </Modal>
    )
  }
}

const div = document.createElement('div');
document.body.appendChild(div);
// 保留 ReactDOM.render（同步返回实例）以保证导出时 DDAlert 已挂载 open/close/getForms 等方法
// createRoot.render 的 ref 回调是异步 commit，会导致首次点击 DDAlert.open 报 undefined
const DDAlert: any = ReactDOM.render(<Alert />, div);
export default DDAlert;
