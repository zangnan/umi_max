import { LockOutlined, UserOutlined, SafetyOutlined} from '@ant-design/icons';
import { Alert, message , Row, Col} from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm} from '@ant-design/pro-form';
import { history, useModel, useAccess } from 'umi';
import { login ,getXtcspz, getCaptcha} from '@/services/ant-design-pro/api';
import CompanyModal from '@/pages/user/Login/companyModal';
import myUtil from '@/pages/common/myUtil';
import styles from './index.less';
import './index.less';
import DDSlider from '@/components/DDSlider';
import { Base64 } from 'js-base64';



const Login: React.FC = () => {
  const access = useAccess(); // 权限

  const [securityCode, setSecurityCode] = useState('1'); // 验证方式：1-滑动验证，2-图片验证码
  const [verification, setVerification] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const refCompanyModal: any = useRef();
  const [isSSO, setIsSSO] = useState<boolean>(false); // 系统集成标志

  // useEffect(() => {
  //   initSecurityCode();
  // }, [securityCode]);

  useEffect(() => {
    const fetchData = async () => {
      const isSSO: any = history?.location?.query?.isSSO;
      if (isSSO) {
        setIsSSO(true);
        const info: any = history?.location?.query?.info;
        const infoJmUri = decodeURIComponent(info);
        const params: any = JSON.parse(Base64.decode(infoJmUri));
        handleSubmitJc(params);
      } else {
        setIsSSO(false);
        initSecurityCode();
        window.localStorage.removeItem('isSSO');
      }
    }
    fetchData();
  }, []);

  const handleSubmitJc = async (values: any) => {
    try {
      // 清空用户信息
      await myUtil.authority.clearUserInfo();
      if(!values.type || values.type != '2'){
        myUtil.localStore.clear('qxQysSaas');
      }
      const params = {...values};
      params.isMhjc = 'Y';
      // 登录
      const msg: any = await login({ ...params });
      if (msg.code === '200') {
        // message.success('用户登录成功！');
        if (msg?.body?.ACCESS_TOKEN) {
          localStorage.setItem('accessTokenUsername', values.username);
          localStorage.setItem('accessToken', msg?.body?.ACCESS_TOKEN);
          localStorage.setItem('isSSO', "Y");
        }
        await fetchUserInfo();
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } else if (msg.code === '201') {
        // 多企业用户
        refCompanyModal.current?.showModal({
          qxQysSaas: msg?.body?.qxQysSaas || [],
          loginInfo: values
        });
        myUtil.localStore.setItem('qxQysSaas', msg?.body?.qxQysSaas);
        return;
      } else if (msg.code === '900') {
        message.error(msg.msg);
      } else {
        setUserLoginState({
          status: 'error',
          msg: '登录失败'
        });
      }
    } catch (error) {
      message.error('用户登录失败，请稍后操作！');
    }
  };

  const initSecurityCode = () => {
    getXtcspz({}).then((res:any) => {
      if (res?.code === '200') {
        setSecurityCode(res?.body?.securityCode);
        if (res?.body?.securityCode === '2') {
          handleFetchCaptcha();
        }
      }
    }).catch(() => {
      message.error('获取安全验证方式失败');
    })
  }

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: any) => {
    if (!verification && securityCode === '1') {
      setUserLoginState({
        status: 'error',
        msg: '请滑动验证码！'
      });
      return;
    }
    try {
      // 清空用户信息
      await myUtil.authority.clearUserInfo();
      if(!values.type || values.type != '2'){
        myUtil.localStore.clear('qxQysSaas');
      }
      const params = {...values};
      if (securityCode === '2') {
        params.captchaId = captchaId;
      }
      // 登录
      const msg: any = await login({ ...params });
      if (msg.code === '200') {
        // message.success('用户登录成功！');
        if (msg?.body?.ACCESS_TOKEN) {
          localStorage.setItem('accessTokenUsername', values.username);
          localStorage.setItem('accessToken', msg?.body?.ACCESS_TOKEN);
          window.localStorage.removeItem('jcfs'); // 集成使用，正常登录时清空jcfs
        }
        // if (msg?.body?.DDIT_SAAS_JC_TOKEN) {
        //   localStorage.setItem('dditSaasJcToken', msg?.body?.DDIT_SAAS_JC_TOKEN);
        // }
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } else if (msg.code === '201') {
        // 多企业用户
        refCompanyModal.current?.showModal({
          qxQysSaas: msg?.body?.qxQysSaas || [],
          loginInfo: values
        });
        myUtil.localStore.setItem('qxQysSaas', msg?.body?.qxQysSaas);
        return;
      } else if (msg.code === '900') {
        // 如果失败去设置用户错误信息
        // setUserLoginState({
        //   status: 'error',
        //   msg: msg.msg
        // });
        message.error(msg.msg);
        if (securityCode === '2') {
          handleRefreshCaptcha();
        }
      } else {
        // 如果失败去设置用户错误信息
        setUserLoginState({
          status: 'error',
          msg: '登录失败'
        });
        if (securityCode === '2') {
          handleRefreshCaptcha();
        }
      }
    } catch (error) {
      message.error('用户登录失败，请稍后操作！');
      if (securityCode === '2') {
        handleRefreshCaptcha();
      }
    }
  };
  const { status, msg } = userLoginState;

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

  const resultClick = (e: any)=>{
    if (e === 'N') {
     setVerification(false);
    } else if(e === 'Y') {
     setVerification(true);
    }
  }

  const [captchaId, setCaptchaId] = useState('');
  const [captchaImageUrl, setCaptchaImageUrl] = useState('');
  // 验证码刷新
  const handleRefreshCaptcha = () => {
    // 释放之前的URL资源
    if (captchaImageUrl) {
      URL.revokeObjectURL(captchaImageUrl);
    }
    handleFetchCaptcha();
  };

  const handleFetchCaptcha = async () => {
    try {
      const response = await getCaptcha();
      const tmpId: any = response.response.headers.get('x-captcha-id');
      setCaptchaId(tmpId);
      const tmpUrl = URL.createObjectURL(response.data);
      setCaptchaImageUrl(tmpUrl);
    } catch (error) {
      message.error('获取验证码失败，请重试');
    }
  };


  return (
    <div className='dlogin_wrap'>
      {isSSO ? <>
        <CompanyModal onRef={refCompanyModal} doSubmit={handleSubmitJc}/>
      </> : 
        <>
          {
            access.isLogin() ?
              <div className={styles.container}>
              <div className={styles.content}>
                <LoginForm LoginForm title={<>
                    <img alt="logo" src={getImgSrc() + "/logo_hts_icon1.png"} style={{width: "184px", marginRight: '20px'}}/>
                    <img alt="logo" src={getImgSrc() + "/logo_hts_icon2.png"} style={{width: "226px"}}/>
                  </>}
                  initialValues={{ autoLogin: true, }}
                  className={styles.loginForm}
                  onFinish={async (values) => { await handleSubmit(values as API.LoginParams); }}
                >
                  {status === 'error' && (<Alert message={msg} type="error" showIcon />)}
                  <div style={{marginBottom: '15px'}}>
                    <span className={styles.loginTitleEN}>Login</span>
                    <span className={styles.loginTitleCN}>登录</span>
                  </div>
                  <div className={styles.loginUserName}>
                    <ProFormText
                      name="username"
                      fieldProps={{ size: 'large', prefix: <UserOutlined className={styles.prefixIcon} />, }}
                      placeholder='用户名'
                      rules={[ { required: true, message: "请输入用户名!", }, ]}
                    />
                    <ProFormText.Password
                      name="password"
                      className={styles.loginUserName}
                      fieldProps={{ size: "large", prefix: <LockOutlined className={styles.prefixIcon} />, }}
                      placeholder="密码"
                      rules={[ { required: true, message: "请输入密码！", }, ]}
                    />
                    {securityCode === '2' ? <Row gutter={8}>
                      <Col span={14}>
                      <ProFormText
                          name="captcha"
                          fieldProps={{ size: 'large', prefix: <SafetyOutlined className={styles.prefixIcon} />, }}
                          placeholder='验证码'
                          rules={[ { required: true, message: "请输入验证码!", }, ]}
                        />
                      </Col>
                      <Col span={10}>
                      <div className="captcha-container">
                          <img
                            src={captchaImageUrl}
                            alt="验证码"
                            onClick={handleRefreshCaptcha}
                            style={{
                              width: 120,
                              height: 33,
                              cursor: 'pointer',
                              borderRadius: 4,
                              border: '1px solid #d9d9d9',
                            }}
                          />
                        </div>
                      </Col>
                    </Row> : <></>}
                  </div>
                  {securityCode === '1'? <div style={{ marginBottom: 20, color: "#666" }} >
                    <DDSlider showSlider={true} resultClick={resultClick}></DDSlider>
                  </div>: <></>}
                </LoginForm>
              </div>
              <div className={styles.footerText}>Copyright © {new Date().getFullYear()} All Right Reserver</div>
              <CompanyModal onRef={refCompanyModal} doSubmit={handleSubmit}/>
            </div>
            // : <div className='bgPage'>
            //     <div className='error404'></div>
            //   </div>
            : <></>
          }
        </>
      }
    </div>
  );
};

export default Login;
