import React, { useState, useEffect } from 'react';
import { Input, Steps, Button, Form, Row, Col, Spin, Select, message } from 'antd';
import './tab_style.less';
import { CheckCircleOutlined, CodeOutlined, IdcardOutlined, LeftOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import myUtil from '@/pages/common/myUtil';
import { djmndl, bcsddlxx, cxsddlxx, scdl, tjdxyzm } from '@/services/hts/api';
import baseValidator from '@/pages/common/field/baseValidator';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  gotoActiveKey?: any;
}

let btnDjsTimer: any = null;
let hqyzmdjs = 181;
const Spmc: React.FC<DDModalGridProps> = ({ onRef, visible = false, gotoActiveKey }) => {
  const [yzmNum, setYzmNum] = useState<any>(0);
  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();
  const [ssdq1, setSsdq1] = useState();
  // 列表是否为可编辑状态
  const [bjFlag, setBjFlag] = useState<any>(true);
  // 修改按钮状态
  const [xgFlag, setXgFlag] = useState<any>(true);
  // 保存按钮按钮状态
  const [bcFlag, setBcFlag] = useState<any>(true);
  // 验证按钮状态
  const [yzFlag, setYzFlag] = useState<any>(true);
  const [masker, setMasker] = useState(false);
  const [current, setCurrent] = useState(0);
  const [userinfo, setUserinfo] = useState<any>({});
  const [gzOptions, setgzOptions] = useState<any>([]);
  const [crFlag, setCrFlag] = useState();
  const [dqdlsf, setDqdlsf] = useState();

  // 表单布局
  const layout = {
    wrapperCol: { span: 19, offset: 5 },
  };

  useEffect(() => {
    loadMoreData();
  }, []);

  const loadMoreData = () => {
    Promise.all([myUtil.code.getCodeFromServerT1('CODE_DM_ZXSB_JSYWSSZRRLX', '01')]).then(() => {
      const temp = myUtil.code.getCode('CODE_DM_ZXSB_JSYWSSZRRLX', '01');
      setgzOptions(temp);
    }).catch(() => {
      message.error('获取码表失败');
    });
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    const ssdq1 = userInfo?.qxQys[0]?.ssdq1;
    setSsdq1(ssdq1);
    // 初始化状态查询
    loadMoreData2();
  };


  const loadMoreData2 = async () => {
    setMasker(true);
    await cxsddlxx().then((res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code == '200') {
        // 根据手机号判断是否为首次配置 有值则非首次配置
        if (body?.dzsjdlzh) {
          // 非首次配置列表为不可编辑状态
          setBjFlag(true);
          // 修改按钮可用
          setXgFlag(false);
          // 验证按钮可用
          setYzFlag(false);
          // 保存按钮置灰
          setBcFlag(true);
          const temp = myUtil.code.getCode('CODE_DM_ZXSB_JSYWSSZRRLX', '01');
          for (let i = 0; i < temp.length; i++) {
            if (body?.zrrlxdm == temp[i].code) {
              setDqdlsf(temp[i].name);
              break
            }
          }
        } else {
          // 首次配置列表为可编辑状态
          setBjFlag(false);
          // 修改按钮置灰
          setXgFlag(true);
          // 验证按钮置灰
          setYzFlag(true);
          // 保存按钮可用
          setBcFlag(false);
        }
        setSsdq1(body?.ssdq1);
        formStep1.setFieldsValue(res.body);

      } else {
        message.error(msg);
      }
    });
    setCurrent(0)
  };



  const yzStep1 = () => {
    formStep1.validateFields().then(values => {
      const obj = {
        dlfs: '1',
        xfnsrsbh: values.xfnsrsbh,
        dzsjdlzh: values.dzsjdlzh,
      }
      setMasker(true);
      scdl(obj).then((res: any) => {
        setMasker(false);
        const { code, msg, body } = res;
        if ("200" == code) {
          // 如果跳转到 步骤2 短信验证码
          if (body.data == 'S000') {
            setCurrent(3);
            hqyzmBtnDjs();
          } else {
            setCurrent(1);
            hqyzmBtnDjs();
          }
        } else {
          message.error(msg);
        }
      });
    })
  }


  const hqyzmBtnDjs = () => {
    var time = hqyzmdjs; // 倒计时时间
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


  const yzStep1Cx = () => {
    getDjmndlData();
  }
  const getDjmndlData = () => {
    setMasker(true);
    const xfnsrsbh: any = formStep1.getFieldValue('xfnsrsbh');
    const dzsjdlzh: any = formStep1.getFieldValue('dzsjdlzh');
    const obj = {
      dlfs: '1',
      xfnsrsbh: xfnsrsbh,
      dzsjdlzh: dzsjdlzh,
    }
    setMasker(true);
    scdl(obj).then((res: any) => {
      setMasker(false);
      const { code, msg } = res;
      if ("200" == code) {
        message.success('发送成功！');
        setCurrent(1);
        hqyzmBtnDjs();
        formStep2.setFieldsValue({ captcha: '' })
      } else {
        message.error(msg);
      }
    });
  }

  const yzStep2 = async () => {
    await formStep2.validateFields();
    const yzm: any = formStep2.getFieldValue('captcha');
    const xfnsrsbh: any = formStep1.getFieldValue('xfnsrsbh');
    const dzsjdlzh: any = formStep1.getFieldValue('dzsjdlzh');
    clearInterval(btnDjsTimer);
    btnDjsTimer = null;
    setYzmNum(0);
    const obj = {
      xfnsrsbh: xfnsrsbh,
      dzsjdlzh: dzsjdlzh,
      dxyzm: yzm
    }
    setMasker(true);
    tjdxyzm(obj).then((res: any) => {
      setMasker(false);
      const { code, body, desc } = res;
      if (code === '200') {
        setCurrent(3);
        const userInfo = myUtil.sessionStore.getItem('userInfo');
        setUserinfo({
          nsrmc: userInfo?.qxQys[0]?.nsrmc,
          shxydm: userInfo?.qxQys[0]?.shxydm ? userInfo?.qxQys[0]?.shxydm : userInfo?.qxQys[0]?.nsrsbh,
        })
      } else if (code === '0') {
        message.error('系统异常，请联系技术支持。');
      } else {
        message.error(desc);
      }
    });
  }

  const gobackLogin = (num: any) => {
    setCurrent(0)
    if (num === 1) {
      clearInterval(btnDjsTimer);
      btnDjsTimer = null;
      setYzmNum(0);
    }
  }

  // 关闭
  const closeModal = () => {
    gotoActiveKey();
  }



  const save = () => {
    formStep1.validateFields().then(values => {
      setMasker(true);
      bcsddlxx(values).then((res: any) => {
        setMasker(false);
        const { code, msg } = res;
        if ("200" == code) {
          message.success('保存成功！');
          // 不可编辑
          setBjFlag(true);
          // 修改按钮可点击
          setXgFlag(false);
          // 验证按钮可点击
          setYzFlag(false);
          // 保存按钮不可用
          setBcFlag(true);
          const temp = myUtil.code.getCode('CODE_DM_ZXSB_JSYWSSZRRLX', '01');
          for (let i = 0; i < temp.length; i++) {
            if (formStep1.getFieldValue('zrrlxdm') == temp[i].code) {
              setDqdlsf(temp[i].name);
              break;
            }
          }
        } else {
          message.error(msg);
        }
      });
    })

  }

  const edit = () => {
    setBjFlag(false);
    // 修改按钮不可用
    setXgFlag(true);
    // 保存按钮可用
    setBcFlag(false);
    // 验证按钮不可用
    setYzFlag(true);
  }


  return (
    <>
      <Spin tip="Loading..." spinning={masker} delay={100}>
        <div className='mndlym_main2'>
          <div className='yz-steps'>
            <Steps current={current} size="small">
              <Steps.Step title="企业信息登录" status={current === 0 ? 'process' : 'finish'} />
              <Steps.Step title="登录信息验证" status={current < 1 ? 'wait' : current === 1 ? 'process' : 'finish'} />
              <Steps.Step title="验证完成" status={current === 3 ? 'finish' : 'wait'} />
            </Steps>
          </div>
          {current === 0 ?
            <div className="steps-content" style={{ marginTop: "55px" }}>
              <Form {...layout} form={formStep1}>
                <Form.Item className="form-item" name="xfnsrsbh">
                  <Input className="yz-input" placeholder="统一社会信用代码/纳税人识别号" disabled />
                </Form.Item>
                <Form.Item className="form-item" name="dzsjdlzh" rules={[{ required: true, message: '请输入手机号码/用户名' },baseValidator.phone2()]}>
                  <Input className="yz-input" placeholder="手机号码/用户名" disabled={bjFlag} />
                </Form.Item>
                <Form.Item className="form-item" name="dzsjdlmm" rules={[{ required: true, message: '请输入个人用户密码' }]}>
                  <Input className="yz-input" type='password' disabled={bjFlag} placeholder="个人用户密码" prefix={<LockOutlined className="site-form-item-icon" />} />
                </Form.Item>
                <Form.Item className="form-item" name="bsrsfzjhm" rules={[{ required: true, message: '请输入身份证号' }, baseValidator.idcard()]}>
                  <Input className="yz-input" placeholder="身份证号" disabled={bjFlag} />
                </Form.Item>
                <Form.Item className="form-item" name="bsrsjh" rules={[{ required: true, message: '请输入手机号' }, baseValidator.phone()]}>
                  <Input className="yz-input" placeholder="手机号" disabled={bjFlag} />
                </Form.Item>
                <Form.Item className="form-item" name="bsrxm" rules={[{ required: true, message: '请输入姓名' }]}>
                  <Input className="yz-input" placeholder="姓名" disabled={bjFlag} />
                </Form.Item>
                <Form.Item className="form-item" name="zrrlxdm" rules={[{ required: true, message: '请选择责任人类型' }]}>
                  <Select placeholder="责任人类型" className="yz-input" disabled={bjFlag}>
                    {gzOptions?.map((selectItem: any) => (
                      <Select.Option key={selectItem.code} value={selectItem.code}>{selectItem.name}</Select.Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item className="form-item" name="dllx" rules={ssdq1 == '14400000000' ? [{ required: true, message: '请选择登录类型' }] : []}>
                  <Select placeholder="登录类型" className="yz-input" disabled={bjFlag} allowClear>
                    <Select.Option key="102938" value={"0"}>旧版</Select.Option>
                    <Select.Option key="230421" value={"1"}>新版</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item className="form-item" name="dlmm" rules={ssdq1 == '13100000000' ? [{ required: true, message: '请输入登录密码' }] : []}>
                  <Input className="yz-input" type='password' placeholder="登录密码" disabled={bjFlag} />
                </Form.Item>
                <div className='div-style-01'>
                  <Button type='primary' onClick={() => edit()} disabled={xgFlag} style={xgFlag ? { backgroundColor: '#DDDDDD' } : {}} className='btn-style-011'>修改</Button>&nbsp;&nbsp;
                  <Button type='primary' onClick={() => save()} disabled={bcFlag} style={bcFlag ? { backgroundColor: '#DDDDDD' } : {}} className='btn-style-011'>保存</Button>&nbsp;&nbsp;
                  <Button type='primary' onClick={() => yzStep1()} disabled={yzFlag} style={yzFlag ? { backgroundColor: '#DDDDDD' } : {}} className='btn-style-011'>验证</Button>
                </div>
              </Form>
            </div>
            : <div></div>}
          {current === 1 ? <div className="steps-content" style={{ marginTop: "140px" }}>
            <div className="back-login" onClick={() => gobackLogin(1)}><LeftOutlined className='leftoutlined-icon' />重新登录</div>
            <Form {...layout} form={formStep2}>
              <Form.Item>
                <Row gutter={8} style={{ width: '380px' }}>
                  <Col span={12}>
                    <Form.Item className="form-item-yzm" name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
                      <Input className="yz-input" placeholder="请输入短信验证码" prefix={<CodeOutlined className="site-form-item-icon" />} style={{ width: '240px' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    {yzmNum === 0 ? <Button className="btn-style-02" style={{ marginLeft: '60px', marginTop: '0px' }} onClick={() => yzStep1Cx()}>重新获取</Button> : <Button style={{ marginLeft: '60px', marginTop: '0px' }} className="btn-style-02" disabled>{yzmNum}秒</Button>}
                  </Col>
                </Row>
              </Form.Item>
            </Form>
            <Button type='primary' onClick={() => yzStep2()} className="btn-style-011" style={{ width: '200px', marginLeft: "-190px", marginTop:"100px",}} >验证</Button>
          </div> : <></>}
          {current === 3 ? <div className="steps-content" style={{ marginTop: "0px" }}>
            <div className="tc-success">
              <div className="success-ts">
                <CheckCircleOutlined className='success-ts-icon' />
                <div className="success-title">验证成功</div>
              </div>
              <div className="success-text">
                <span className="success-name">纳税人名称：</span>
                <span className="success-info">{userinfo.nsrmc}</span>
              </div>
              <div className="success-text">
                <span className="success-name">社会信用代码：</span>
                <span className="success-info">{userinfo.shxydm}</span>
              </div>
              {
                dqdlsf ?
                  <div className="success-text">
                    <span className="success-name">当前登录身份：</span>
                    <span className="success-info">{dqdlsf}</span>
                  </div> : <></>
              }
              <div className="success-ts">
                <Button style={{ width: '200px', marginTop: "0px" }} type="primary" onClick={closeModal}> 完成 </Button>
              </div>
            </div>
          </div> : <></>}
        </div>
      </Spin>
    </>
  );
};

export default Spmc;
