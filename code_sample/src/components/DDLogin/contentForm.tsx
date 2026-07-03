import React, { useEffect, useState } from 'react';
import { Input, Steps, Button, Form, Row, Col, Spin, message, Tabs, Image, Modal, Radio, Space } from 'antd';
import './style.less';
import { CheckCircleOutlined, CodeOutlined, IdcardOutlined, LeftOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import { useRequest } from '@umijs/hooks';
import { queryDjdlzh, saveDjdlzh, simulationLoginBymm, simulationLoginBysm, simulationLoginPhoneNum, simulationLoginPhoneNumGet, simulationLoginSelectRole, simulationLoginProcessQuery, hqJ4RpaToken, simulationLoginByAgency } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import DDAlert from '../DDAlert';
import baseValidator from '@/pages/common/field/baseValidator';

export type DDAlertContentFormProps = {
  handleOk?: any,
  LoginSuss?: any,
  onRef?: any,
  initValue?: any,
}
let btnDjsTimer: any = null;
let hqyzmdjs = 181;

const AlertContentForm: React.FC<DDAlertContentFormProps> = ({
  handleOk,
  LoginSuss,
  onRef,
  initValue,
}) => {


  const [masker, setMasker] = useState(false);
  const [current, setCurrent] = useState(0);
  const [yzmNum, setYzmNum] = useState<any>(181);
  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();
  const [userinfo, setUserinfo] = useState<any>({});
  const [zrrArr, setZrrArr] = useState<any>('');
  const [step1Form, setStep1Form] = useState<any>();
  const [nsrsbh, setNsrsbh] = useState<any>();
  const [nsrmc, setNsrmc] = useState<any>();
  const [uuid, setUuid] = useState<any>();
  const [zzrlxmc, setZzrlxmc] = useState<any>('');
  const [imgLink, setImgLink] = useState<any>();
  const [accessToken, setAccessToken] = useState<any>('');
  // const [btnLoading, setBtnLoading] = useState(false);
  const [defKey, setDefKey] = useState<any>(1);

  // 表单布局
  const layout = {
    wrapperCol: { span: 19, offset: 5 },
  };

  useEffect(() => {
    try {
      load();
    } catch (e) {

    }
  }, []);


  const load = async () => {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const tmpNsrsbh = userInfo?.qxQys[0]?.shxydm ? userInfo?.qxQys[0]?.shxydm : userInfo?.qxQys[0]?.nsrsbh;
    setNsrsbh(tmpNsrsbh);
    setCurrent(0);
    await queryDjdlzh({}).then((res: any) => {
      if (res?.code == '200') {
        formStep1.setFieldsValue({
          shxydm: tmpNsrsbh,
          dzsjUserName: res?.body?.yhm,
          dzsjPwd: res?.body?.mm
        });
        formStep4.setFieldsValue({
          shxydm: tmpNsrsbh,
          dzsjUserName: res?.body?.yhm,
          dzsjPwd: res?.body?.mm,
          dljgnsrsbh: res?.body?.dljgnsrsbh
        });
        const dllxbz = res?.body?.dllxbz;
        // 企业业务-扫码登陆
        if (dllxbz === '2') {
          setActiveKey('1');
          setLoginType('2');
          loginDlewm();
        } else if (dllxbz === '3') {
          // 代理业务-账号登陆
          setActiveKey('2');
          setLoginType('1');
        } else {
          // 企业业务-账号登陆
          setActiveKey('1');
          setLoginType('1');
        }
      } else {
        formStep1.setFieldsValue({
          shxydm: tmpNsrsbh,
        });
        formStep4.setFieldsValue({
          shxydm: tmpNsrsbh,
        });
        setActiveKey('1');
        setLoginType('1');
      }
    });
  }

  // 关闭
  const closeModal = async () => {
    // 默认企业业务-扫码登陆
    let param = { yhm: "", mm: "", dljgnsrsbh : "", dllxbz: "2"};
    // 企业业务-账号登陆
    if (activeKey === '1' && loginType === '1') {
      param = {
        yhm: formStep1.getFieldValue('dzsjUserName'),
        mm: formStep1.getFieldValue('dzsjPwd'),
        dljgnsrsbh: '',
        dllxbz: '1'
      }
    }
    // 代理业务
    if (activeKey === '2') {
      param = {
        yhm: formStep4.getFieldValue('dzsjUserName'),
        mm: formStep4.getFieldValue('dzsjPwd'),
        dljgnsrsbh: formStep4.getFieldValue('dljgnsrsbh'),
        dllxbz: '3'
      }
    }
    try {
      await saveDjdlzh(param).then((res: any) => {
        handleOk();
      })
    } catch (e) {

    }
  }

  // 企业业务-二维码登陆，获取轮询结果
  const getDjmndlData = (param: any) => {
    simulationLoginProcessQuery(param, accessToken).then((res: any) => {
      setMasker(true)
      const { code, body, desc, msg } = res;
      if (code === '200') {
        const state = body.state;
        if (state !== '1' && state !== '5') {
          setMasker(false)
          cancel()
        }
        if (state === '2' || state === '4') {
          // 如果跳转到 步骤2 短信验证码
          setCurrent(1);
          setYzmNum(181)
          // hqyzmBtnDjs();
          formStep2.setFieldsValue({ captcha: '', mobile: body.extras.mobile })
        } else if (state === '3') {
          // 选择 责任人
          setCurrent(2);
          const zzrlx = body.extras.idCardList;
          setZrrArr(zzrlx);
        } else if (state === '5') {
          setMasker(false)
          setImgLink(body.extras.ewm);
        } else if (state === '8') {
          setCurrent(3);
          LoginSuss();
          formStep2.setFieldsValue({ captcha: '', mobile: body.extras.mobile })
          try {
            const userInfo = myUtil.sessionStore.getItem('userInfo');
            const tmpNsrmc = userInfo?.qxQys[0]?.nsrmc;
            setNsrmc(tmpNsrmc)
          } catch (e) {
          }
        } else if (state === '9') {
          cancel();
          // message.error(body.desc);
          DDAlert.open({
            title: '系统提示',
            info: body.desc,
            infoType: 'error',
            modalType: 'confirm',
            closable:false,
            okText: '重新登录',
            isShowcancelText:false, 
            okCallbackFn: function (thisObj: any) {
              load();
            },
          });
        }
      } else if (code === '0') {
        setMasker(false)
        cancel()
        message.error('系统异常，请联系技术支持。');
      } else {
        setMasker(false)
        cancel()
        message.error(desc);
      }
    })
  }

  // 轮询
  const { run, cancel } = useRequest(getDjmndlData, {
    pollingInterval: 5000,
    manual: true
  });

  // 企业业务-账号登陆
  const yzStep1 = (step: any) => {
    formStep1.validateFields().then(async values => {
      const obj = {
        czlx: '1',
        nsrsbh: values.shxydm,
        yhm: values.dzsjUserName,
        mm: values.dzsjPwd,
      }
      setStep1Form(obj)
      let Token = '';

      await hqJ4RpaToken(obj).then((res: any) => {
        const { code, body, msg } = res;
        if (code == '200') {
          Token = body.token;
        } else {
          message.error(msg);
          return;
        }
      });

      setAccessToken(Token)
      setMasker(true)
      simulationLoginBymm({ mm: values.dzsjPwd }, Token).then((res: any) => {
        const { code, msg, body } = res;
        if (code === '200') {
          setUuid(body.uuid)
          run(body);
        } else {
          setMasker(false)
          message.error(msg)
        }
      })
    })
  }

  const yzStep2 = (step: any) => {
    const sjh: any = formStep1.getFieldValue('dzsjUserName')
    formStep2.validateFields().then(values => {
      clearInterval(btnDjsTimer);
      btnDjsTimer = null;
      setYzmNum(0);
      setMasker(true)
      simulationLoginPhoneNum({ uuid, phoneVerifyNum: values.captcha }, accessToken).then((res: any) => {
        const { code, msg, body } = res;
        if (code === '200') {
          // hqyzmBtnDjs();
          run({ uuid });
        } else {
          setMasker(false)
          message.error(msg)
        }
      })

    })
  }

  const yzStep3 = (item: any, mc: AnimationPlayState) => {
    setMasker(true)
    simulationLoginSelectRole({ uuid: uuid, zrrlx: item.zrrlx }, accessToken).then((res: any) => {
      const { code, msg, body } = res;
      if (code === '200') {
        setZzrlxmc(mc)
        run({ uuid });
      } else {
        setMasker(false)
        message.error(msg)
      }
    })
  }

  const yzStep4 = (step : any) => {
    formStep4.validateFields().then(async values => {
      const tokenObj = {
        czlx: '1',
        nsrsbh: values.shxydm,
        yhm: values.dzsjUserName,
        mm: values.dzsjPwd,
      }
      const obj = {
        dlqybs: values.dljgnsrsbh,
        yhm: values.dzsjUserName,
        mm: values.dzsjPwd,
        force : '340'
      }
      setStep1Form(obj)
      let Token = '';
      await hqJ4RpaToken(tokenObj).then((res: any) => {
        const { code, body, msg } = res;
        if (code == '200') {
          Token = body.token;
        } else {
          message.error(msg);
          return;
        }
      });
      setAccessToken(Token);
      setMasker(true)
      simulationLoginByAgency({ dlqybs: values.dljgnsrsbh, yhm:values.dzsjUserName, mm: values.dzsjPwd, force : '340' }, Token).then((res: any) => {
        const { code, msg, body } = res;
        if (code === '200') {
          setUuid(body.uuid)
          run(body);
        } else {
          setMasker(false)
          message.error(msg)
        }
      })
    });

  }

  // 获得验证码
  const getYzmData = () => {
    const formStep = activeKey === '1' ? formStep1 : formStep4;
    formStep.validateFields().then(values => {
      setMasker(true)
      simulationLoginPhoneNumGet({ uuid: uuid }, accessToken).then((res: any) => {
        const { code, msg, body } = res;
        setMasker(false)
        if (code === '200') {
          hqyzmBtnDjs();
        } else {
          message.error(msg)
        }
      })
    })
  }

  const hqyzmBtnDjs = () => {
    var time = hqyzmdjs - 1; // 倒计时时间
    setYzmNum(hqyzmdjs - 1);
    btnDjsTimer = setInterval(function () {
      if (time > 0) {
        time = time - 1;
        setYzmNum(time);
      } else {
        // 按钮去除置灰
        setYzmNum(0);
        clearInterval(btnDjsTimer);
        btnDjsTimer = null;
      }
    }, 1000);
  }

  // 选择身份
  const getStep3Html = (arr: any) => {
    const sfArr: any = arr ? arr : [];
    const html: any = [];
    if (sfArr.length > 0) {
      sfArr.forEach((item: any) => {
        html.push(<div className="sf-content-box" onClick={() => yzStep3(item, item.zrrlxmc)}>
          <div className="sf-card-style">
            <img className="sf-img" src={getImgSrc() + '/img_fddb.svg'} />
            <div className="sf-text">{item.zrrlxmc}</div>
          </div></div>);
      })
    }
    return html;
  }

  // 获取图片路径
  const getImgSrc = () => {
    let src = "";
    if (PRO_BASE && PRO_BASE != '') {
      src = `/${PRO_BASE}/img`;
      return src;
    } else {
      src = `/img`;
      return src;
    }
  }

  const gobackLogin = (num: any) => {
    setCurrent(0)
    if (num === 1) {
      clearInterval(btnDjsTimer);
      btnDjsTimer = null;
      setYzmNum(0);
    }
    // 企业务验-二维码
    if (activeKey === '1' && loginType === '2') {
      loginDlewm();
    }
  }

  // 企业业务与代理业务切换
  async function callback(key: any) {
    setActiveKey(key);
    // 切换到代理业务
    if (key === '2') {
      // 如果切换前为扫码登陆，取消定时轮询
      if (loginType === '2') {
        cancel();
      }
    }
    // 切换到企业业务
    if (key === '1') {
      // 如果当前为扫描登陆，启动定时轮询
      if (loginType === '2') {
        loginDlewm();
      }
    }
  }

  
  const [activeKey, setActiveKey] = useState<any>('1'); // 1：企业业务；2:代理业务
  const [formStep4] = Form.useForm();
  const [loginType, setLoginType] = useState('1'); // '1': 企业信息登录, '2': 扫码登录
  const handleLoginTypeChange = (e: any) => {
    setLoginType(e.target.value);
    if (e.target.value === '2') {
      loginDlewm();
    } else {
      cancel();
    }
  };

  // 获取登陆二维码并启动轮询
  async function loginDlewm() {
    let Token = '';
    try {
      await hqJ4RpaToken({}).then((res: any) => {
        const { code, body, msg } = res;
        if (code == '200') {
          Token = body.token;
        } else {
          message.error(msg);
        }
      });
    } catch (e) {

    }
    setAccessToken(Token)
    setMasker(true)
    simulationLoginBysm({}, Token).then((res: any) => {
      const { code, msg, body } = res;
      if (code === '200') {
        // hqyzmBtnDjs();
        setUuid(body.uuid)
        run(body);
      } else {
        setMasker(false)
        message.error(msg)
      }
    })
  }

  return (
    <>
      <div className='mndlym_main2'>
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className='yz-steps'>
            <Steps current={current} size="small">
              <Steps.Step title="企业信息登录" status={current === 0 ? 'process' : 'finish'} />
              <Steps.Step title="登录信息验证" status={current < 1 ? 'wait' : current === 1 ? 'process' : 'finish'} />
              <Steps.Step title="选择登录身份" status={current < 2 ? 'wait' : current === 2 ? 'process' : 'finish'} />
              <Steps.Step title="验证完成" status={current === 3 ? 'finish' : 'wait'} />
            </Steps>
          </div>
          {current === 0 ? <Tabs activeKey={activeKey} onChange={callback}>
            <Tabs.TabPane tab="企业业务" key="1">
              <div style={{ textAlign: 'center', marginBottom: 24 }}>
                <Radio.Group 
                  value={loginType} 
                  onChange={handleLoginTypeChange} 
                  style={{ display: 'inline-block', marginTop: 20, marginBottom: 20 }}
                  >
                  <Space  size={24}>
                    <Radio value="1">账密登录</Radio>
                    <Radio value="2">扫码登录</Radio>
                  </Space>
                </Radio.Group>
                {loginType === '1' && (
                  <div className="steps-content">
                    <Form {...layout} form={formStep1}>
                      <Form.Item className="form-item" name="shxydm">
                        <Input className="yz-input" placeholder="统一社会信用代码/纳税人识别号" disabled  prefix={<IdcardOutlined className="site-form-item-icon" />} />
                      </Form.Item>
                      <Form.Item className="form-item"  name="dzsjUserName" rules={[{ required: true, message: '请输入居民身份证号/手机号码/用户名' }]}>
                        <Input className="yz-input" placeholder="居民身份证号/手机号码/用户名" prefix={<UserOutlined className="site-form-item-icon" />}/>
                      </Form.Item>
                      <Form.Item className="form-item" name="dzsjPwd" rules={[{ required: true, message: '请输入个人用户密码' }]} >
                        <Input.Password className="yz-input" type="password" placeholder="个人用户密码" prefix={<LockOutlined className="site-form-item-icon" />}/>
                      </Form.Item>
                      <Button type='primary' onClick={() => yzStep1(1)} className="btn-style-01">验证</Button>
                    </Form>
                  </div>
                )}
                {loginType === '2' && (
                        <div className="steps-content" style={{ marginTop: 55, width: 550, textAlign: 'center' }}>
                          <Row justify="center">
                            <Col span={24}>
                              <Image width={200} src={imgLink} />
                            </Col>
                            <Col span={24}>
                              {imgLink ? '打开税务APP扫一扫' : ''}
                            </Col>
                          </Row>
                        </div>
                      )}
              </div>
            </Tabs.TabPane>
            <Tabs.TabPane tab="代理业务" key="2">
              <div className="steps-content">
                <Form {...layout} form={formStep4}>
                  <Form.Item className="form-item" name="shxydm">
                    <Input className="yz-input" placeholder="统一社会信用代码/纳税人识别号" disabled prefix={<IdcardOutlined className="site-form-item-icon" />} />
                  </Form.Item>
                  <Form.Item className="form-item" name="dljgnsrsbh" rules={[{ required: true, message: '请录入代理机构统一社会信用代码/纳税人识别号' }, baseValidator.english_number()]}>
                    <Input className="yz-input" placeholder="代理机构统一社会信用代码/纳税人识别号" maxLength={20} prefix={<IdcardOutlined className="site-form-item-icon" />} />
                  </Form.Item>
                  <Form.Item className="form-item" name="dzsjUserName" rules={[{ required: true, message: '请输入居民身份证号/手机号码/用户名' }]}>
                    <Input className="yz-input" placeholder="居民身份证号/手机号码/用户名" prefix={<UserOutlined className="site-form-item-icon" />} />
                  </Form.Item>
                  <Form.Item className="form-item" name="dzsjPwd" rules={[{ required: true, message: '请输入个人用户密码' }]}>
                    <Input.Password className="yz-input" type='password' placeholder="个人用户密码" prefix={<LockOutlined className="site-form-item-icon" />} />
                  </Form.Item>
                  <Button type='primary' onClick={() => yzStep4(4)} className="btn-style-01">验证</Button>
                </Form>
              </div>
            </Tabs.TabPane>
          </Tabs> : <></>}
          {current === 1 ? <div className="steps-content" style={{ marginTop: "140px" }}>
            <div className="back-login" onClick={() => gobackLogin(1)}><LeftOutlined className='leftoutlined-icon' />重新登录</div>
            <Form {...layout} form={formStep2}>
              <Form.Item>
                <Row gutter={8} style={{ width: '380px' }}>
                  <Col span={24}>
                    <Form.Item className="form-item" name="mobile">
                      <Input className="yz-input" placeholder="请输入手机号码" disabled prefix={<UserOutlined className="site-form-item-icon" />} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item className="form-item-yzm" name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
                      <Input className="yz-input" placeholder="请输入短信验证码" prefix={<CodeOutlined className="site-form-item-icon" />} style={{ width: '240px' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {yzmNum === 181 ? <Button className="btn-style-02" onClick={() => getYzmData()}>获取验证码</Button> :
                      (yzmNum === 0 ? <Button className="btn-style-02" onClick={() => getYzmData()}>重新获取</Button> : <Button className="btn-style-02" disabled>{yzmNum}秒</Button>)}
                  </Col>
                </Row>
              </Form.Item>
            </Form>
            <Button type='primary' onClick={() => yzStep2(2)} className="btn-style-01">验证</Button>
          </div> : <></>}
          {current === 2 ? <div className="steps-content" style={{ marginTop: '140px' }}>
            <div className="back-login" onClick={() => gobackLogin(2)}><LeftOutlined className='leftoutlined-icon' />重新登录</div>
            <div className="login-form-title">选择登录身份</div>
            <div className="sf-content">
              {getStep3Html(zrrArr)}
            </div>
          </div> : <></>}
          {current === 3 ? <div className="steps-content">
            <div className="tc-success">
              <div className="success-ts">
                <CheckCircleOutlined className='success-ts-icon' />
                <div className="success-title">验证成功</div>
              </div>
              <div className="success-text">
                <span className="success-name">纳税人名称：</span>
                <span className="success-info">{nsrmc}</span>
              </div>
              <div className="success-text">
                <span className="success-name">社会信用代码：</span>
                <span className="success-info">{nsrsbh}</span>
              </div>
              {
                zzrlxmc ?
                  <div className="success-text">
                    <span className="success-name">当前登录身份：</span>
                    <span className="success-info">{zzrlxmc}</span>
                  </div> : <></>
              }

              <Button type='primary' onClick={() => closeModal()} className="btn-style-03">关闭</Button>
            </div>
          </div> : <></>}
        </Spin>
      </div>
    </>
  );
};
export default AlertContentForm;
