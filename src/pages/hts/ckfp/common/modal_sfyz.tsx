import React, { useImperativeHandle, useState } from 'react';
import { Input, Modal, Steps, Button, Form, Row, Col, Spin, message } from 'antd';
import './style.less';
import { CheckCircleOutlined, CodeOutlined, IdcardOutlined, LeftOutlined, LockOutlined, UserOutlined } from '@ant-design/icons';
import myUtil from '@/components/DDAssist/util';
import { djmndl } from '@/pages/hts/services/htsApi';

export interface DDModalGridProps {
  onRef?: any;
  visible?: any;
  handleColseModal?: any;
}

let btnDjsTimer:any = null;
let hqyzmdjs = 181; 
const Spmc: React.FC<DDModalGridProps> = ({ onRef, visible = false, handleColseModal }) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const [masker, setMasker] = useState(false);
  const [current, setCurrent] = useState(0);
  const [yzmNum, setYzmNum] = useState<any>(0);
  const [formStep1] = Form.useForm();
  const [formStep2] = Form.useForm();
  const [userinfo, setUserinfo] = useState<any>({});
  const [zrrArr, setZrrArr] = useState<any>('');
  const [step1Form, setStep1Form] = useState<any>();
  // const [btnLoading, setBtnLoading] = useState(false);

  // 表单布局
  const layout = {
    wrapperCol: { span: 19, offset: 5 },
  };

  // 开启
  const showModal = () => {
    setModalVisible(true);
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    if(userInfo && userInfo?.qxQys[0]) {
      formStep1.setFieldsValue({
        shxydm: userInfo?.qxQys[0]?.shxydm ? userInfo?.qxQys[0]?.shxydm : userInfo?.qxQys[0]?.nsrsbh,
        dzsjUserName: '',
        dzsjPwd: '',
      })
    } else {
      formStep1.setFieldsValue({
        shxydm: '',
        dzsjUserName: '',
        dzsjPwd: '',
      })
    }
    setCurrent(0)
  };

  // 关闭
  const closeModal = () => {
    if(btnDjsTimer) {
      clearInterval(btnDjsTimer);
      btnDjsTimer = null;
      setYzmNum(0);
    }
    setModalVisible(false);
  }

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      closeModal,
    };
  });

  const getDjmndlData = (param: any) => {
    setMasker(true);
    djmndl(param).then((res:any)=> {
      setMasker(false);
      const {code, body, desc} = res;
      if(code === '200'){
        const rtnCode = body.rtnCode;
        if(rtnCode === '2010') {
          // 如果跳转到 步骤2 短信验证码
          setCurrent(1);
          hqyzmBtnDjs();
          formStep2.setFieldsValue({captcha:''})
        } else if(rtnCode === '2011') {
          // 选择 责任人
          setCurrent(2);
          const zzrlx = body.zzrlx;
          setZrrArr(zzrlx);
        } else if(rtnCode === '200') {
          setCurrent(3);
          const userInfo = myUtil.sessionStore.getItem('userInfo');
          let mc = '';
          if(body.zzrlx === '02') {
            mc = '财务负责人';
          } else if(body.zzrlx === '09') {
            mc = '开票员';
          } else if(body.zzrlx === '01') {
            mc = '法定责任人';
          }
          setUserinfo({
            nsrmc: userInfo?.qxQys[0]?.nsrmc,
            shxydm: userInfo?.qxQys[0]?.shxydm ? userInfo?.qxQys[0]?.shxydm : userInfo?.qxQys[0]?.nsrsbh,
            dqdlsf: param.mc ? param.mc : mc,
          })
        }
      } else if(code === '0'){
        message.error('系统异常，请联系技术支持。');
      } else {
        message.error(desc);
      }
    })
  }

  const yzStep1 = () => {
    formStep1.validateFields().then(values => {
      const obj = {
        czlx: '1',
        nsrsbh: values.shxydm,
        yhm: values.dzsjUserName,
        mm: values.dzsjPwd,
      }
      setStep1Form(obj)
      getDjmndlData(obj);
    })
  }

  const yzStep1Cx = () => {
    // formStep1.validateFields().then(values => {
      getDjmndlData(step1Form);
    // })
  }

  const yzStep2 = () => {
    const sjh:any = formStep1.getFieldValue('dzsjUserName')
    formStep2.validateFields().then(values => {
      clearInterval(btnDjsTimer);
      btnDjsTimer = null;
      setYzmNum(0);
      const obj = {
        czlx: '2',
        dxyzm: values.captcha,
        yhm: sjh
      }
      getDjmndlData(obj);

    })
  }

  const yzStep3 = (id: any, mc: any) => {
    const sjh:any = formStep1.getFieldValue('dzsjUserName')
    // 走接口
    const obj = {
      czlx: '3',
      zzrlx: id,
      mc: mc,
      yhm: sjh
    }
    getDjmndlData(obj);
  }

  // 获得验证码
  // const getYzmData = () => {
  //   // 走调用验证码接口
  //   yzStep1();
  // }

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

  const getImgSrc = () => {
    let src = "";
    if(PRO_BASE && PRO_BASE != '') {
      src = `/${PRO_BASE}/img`;
      return src;
    } else {
      src = `/img`;
      return src;
    }
  }

  // 选择身份
  const getStep3Html = (arr: any) => {
    // const sfArr = [{ zrrlxmc: '法定代表人', zrrlx: '01', qrzt: '00' }, { zrrlxmc: '财务负责人', zrrlx: '02', qrzt: '00' }, { zrrlxmc: '财务负责人', zrrlx: '03', qrzt: '00' }];
    const sfArr:any = arr ? arr.split(",") : [];
    const html: any = [];
    if (sfArr.length > 0) {
      sfArr.forEach((item: any)=> {
          let imgLink = 'img_fddb.svg';
          let zrrlxmc = '法定责任人';
          if (item === '01') {
            imgLink = '/img_fddb.svg';
            zrrlxmc = '法定责任人';
          } else if (item === '02') {
            imgLink = '/img_cwfzr.svg';
            zrrlxmc = '财务负责人';
          } else if (item === '09') {
            imgLink = '/img_kpy.svg';
            zrrlxmc = '开票员';
          }
          html.push(<div className="sf-content-box" onClick={()=>yzStep3(item, zrrlxmc)}>
            <div className="sf-card-style">
            <img className="sf-img" src={getImgSrc() + imgLink}/>
            <div className="sf-text">{zrrlxmc}</div>
            </div></div>);
      })
    }
    return html;
  }



  const YzSuccess = () => {
    if(current === 3) {
      // 订单提交开票接口
      // （1）如需二次认证，弹出开票二维码认证
      // （2）否则，提交成功，发票管理中展示数据并更新发票状态
      if(handleColseModal) {
        handleColseModal();
      } else {
        closeModal();
      }
    } else {
      closeModal();
    }
  }

  const gobackLogin = (num: any) => {
    setCurrent(0)
    if(num === 1) {
      clearInterval(btnDjsTimer);
      btnDjsTimer = null;
      setYzmNum(0);
    }
  }


  return (
    <>
      <Modal
        title="电子税务局身份验证"
        centered
        destroyOnHidden
        visible={modalVisible}
        width='700px'
        onCancel={YzSuccess}
        mask={{ closable: false }}
        footer={(<></>)}
      >
        <Spin tip="Loading..." spinning={masker} delay={100}>
          <div className='mndlym_main'>
            <div className='yz-steps'>
              <Steps current={current} size="small">
                <Steps.Step title="企业信息登录" status={current === 0 ? 'process' : 'finish'} />
                <Steps.Step title="登录信息验证" status={current < 1 ? 'wait' : current === 1 ? 'process' : 'finish'} />
                <Steps.Step title="选择登录身份" status={current < 2 ? 'wait' : current === 2 ? 'process' : 'finish'} />
                <Steps.Step title="验证完成" status={current === 3 ? 'finish' : 'wait'} />
              </Steps>
            </div>
            {current === 0 ? <div className="steps-content" style={{marginTop:"55px"}}>
              <Form {...layout} form={formStep1}>
                <Form.Item className="form-item" name="shxydm">
                  <Input className="yz-input" placeholder="统一社会信用代码/纳税人识别号" disabled prefix={<IdcardOutlined className="site-form-item-icon" />} />
                </Form.Item>
                <Form.Item className="form-item" name="dzsjUserName" rules={[{ required: true, message: '请输入手机号码/用户名' }]}>
                  <Input className="yz-input" placeholder="手机号码/用户名" prefix={<UserOutlined className="site-form-item-icon" />} />
                </Form.Item>
                <Form.Item className="form-item" name="dzsjPwd" rules={[{ required: true, message: '请输入个人用户密码' }]}>
                  <Input className="yz-input" type='password' placeholder="个人用户密码" prefix={<LockOutlined className="site-form-item-icon" />} />
                </Form.Item>
                <Button type='primary' onClick={()=>yzStep1()} className="btn-style-01">验证</Button>
              </Form>
            </div> : <></>}
            {current === 1 ? <div className="steps-content" style={{marginTop:"140px"}}>
              <div className="back-login" onClick={()=>gobackLogin(1)}><LeftOutlined className='leftoutlined-icon' />重新登录</div>
              <Form {...layout} form={formStep2}>
                <Form.Item>
                  <Row gutter={8}>
                    <Col span={12}>
                      <Form.Item className="form-item-yzm" name="captcha" rules={[{ required: true, message: '请输入验证码' }]}>
                        <Input className="yz-input" placeholder="请输入短信验证码" prefix={<CodeOutlined className="site-form-item-icon" />} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      {/* {yzmNum === 150 ? <Button className="btn-style-02" onClick={()=>getYzmData()}>获取验证码</Button> : */}
                      {yzmNum === 0 ? <Button className="btn-style-02" onClick={()=>yzStep1Cx()}>重新获取</Button> : <Button className="btn-style-02" disabled>{yzmNum}秒</Button> }
                    </Col>
                  </Row>
                </Form.Item>
              </Form>
              <Button type='primary' onClick={()=>yzStep2()} className="btn-style-01">验证</Button>
            </div> : <></>}
            {current === 2 ? <div className="steps-content" style={{marginTop: '55px'}}>
              <div className="back-login" onClick={()=>gobackLogin(2)}><LeftOutlined className='leftoutlined-icon' />重新登录</div>
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
                  <span className="success-info">{userinfo.nsrmc}</span>
                </div>
                <div className="success-text">
                  <span className="success-name">社会信用代码：</span>
                  <span className="success-info">{userinfo.shxydm}</span>
                </div>
                {
                  userinfo.dqdlsf ? 
                  <div className="success-text">
                    <span className="success-name">当前登录身份：</span>
                    <span className="success-info">{userinfo.dqdlsf}</span>
                  </div> : <></>
                }
                
                <Button type='primary' onClick={()=>YzSuccess()} className="btn-style-03">关闭</Button>
              </div>
            </div> : <></>}
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default Spmc;
