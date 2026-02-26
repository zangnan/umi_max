
import React, { useState, useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined, AntDesignOutlined, BellOutlined, FileExcelOutlined, QuestionOutlined } from '@ant-design/icons';
import { message, Spin, Avatar, Dropdown, Space, Tag, Badge, Popover, Button, List } from 'antd';
import DDSkinSetting from '@/components/DDThemeSetting';
import type { MenuProps } from 'antd';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { flushSync } from 'react-dom';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import { useModel, history } from '@umijs/max';
import { stringify } from 'querystring';
import myUtil from '@/components/DDAssist/util';
import CONSTANTS from '@/components/DDAssist/constants';
import { queryList, queryListNs } from '@/services/api';
import { useAntdConfig, useAntdConfigSetter } from 'umi';
// import { useModel } from 'umi';
// import { outLogin } from '@/services/ant-design-pro/api';

const RightContent: React.FC<any> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [userLoading, setUserLoadin] = useState<boolean>(false);
  const setAntdConfig = useAntdConfigSetter();
  const antdConfig: any = useAntdConfig();

  // 退出登录，并且将当前的 url 保存
  const loginOut = async () => {
    myUtil.sessionStore.clearAll();
    // await outLogin();
    const { search, pathname } = window.location;
    const urlParams = new URL(window.location.href).searchParams;
    /** 此方法会跳转到 redirect 参数所在的位置 */
    const redirect = urlParams.get('redirect');
    // Note: There may be security issues, please note
    if (window.location.pathname !== CONSTANTS.ROUTE.LOGIN && !redirect) {
      history.replace({
        pathname: CONSTANTS.ROUTE.LOGIN,
        search: stringify({
          redirect: pathname + search,
        }),
      });
    }
  };

  const onMenuClick: MenuProps['onClick'] = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        flushSync(() => {
          setInitialState((s: any) => ({ ...s, currentUser: undefined }));
        });
        loginOut();
        return;
      } else if (key === 'settings') {
        if (ENV_TYPE === 'node') {
          history.push('/easy_dev_dc/sys/sys_user_setting');
        } else {
          history.push('/sys/user_setting');
        }
      } else if (key === 'excel') {
        if (ENV_TYPE === 'node') {
          window.open(`${APP_BASE ? '/' + APP_BASE : ''}/easy_dev_dc/agility/excel_agility_f`, '_blank');
        } else {
          window.open(`${APP_BASE ? '/' + APP_BASE : ''}/easy_dev/agility/excel_agility_f`, '_blank');
        }
      } else if (key === 'help') {
        const { pathname } = window.location;
        let code_dm_menu =  myUtil.code.getCode('code_dm_menu');
        let menuCurrent = code_dm_menu.find((tmp: any) => {
          if (ENV_TYPE === 'node') {
            return tmp.menu_path === pathname;
          } else {
            return tmp.menuPath === pathname;
          }
        });
        let menuIdCurrent = ENV_TYPE === 'node' ? menuCurrent?.menu_id : menuCurrent?.menuId;
        let searchModel = [{ op: 'eq', property: ENV_TYPE === 'node' ? 'doc_menu' : 'docMenu', type: 1, value: menuIdCurrent, }];
        let apiSearchList = ENV_TYPE === 'node' ? queryListNs : queryList;
        let searchKey = ENV_TYPE === 'node' ? 'sys_doc_help' : 'm_sys_doc_help';
        apiSearchList({page: 1, pageSize: 999999, searchModel}, searchKey).then((response: any) => {
          if (response?.code === '200' && response?.body?.rowCount > 0) {
            myUtil.modal.viewMarkdown({
              data: ENV_TYPE === 'node' ? response?.body?.rows[0].doc_content3 : response?.body?.rows[0].docContent3,
            });
          } else {
            message.info('当前菜单无帮助文档');
          }
        });
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const actionClassName = useEmotionCss(({ token }: any) => {
    return {
      display: 'flex',
      height: '48px',
      marginLeft: 'auto',
      overflow: 'hidden',
      alignItems: 'center',
      padding: '0 8px',
      cursor: 'pointer',
      borderRadius: token.borderRadius,
      '&:hover': {
        backgroundColor: token.colorBgTextHover,
      },
    };
  });

  if (!initialState) {
    setUserLoadin(true);
  }

  if (!currentUser || !currentUser?.body?.loginName) {
    setUserLoadin(true);
  }

  // Dropdown
  const items: MenuProps['items'] = [
    { key: 'settings', label: '个人设置', icon: <SettingOutlined /> },
    { key: 'help', label: '帮助', icon: <QuestionOutlined /> },
    // { type: 'divider' },
    // { key: 'logout', label: '退出登录', icon: <LogoutOutlined /> },
  ];
  if (currentUser?.body?.loginName === 'admin') {
    items.push({ key: 'excel', label: 'Excel采集', icon: <FileExcelOutlined /> });
  }
  items.push({ key: 'logout', label: '退出登录', icon: <LogoutOutlined /> });

  const avatarLoading = (
    <span className={actionClassName}>
      <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
    </span>
  );

  let avatar = <Avatar icon={<UserOutlined />} size={28}/>;
  if (currentUser?.avatarUrl) {
    avatar = <Avatar src={currentUser?.avatarUrl} alt="avatar" size={28}/>;
  }

  const user = (
    <div style={{cursor: 'pointer'}}>
      <Dropdown menu={{ items, onClick: onMenuClick}}>
        <Space>
          {/* <Badge count={5} size="small"> */}
          {avatar}
          {/* </Badge> */}
          <span className="anticon">{currentUser?.body?.loginName}</span>
        </Space>
      </Dropdown>
    </div>
  );

  const data = [
    { title: 'Ant Design Title 1', description: 'Design,pplications' },
    { title: 'Ant Design Title 2', description: 'At Dnguage for background applications' },
    { title: 'Ant Design Title 3', description: 'Anesign, a ound applications' },
    { title: 'Ant Design Title 4', description: 'esign, a design language for background applications' },
  ];
  const content = (
    <List
      itemLayout="horizontal"
      dataSource={data}
      renderItem={(item, index) => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar size={24} icon={<UserOutlined />} />}
            title={<a href="https://ant.design">{item.title}</a>}
            description={item.description}
          />
        </List.Item>
      )}
    />
  );

  return (
    <div className="head_right_content">
      <Space size='middle' style={{marginRight: '20px'}}>
        {/* <Popover content={content} title="Title">
          <Button type="primary">Hover me</Button>
        </Popover>
        <Badge count={5} size="small">
          <BellOutlined style={{color: '#c0d6ed', position: 'relative', fontSize: '16px', top: '1px' }}/>
        </Badge> */}
        <DDSkinSetting config={{
          setAntdConfig,
          antdConfig
        }} />
        {userLoading ? avatarLoading : user}
      </Space>
    </div>
  );
};
export default RightContent;
