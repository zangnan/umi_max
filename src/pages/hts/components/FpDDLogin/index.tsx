import React, { useState, useImperativeHandle, useEffect, useRef } from 'react';
import { Input, Steps, Button, Form, Row, Col, Spin, message, Tabs, Image, Modal } from 'antd';
import './style.less';
import { CheckCircleOutlined, CodeOutlined, IdcardOutlined, LeftOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import {cxsddlxx, scdl, tjdxyzm, saveFpfwDzswjzh, bcsddlxx,  } from '@/pages/hts/services/htsApi';
import baseValidator from '@/components/DDAssist/field/baseValidator';




export interface FpDDLoginGridProps {
  onRef?: any;
  visible?: any;
  getdlFlag?: any;
}

const FpDDLogin: React.FC<FpDDLoginGridProps> = ({ onRef, visible, getdlFlag }) => {
  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
      getMoVis,
    };
  });
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState(false);
  const [current, setCurrent] = useState(0);
  const [userinfo, setUserinfo] = useState<any>({});
  const [crFlag,setCrFlag] = useState();

  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();
  const [formStep4] = Form.useForm();
  const [yzmNum, setYzmNum] = useState<any>(0);
  const [activeKey, setActiveKey] = useState<any>('1');

  // 计时器
  const timerRef: any = useRef(null);
  // 检查定时器是否活跃
  const isTimerActive = () => {
    return timerRef.current !== null;
  };

  // 页面布局
  const layout = {
    wrapperCol: { span: 19, offset: 5 },
  };


  const getMoVis = () => {
    return modalVisible;
  };

  useEffect(() => {
    if (modalVisible) {
      loadLoginData();
    }
  }, [modalVisible]);

  // 查询登陆信息
  const loadLoginData = async () => {
    setMasker(true);
    formStep2.setFieldsValue({captcha: ''});
    await cxsddlxx({}).then((res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code == '200') {
        formStep1.setFieldsValue(body);
        formStep4.setFieldsValue(body);
        const dlbz = body?.dlbz1;
        if (dlbz === 'Y') {
          setActiveKey('2');
        } else {
          setActiveKey('1');
        }
      } else {
        message.error(msg);
      }
    });
    setCurrent(0)
  };
  
  const showModal = (flag :any) => {
    setCrFlag(flag);
    setModalVisible(true);
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const qyxx = {
      nsrmc: userInfo?.qxQys[0]?.nsrmc,
      shxydm: userInfo?.qxQys[0]?.shxydm ? userInfo?.qxQys[0]?.shxydm : userInfo?.qxQys[0]?.nsrsbh,
    }
    setUserinfo(qyxx);
  };


  // 企业信息登陆页面发起登陆验证
  const yzStep1 = (step: any) => {
    const formStep = activeKey === '1' ? formStep1 : formStep4;
    formStep.validateFields().then(values => {
      const obj = {
        dlfs: '1',
        xfnsrsbh: values.xfnsrsbh,
        dzsjdlzh: values.dzsjdlzh,
        dzsjdlmm: values.dzsjdlmm,
        dljgnsrsbh : activeKey == '1' ? '' : values.dljgnsrsbh
      }
      setMasker(true);
      scdl(obj).then((res: any) => {
        setMasker(false);
        const {code, msg, body} = res;
        if ('200' === code) {
          // 登陆成功
          if (body?.data == 'S000'){
            setCurrent(3);
          } else {
            // 开始提交短信验证码
            setCurrent(1);
            dxYzmTjJsq();
          }
        } else {
          message.error(msg);
        }
      });
    })
  }

  // 短信验证码提交计时器
  const dxYzmTjJsq = () => {
    let time = 181;
    setYzmNum(time - 1);
    if (isTimerActive()) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(function () {
      if (time > 0) {
        time = time -1;
        setYzmNum(time);
      } else {
        setYzmNum(0);
        clearInterval(timerRef.current);
      }
    }, 1000)
  }

  // 重新获取短信验证码
  const getYzmData = () => {
    setMasker(true);
    const formStep = activeKey === '1' ? formStep1 : formStep4;
    const xfnsrsbh: any = formStep.getFieldValue('xfnsrsbh');
    const dzsjdlzh: any = formStep.getFieldValue('dzsjdlzh');
    const dzsjdlmm: any = formStep.getFieldValue('dzsjdlmm');
    const dljgnsrsbh: any = activeKey === '1' ? '' : formStep.getFieldValue('dljgnsrsbh');
    const obj = {
      dlfs: '1',
      xfnsrsbh: xfnsrsbh,
      dzsjdlzh: dzsjdlzh,
      dzsjdlmm: dzsjdlmm,
      dljgnsrsbh: dljgnsrsbh
    }
    scdl(obj).then((res: any) => {
      setMasker(false);
      const {code, msg} = res;
      if ('200' === code) {
        dxYzmTjJsq();
      } else {
        message.error(msg);
      }
    });
  }

  // 返回企业信息登陆页面
  const gobackLogin = (num: any) => {
    setCurrent(0)
    if (num === 1) {
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
    }
  }

  // 提交短信验证码
  const yzStep2 = (step: any) => {
    const formStep = activeKey === '1' ? formStep1 : formStep4;
    const dzsjdlzh: any = formStep.getFieldValue('dzsjdlzh');
    const xfnsrsbh: any = formStep.getFieldValue('xfnsrsbh');
    formStep2.validateFields().then(values => {
      setYzmNum(0);
      if (isTimerActive()) {
        clearInterval(timerRef.current);
      }
      setMasker(true);
      const obj = {
        xfnsrsbh: xfnsrsbh,
        dzsjdlzh: dzsjdlzh,
        dxyzm: values.captcha,
      }
      tjdxyzm(obj).then((res:any) => {
        setMasker(false);
        const { code, msg } = res;
        if (code === '200') {
          setCurrent(3);
        } else if (code === '0') {
          message.error('系统异常，请联系技术支持。');
        } else {
          message.error(msg);
        }
      })
    })
  }
  
  // 关闭发票账号登陆弹窗
  const closeModal = async () => {
    setModalVisible(false);
    // rpa状态登陆成功1、更新电子税务局账号2、调用发票服务
    if (current === 3) {
      const formStep = activeKey === '1' ? formStep1 : formStep4;
      const dzsjdlzh: any = formStep.getFieldValue('dzsjdlzh');
      const dzsjdlmm: any = formStep.getFieldValue('dzsjdlmm');
      const dljgnsrsbh: any = activeKey === '1' ? '' : formStep.getFieldValue('dljgnsrsbh');
      const dlbz1 = activeKey === '1' ? 'N' : 'Y';
      const obj = {
        dzsjdlzh : dzsjdlzh,
        dzsjdlmm : dzsjdlmm,
        dljgnsrsbh: dljgnsrsbh,
        dlbz1 : dlbz1
      }
      // 保存电子税务局账号
      saveFpfwDzswjzh(obj);
      // 继续调用发票服务
      getdlFlag(crFlag);
    }
  }

  async function callback(key: any) {
    setActiveKey(key);
  }


  return (
    <>
      <Modal
        title='数电登录'
        visible={modalVisible}
        wrapClassName='standard-modal-1'
        destroyOnClose
        width={1200}
        onCancel={() => closeModal()}
        maskClosable={false}
        footer={null}
      >
        
          <div className='mndlym_main2'>
          <Spin tip="Loading..." spinning={masker} delay={100}>
            <div className='yz-steps'>
              <Steps current={current} size="small">
                <Steps.Step title="企业信息登录" status={current === 0 ? 'process' : 'finish'} />
                <Steps.Step title="登录信息验证" status={current < 1 ? 'wait' : current === 1 ? 'process' : 'finish'} />
                <Steps.Step title="验证完成" status={current === 3 ? 'finish' : 'wait'} />
              </Steps>
            </div>
           
            {current === 0 ? 
              <Tabs activeKey={activeKey} onChange={callback}>
                <Tabs.TabPane tab="企业业务" key="1">
                  <div className="steps-content" style={{ marginTop: "30px" }}>
                    <Form {...layout} form={formStep1}>
                          <Form.Item className="form-item" name="xfnsrsbh">
                            <Input className="yz-input" placeholder="统一社会信用代码/纳税人识别号" disabled prefix={<IdcardOutlined className="site-form-item-icon" />} />
                          </Form.Item>
                          <Form.Item className="form-item" name="dzsjdlzh" rules={[{ required: true, message: '请输入手机号码/用户名' }]}>
                            <Input className="yz-input" placeholder="手机号码/用户名" prefix={<UserOutlined className="site-form-item-icon" />} />
                          </Form.Item>
                          <Form.Item className="form-item" name="dzsjdlmm" rules={[{ required: true, message: '请输入个人用户密码' }]}>
                            <Input.Password className="yz-input" type='password' placeholder="个人用户密码" prefix={<LockOutlined className="site-form-item-icon" />} />
                          </Form.Item>
                          <Button type='primary' onClick={() => yzStep1(1)} className="btn-style-01">验证</Button>
                    </Form>
                  </div>
                </Tabs.TabPane>
                <Tabs.TabPane tab="代理业务" key="2">
                  <div className="steps-content" style={{ marginTop: "30px" }}>
                    <Form {...layout} form={formStep4}>
                          <Form.Item className="form-item" name="xfnsrsbh">
                            <Input className="yz-input" placeholder="统一社会信用代码/纳税人识别号" disabled prefix={<IdcardOutlined className="site-form-item-icon" />} />
                          </Form.Item>
                          <Form.Item className="form-item" name="dljgnsrsbh" rules={[{ required: true, message: '请录入代理机构统一社会信用代码/纳税人识别号' }, baseValidator.english_number()]}>
                            <Input className="yz-input" placeholder="代理机构统一社会信用代码/纳税人识别号" maxLength={20} prefix={<IdcardOutlined className="site-form-item-icon" />} />
                          </Form.Item>
                          <Form.Item className="form-item" name="dzsjdlzh" rules={[{ required: true, message: '请输入手机号码/用户名' }]}>
                            <Input className="yz-input" placeholder="手机号码/用户名" prefix={<UserOutlined className="site-form-item-icon" />} />
                          </Form.Item>
                          <Form.Item className="form-item" name="dzsjdlmm" rules={[{ required: true, message: '请输入个人用户密码' }]}>
                            <Input.Password className="yz-input" type='password' placeholder="个人用户密码" prefix={<LockOutlined className="site-form-item-icon" />} />
                          </Form.Item>
                          <Button type='primary' onClick={() => yzStep1(1)} className="btn-style-01">验证</Button>
                    </Form>
                  </div>
                </Tabs.TabPane>
              </Tabs> : 
              <></>
            }
            {current === 1 ? <div className="steps-content" style={{ marginTop: "100px" }}>
              <div className="back-login" onClick={() => gobackLogin(1)}><LeftOutlined className='leftoutlined-icon' />重新登录</div>
              <Form {...layout} form={formStep2}>
                <Form.Item>
                  <Row gutter={8} style={{ width: '380px' }}>
                    <Col span={12}>
                      <Form.Item className="form-item-yzm" name="captcha" rules={[{ required: true, message: '请输入短信验证码' }]}>
                        <Input className="yz-input" placeholder="请输入短信验证码" prefix={<CodeOutlined className="site-form-item-icon" />} style={{ width: '240px' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {yzmNum === 0 ? <Button className="btn-style-02" onClick={() => getYzmData()}>重新获取</Button> : <Button className="btn-style-02" disabled>{yzmNum}秒</Button>}
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
              <Button type='primary' onClick={() => yzStep2(2)} className="btn-style-01">验证</Button>
            </div> : <></>}
            
            {current === 3 ? <div className="steps-content">
              <div className="tc-success">
                <div className="success-ts">
                  <CheckCircleOutlined className='success-ts-icon' />
                  <div className="success-title">验证成功</div>
                </div>
                <div className="success-text">
                  <span className="success-name">纳税人名称：</span>
                  <span className="success-info" style={{ marginLeft: "-20px" }}>{userinfo.nsrmc}</span>
                </div>
                <div className="success-text">
                  <span className="success-name">社会信用代码：</span>
                  <span className="success-info">{userinfo.shxydm}</span>
                </div>
                

                <Button type='primary' onClick={() => closeModal()} className="btn-style-03">关闭</Button>
              </div>
            </div> : <></>}
          </Spin>
        </div>
      </Modal>
    </>
  );
};
export default FpDDLogin;