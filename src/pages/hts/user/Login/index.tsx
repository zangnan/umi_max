import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { App, Alert } from 'antd';
import { flushSync } from 'react-dom';
import React, { useState, useRef } from 'react';
import { ProFormText, LoginForm} from '@ant-design/pro-form';
import { history, useModel, useAccess, Helmet, request } from 'umi';
import CompanyModal from '@/pages/hts/user/Login/companyModal';
import myUtil from '@/components/DDAssist/util';
import { ProConfigProvider } from '@ant-design/pro-components';
import { login as loginHts, getXtcspz, getCaptcha} from '@/pages/hts/services/htsApi';
import { login } from '@/services/api';
import CONSTANTS from '@/components/DDAssist/constants';
import './index.less';

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

const Login: React.FC = () => {
  const [ userLoginState, setUserLoginState ] = useState(true);
  const { initialState, setInitialState } = useModel('@@initialState');
  const { message } = App.useApp();
  const access = useAccess(); // 权限
  const refCompanyModal: any = useRef();

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
      // 清空用户信息
      await myUtil.authority.clearUserInfo();
      if(!values.type || values.type != '2'){
        myUtil.localStore.clear('qxQysSaas');
      }
      const params = {...values};
      // 应用开发工具登录
      const msg: any = await login({ ...params }); // 应用开发工具登录
      if (msg.code === '200') {
        if (msg?.body?.token) {
          localStorage.setItem(CONSTANTS.LOGIN.ACCESS_TOKEN_KEY, msg?.body?.token);
        }
        await fetchUserInfo();
      }
      // 慧退税登录
      const msgHts: any = await loginHts({ ...params });
      // const msg: any = await login({ ...values, password: values?.password });
      if (msgHts.code === '200') {
        message.success('登录成功！');
        if (msgHts?.body?.ACCESS_TOKEN) {
          // localStorage.setItem('accessTokenUsername', values.username);
          // localStorage.setItem('accessToken', msgHts?.body?.ACCESS_TOKEN);
          localStorage.setItem('accessTokenUsernameCkts', values.username);
          localStorage.setItem('accessTokenCkts', msgHts?.body?.ACCESS_TOKEN);
          window.localStorage.removeItem('jcfs'); // 集成使用，正常登录时清空jcfs
        }
        const baseHeaders = { 'Content-Type': 'application/json' };
        const urlParams = new URL(window.location.href).searchParams;
        // 第三步：getLoginUserInfo
        const LoginUserInfo: any = await request(`${API_URL_HTS}/hx/qx/token/getLoginUserInfo`, {
          method: 'POST',
          headers: baseHeaders,
          data: {},
        });
        myUtil.sessionStore.setItem('userInfo', LoginUserInfo?.body || {});

        history.push(urlParams.get('redirect') || '/');
        if (ENV_TYPE === 'node') {
          history.push(urlParams.get('redirect') || CONSTANTS.ROUTE.ROUTE_LOGIN_REDIRECT_DEFAULT_DC);
        } else {
          history.push(urlParams.get('redirect') || CONSTANTS.ROUTE.ROUTE_LOGIN_REDIRECT_DEFAULT);
        }
        return;
      } else if (msgHts.code === '201') {
        // 多企业用户
        refCompanyModal.current?.showModal({
          qxQysSaas: msgHts?.body?.qxQysSaas || [],
          loginInfo: values
        });
        myUtil.localStore.setItem('qxQysSaas', msgHts?.body?.qxQysSaas);
        return;
      } else if (msgHts.code === '900') {
        message.error(msgHts.msg);
      } else {
        // 如果失败去设置用户错误信息
        setUserLoginState(false);
        message.error(msgHts.msg);
      }
    } catch (error) {
      // debugger;
      console.log(error);
      message.error('登录失败，请重试！');
    }
  };

  return (
    <ProConfigProvider hashed={false}>
      <Helmet>
        <title> test登录页 - {myUtil?.sys?.getConfig()?.title} </title>
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
      <CompanyModal onRef={refCompanyModal} doSubmit={handleSubmit}/>
    </ProConfigProvider>
  );
};

export default Login;
