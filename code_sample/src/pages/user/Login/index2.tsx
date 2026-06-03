import { Alert, message, Tabs } from 'antd';
import React, { useState, useRef } from 'react';
import { ProFormCheckbox, ProFormText, LoginForm } from '@ant-design/pro-form';
import { history, useModel, useAccess } from 'umi';
import { login } from '@/services/ant-design-pro/api';
import CompanyModal from '@/pages/user/Login/companyModal';
import myUtil from '@/pages/common/myUtil';
import styles from './index2.less';
import './index2.less';
import DDSlider from '@/components/DDSlider';

const Login: React.FC = () => {
  const access = useAccess(); // 权限

  const [verification, setVerification] = useState(false);
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const refCompanyModal: any = useRef();
  const [loginType, setLoginType] = useState('mmdl'); // mmdl smdl

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
    if (!verification) {
      setUserLoginState({
        status: 'error',
        msg: '请滑动验证码！'
      });
      return;
    }
    try {
      // 清空用户信息
      await myUtil.authority.clearUserInfo();
      if (!values.type || values.type != '2') {
        myUtil.localStore.clear('qxQysSaas');
      }
      // 登录
      const msg: any = await login({ ...values });
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
      } else {
        // 如果失败去设置用户错误信息
        setUserLoginState({
          status: 'error',
          msg: '登录失败'
        });
      }
    } catch (error) {
      message.error('用户登录失败，请稍后操作！');
    }
  };
  const { status, msg } = userLoginState;

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

  const resultClick = (e: any) => {
    if (e === 'N') {
      setVerification(false);
    } else if (e === 'Y') {
      setVerification(true);
    }
  }

  return (
    <div className={`dlogin_wrap dlogin_wrap_${loginType}`}>
      {
        access.isLogin() ?
          <div className={styles.container}>
            <div className={styles.content}>
              <LoginForm LoginForm title={<>
                <img alt="logo" src={getImgSrc() + "/logo_hts_black_icon1.png"} style={{ width: "184px", marginRight: '20px' }} />
                <img alt="logo" src={getImgSrc() + "/logo_hts_black_icon2.png"} style={{ width: "226px" }} />
                <h3>欢迎回来，请登录！</h3>
              </>}
                initialValues={{ autoLogin: true, }}
                className={styles.loginForm}
                onFinish={async (values) => { await handleSubmit(values as API.LoginParams); }}
              >
                <Tabs centered activeKey={loginType} onChange={(activeKey) => setLoginType(activeKey)} >
                  <Tabs.TabPane key={'mmdl'} tab={'密码登录'} />
                  {/* <Tabs.TabPane key={'smdl'} tab={'扫码登录'} /> */}
                </Tabs>
                {status === 'error' && (<Alert message={msg} type="error" showIcon />)}
                {loginType === 'mmdl' && (<>
                  <div className={styles.loginUserName}>
                    <ProFormText
                      name="username"
                      fieldProps={{ size: 'large', }}
                      placeholder='用户名'
                      label="用户名或电子邮箱地址"
                      rules={[{ required: true, message: "请输入用户名!", },]}
                    />
                    <ProFormText.Password
                      name="password"
                      className={styles.loginUserName}
                      fieldProps={{ size: "large", }}
                      placeholder="密码"
                      label="密码"
                      rules={[{ required: true, message: "请输入密码！", },]}
                    />
                  </div>
                  <div style={{ marginTop: 24, marginBottom: 24, color: "#666" }} >
                    <DDSlider showSlider={true} resultClick={resultClick}></DDSlider>
                    {/* <ProFormCheckbox noStyle name="autoLogin">自动登录</ProFormCheckbox> */}
                  </div>
                </>)}
                {loginType === 'smdl' && (<>
                  <div>扫码登录</div>
                </>)}
              </LoginForm>
            </div>
            {/* <div className={styles.footerText}>Copyright © {new Date().getFullYear()} All Right Reserver</div> */}
            <CompanyModal onRef={refCompanyModal} doSubmit={handleSubmit} />
          </div>
          // : <div className='bgPage'>
          //     <div className='error404'></div>
          //   </div>
          : <></>
      }
    </div>
  );
};

export default Login;
