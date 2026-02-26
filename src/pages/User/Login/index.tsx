import React, { useState } from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { LoginForm, ProFormSelect, ProFormText, ProConfigProvider } from '@ant-design/pro-components';
import { history, useModel, Helmet } from '@umijs/max';
import { login } from '@/services/api';
// import { controllerAuthorityGetToken } from '@/services/egg_ervices/authority';
import { flushSync } from 'react-dom';
import { Alert, App, message } from 'antd';
import { Base64 } from 'js-base64';
import myUtil from '@/components/DDAssist/util';
// import logo from '@/assets/css/img/logo_rpa.png';
import CONSTANTS from '@/components/DDAssist/constants';
import './index.less';
import nbglxtUtil from '@/pages/nbglxt/common/nbglxtUtil';

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{ marginBottom: 24, }}
      title={content}
      type="error"
      showIcon
    />
  );
};

export default () => {
  const [userLoginState, setUserLoginState] = useState(true);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { message } = App.useApp();
  // const [dictAppType, setDcitAppType] = useState<any>({ dictAppDev01: '开发库01', dictAppDev02: '开发库02', dictAppPro: '生产库' });

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await myUtil.sdp.init({currentUser: userInfo?.body});
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      // myUtil.localStore.setItem('DICT_APP_TYPE', values?.dictApp);
      // 登录
      // const msg = await login({ ...values, password: Base64.encode(values?.password) });
      // let getTokenApi = ENV_TYPE === 'node' ? controllerAuthorityGetToken : login
      const msg: any = await login({ ...values, password: values?.password });
      if (msg.code === '200') {
        message.success('登录成功！');
        if (msg?.body?.token) {
          localStorage.setItem(CONSTANTS.LOGIN.ACCESS_TOKEN, msg?.body?.token);
        }
        await fetchUserInfo();
        await nbglxtUtil.app.init();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        if (ENV_TYPE === 'node') {
          history.push(urlParams.get('redirect') || CONSTANTS.ROUTE.ROUTE_LOGIN_REDIRECT_DEFAULT_DC);
        } else {
          history.push(urlParams.get('redirect') || CONSTANTS.ROUTE.ROUTE_LOGIN_REDIRECT_DEFAULT);
        }
        return;
      }
      console.log(msg);
      // 如果失败去设置用户错误信息
      setUserLoginState(false);
    } catch (error) {
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };

  // const handleChangeUser = (event: any) => {
  //   const { value } = event.target;
  //   if (value === 'admin') {
  //     setDcitAppType({ dictAppDev01: '开发库01', dictAppDev02: '开发库02', dictAppPro: '生产库' });
  //   } else {
  //     setDcitAppType({ dictAppDev01: '开发库01', dictAppDev02: '开发库02' });
  //   }
  // }

  return (
    <ProConfigProvider hashed={false}>
      <Helmet>
        <title> 登录页 - {myUtil?.sys?.getConfig()?.title} </title>
      </Helmet>
      <div style={{ backgroundColor: 'white' }} className='login_container'>
        <LoginForm
          // logo={"/img/logo_rpa.png"}
          // logo={logo}
          logo={myUtil.sys.getConfig().logo_login}
          title={myUtil?.sys?.getConfig()?.title}
          // subTitle="辅助开发工具"
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          {!userLoginState && (
            <LoginMessage content='账户或密码错误' />
          )}
          <ProFormText
            name="username"
            // fieldProps={{ onChange: handleChangeUser, size: 'large', prefix: <UserOutlined className={'prefixIcon'} />, }}
            fieldProps={{ size: 'large', prefix: <UserOutlined className={'prefixIcon'} />, }}
            placeholder={'用户名'}
            rules={[ { required: true, message: '请输入用户名!', }, ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{ size: 'large', prefix: <LockOutlined className={'prefixIcon'} />, }}
            placeholder={'密码'}
            rules={[ { required: true, message: '请输入密码！', }, ]}
          />
        </LoginForm>
        <div className="login-footer">
          {myUtil?.sys?.getConfig()?.copyRight} v_{VERSION_DATE || '0'}
        </div>
      </div>
    </ProConfigProvider>
  );
};