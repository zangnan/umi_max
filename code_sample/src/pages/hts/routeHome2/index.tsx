import React, { useEffect, useState, useRef } from 'react';
import './style.less';
import { Spin, Menu, Layout, Space } from 'antd';
import type { MenuProps } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined, OneToOneOutlined, VerifiedOutlined, CoffeeOutlined } from '@ant-design/icons';
import { history } from 'umi';
import myUtil from '@/pages/common/myUtil';
import { fetchMenuData } from '@/services/hts/api';
import RightContent from '@/components/RightContent';

const { Header, Footer, Content } = Layout;

const Index: React.FC<unknown> = () => {

  const [masker, setMasker] = useState(false);
  const [current, setCurrent] = useState('A00');
  const [menuList, setMenuList] = useState<any>([]);

  useEffect(() => {
    const getMenuList = async () => {
      let menuListTmp: any = [];
      let menu: any;
      if (myUtil.sessionStore.getItem('usermenu')) {
        menu = myUtil.sessionStore.getItem('usermenu') || [];
      } else {
        const res = await fetchMenuData({});
        menu = res?.body;
      }
      menu.forEach((item: any) => {
        let iconName: any;
        switch(item.id) {
          case 'A00':
            iconName = <OneToOneOutlined />;
            break;
          case 'A01':
            iconName = <VerifiedOutlined />;
            break;
          case 'A02':
            iconName = <CoffeeOutlined />;
            break;
          case 'A03':
            iconName = <CoffeeOutlined />;
            break;
        }
        menuListTmp.push({ label: item.name, key: item.id, icon: iconName, path: item.path });
      })
      setMenuList(menuListTmp);
      // history.push('/hts/routeHome/workbench');
    };
    getMenuList();
  }, []);

  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
    if (e.key === 'A00') {
      history.push('/hts/routeHome');
    }
    if (e.key === 'A01') {
      history.push('/hts/workplace');
    }
    if (e.key === 'A02') {
      history.push('/jsxj/kpsz/spda');
    }
    if (e.key === 'A03') {
      history.push('/jsxj2/xxgl/ydgl/ysdd');
    }
    if (e.key === 'A99') {
      history.push('/hts/qxgl/yh');
    }
    if (LOCAL_MENU) {
      const menu: any = myUtil.sessionStore.getItem('usermenu');
      const menuItem = menu.filter((item: any) => {
        return e.key === item.id;
      })
      if (menuItem && menuItem.length > 0) {
        history.push(menuItem[0].path);
      }
    };
  };

  const MenuItem = () => {
    const menu:any = [];
    menuList.forEach((item: any) => {
      menu.push(
        <Menu.Item key={item.key}>
          <span>{item.icon}</span>
          <span className='routeHome-menu-item-title'>{item.label}</span>
        </Menu.Item>
      )
    });
    return menu;
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }}>
      {/* <Layout>
        <Header className='routeHome-header ant-pro-top-nav-header-main'>
          <div className='ant-pro-top-nav-header-main-left' style={{marginLeft:'-8px', marginRight:'-26px'}}>
            <div className='ant-pro-top-nav-header-logo' id="logo">
              <span className='dd-logo'></span>
              <h1>慧退税平台</h1>
            </div>
          </div>
          <Menu className='routeHome-menu' onClick={onClick} selectedKeys={[current]} mode="horizontal">
            {MenuItem()}
          </Menu>
          <RightContent />
        </Header>
        <Content>     */}
          <Spin tip="Loading..." spinning={masker} delay={200}>
            <div className="bgPage">
              <div className="bgEmpty"></div>
              <div className="bgPageText">功能建设中...</div>
            </div>
          </Spin>
        {/* </Content>
      </Layout> */}
    </Space>
  );
};
export default Index;