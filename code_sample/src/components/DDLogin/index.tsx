import React, { Component, useState,useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Input, Steps, Button, Form, Row, Col, Spin, message, Tabs, Image, Modal } from 'antd';
import './style.less';
import LoginContentForm from './contentForm';
class Login extends Component {
  

  constructor(props: any) {
    super(props);
    this.state = {
      modalVisible: false,
      masker:false,
      centerTab:true,
      cancelCallbackFn: function () { },    // 取消回调函数   
      okCallbackFn: function () { },
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

  close() {
    const opts: any = this.state;
    this.setState({
      modalVisible: false
    });
    const { cancelCallbackFn } = opts;
    cancelCallbackFn();
  }


  getflag() {
    const opts: any = this.state;
    if (opts.modalVisible) {
      return false;
    } else {
      return true;
    }
  }


  handleOk() {
    const opts: any = this.state;
    this.setState({
      modalVisible: false,
      centerTab: true
    });
    const { okCallbackFn } = opts;
    okCallbackFn();
  }

  LoginSuss() {
    this.setState({
      centerTab: false
    });
  }

  getFooter() {
    const footerElement: any = [];
    // footerElement.push(<Button onClick={() => this.handleOk()} type="primary" key="ok" >ssa</Button>);
    return footerElement;
  }


  render() {
    const opts: any = this.state;
    const {masker} = opts;
    

    return (
      <Modal
        wrapClassName='standard-modal-1'
        title='电子税务局身份验证'
        visible={opts.modalVisible}
        width={1200}
        closable={opts.centerTab}
        destroyOnClose={true}
        maskClosable={false}
        onCancel={() => this.close()}
        footer={this.getFooter()}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <LoginContentForm handleOk = {() => this.handleOk()} LoginSuss={() => this.LoginSuss()}/>
        </Spin>
      </Modal>
    )
  }
}

const div = document.createElement('div');
document.body.appendChild(div);
const DDLogin: any = ReactDOM.render(<Login />, div);
export default DDLogin;
