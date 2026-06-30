import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, BankOutlined, UserOutlined, LockOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Input, message, Form } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
import './index.less';
import { updatePassw0rd, zhOutLogin } from '@/pages/hts/services/htsApi';
import type { MenuInfo } from 'rc-menu/lib/interface';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import { Base64 } from 'js-base64';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  history.replace({
    pathname: '/user/login',
  });
  const token = localStorage.getItem('accessToken');
  myUtil.authority.clearUserInfo();
  myUtil.localStore.clear('qxQysSaas');
  myUtil.localStore.clear('ywbh');
  await zhOutLogin({}, token);
  return;
  // await outLogin();
  // const { query = {}, pathname } = history.location;
  // const { redirect } = query;
  // // Note: There may be security issues, please note
  // if (window.location.pathname !== '/user/login' && !redirect) {
  //   history.replace({
  //     pathname: '/user/login',
  //     search: stringify({
  //       redirect: pathname,
  //     }),
  //   });
  // }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        setInitialState((s) => ({ ...s, currentUser: undefined }));
        loginOut();
        return;
      } else if(key === 'changePass'){
        const dlmm = currentUser?.qxyh?.dlmm;
        const param: any = {
          yhuuid1Dqlb: currentUser?.qxyh?.yhuuid1,
          dlmm: dlmm,
          yddh: currentUser?.qxyh?.yddh,
          xm: currentUser?.qxyh?.xm,
          sfzjhm: currentUser?.qxyh?.xm,
          yhlxDm: currentUser?.qxyh?.yhlxDm,
          yxbz: currentUser?.qxyh?.yxbz
        }
        DDAlert.open({
          title: '修改密码',
          infoType: 'warning',
          modalType: 'form',
          closeStatus: false,
          isFormContent: true,
          initFormContentValues: { password: dlmm, },
          content: <>
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="旧密码" name="oldPw" rules={[{required: true, message: '请输入旧密码'}]}>
              <Input.Password placeholder="请输入旧密码" maxLength={100} />
            </Form.Item>
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="新密码" name="password" rules={[{required: true, message: '请输入新密码'},() => ({
              validator(_, value) {
                const userInfo = myUtil.sessionStore.getItem('userInfo');
                const mmJyfsCode =userInfo?.xtCs?.mmJyfsCode ;
                if (mmJyfsCode === '2') {
                  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
                  if (value && !passwordRegex.test(value)) {
                    return Promise.reject(new Error('密码需要包含大小写字母及数字'));
                  }
                  if (value && value.length < 12) {
                    return Promise.reject(new Error('密码长度不能小于12位'));
                  }
                  return Promise.resolve();
                }
                const tmpQrPw = DDAlert.getContentFormData()?.qrPw;
                if (tmpQrPw && value && value != tmpQrPw) {
                  return Promise.reject(new Error('新密码与确认密码不匹配，请检查后重试'));
                }
                return Promise.resolve();
              },
            })]}>
              <Input.Password placeholder="请输入新密码" maxLength={100} />
            </Form.Item>
            <Form.Item labelCol={{ span: 6 }} wrapperCol={{ span: 14 }} label="确认密码" name="qrPw" rules={[{required: true, message: '请输入确认密码'},() => ({
              validator(_, value) {
                const userInfo = myUtil.sessionStore.getItem('userInfo');
                const mmJyfsCode =userInfo?.xtCs?.mmJyfsCode ;
                if (mmJyfsCode === '2') {
                  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
                  if (value && !passwordRegex.test(value)) {
                    return Promise.reject(new Error('密码需要包含大小写字母及数字'));
                  }
                  if (value && value.length < 12) {
                    return Promise.reject(new Error('密码长度不能小于12位'));
                  }
                  return Promise.resolve();
                }
                const tmpPw = DDAlert.getContentFormData()?.password;
                if (tmpPw && value && value != tmpPw) {
                  return Promise.reject(new Error('确认密码与新密码不匹配，请检查后重试'));
                }
                return Promise.resolve();
              },
            })]}>
              <Input.Password placeholder="请输入确认密码" maxLength={100} />
            </Form.Item>
          </>,
          okCallbackFn: function (thisObj: any) {
            DDAlert.getForms().validateFields().then((values: any) => {
              if (values && values.oldPw && values.password && values.qrPw) {
                param.oldPw = Base64.encode(values.oldPw);
                param.qrPw = Base64.encode(values.qrPw);
                param.dlmm = Base64.encode(values.password);
                updatePassw0rd(param).then((res:any)=> {
                  const {code, msg} = res;
                  if(code === '200') {
                    message.success('密码修改成功！');
                    DDAlert.close();
                    setInitialState((s) => ({ ...s, currentUser: undefined }));
                    loginOut();
                  } else {
                    message.info(msg);
                  }
                  return
                })
              }
            })
          }
        })
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    // return loading;
  }

  // console.info(currentUser);

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

     <Menu.Item key="login_user">
        <UserOutlined />
        {currentUser?.qxyh?.yddh}
      </Menu.Item>

      {
        currentUser?.qxyh?.yhlxDm != '11' ? <Menu.Item key="login_company">
          <BankOutlined />
          {currentUser?.qxQys[0]?.nsrmc}
        </Menu.Item> : <></>
      }
      <Menu.Divider />
      <Menu.Item key="changePass" className={styles.menuLink} style={{color: '#1b7ed8'}}>
        <LockOutlined />
        修改密码
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="logout" className={styles.menuLink} style={{color: '#1b7ed8'}}>
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown}>
      <span className={`${styles.action} ${styles.account} header_action_icon`} >
        <Avatar className={`${styles.avatar} avatar_user`} icon={<UserOutlined />} size={28}/>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
