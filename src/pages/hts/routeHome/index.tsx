import React, { useEffect, useState, useRef } from 'react';
import './style.less';
import { Spin, Menu, Layout, Space } from 'antd';
import type { MenuProps } from 'antd';
import { AppstoreOutlined, MailOutlined, SettingOutlined, OneToOneOutlined, VerifiedOutlined, CoffeeOutlined } from '@ant-design/icons';
import { history } from 'umi';
import myUtil from '@/components/DDAssist/util';
import { fetchMenuData } from '@/pages/hts/services/htsApi';
import RightContent from '@/pages/hts/components/RightContent';
import Workbench from './workbench';

const { Header, Footer, Content } = Layout;

const Index: React.FC<unknown> = () => {

  const [masker, setMasker] = useState(false);
  const [current, setCurrent] = useState('A00');
  const [menuList, setMenuList] = useState<any>([]);
  const [isWorkbench, setIsWorkbench] = useState(true);

  const [A00PATH, setA00PATH] = useState<any>();
  const [A01PATH, setA01PATH] = useState<any>();
  const [A02PATH, setA02PATH] = useState<any>();
  const [A03PATH, setA03PATH] = useState<any>();
  const [A99PATH, setA99PATH] = useState<any>();

  useEffect(() => {
    const getMenuList = async () => {
      let menuListTmp: any = [];
      let menu: any = myUtil.sessionStore.getItem('usermenu');
      if (menu && menu.length > 0) {
        menu = myUtil.sessionStore.getItem('usermenu') || [];
      } else {
        const res = await fetchMenuData({});
        menu = res?.body;
      }
      // 获取各模块跳转路径
      setA00PATH(getPathOfId(menu, 'A00'));
      setA01PATH(getPathOfId(menu, 'A01'));
      setA02PATH(getPathOfId(menu, 'A02'));
      setA03PATH(getPathOfId(menu, 'A03'));
      setA99PATH(getPathOfId(menu, 'A99'));

      menu?.forEach((item: any) => {
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
      const tempArr = menuListTmp.find((item: any) => item.key === 'A00');
      if (tempArr == undefined) {
        setIsWorkbench(false);
      } else {
        setIsWorkbench(true);
      }
      setMenuList(menuListTmp);
      // history.push('/hts/routeHome/workbench');
    };
    getMenuList();
  }, []);

  // 获取菜单数据中最内层首个节点数据
  const getMenuFirstPath = (list: any) => {
    let tempList: any;
    if (list?.routes && list?.routes?.length > 0) {
      tempList = getMenuFirstPath(list.routes[0]);
      return tempList;
    } else {
      return list;
    }
  }
  // 根据菜单Id获取菜单数据中最内层首个节点数据
  const getPathOfId = (list: any, id: any) => {
    const tempList = list?.filter((item: any) => item.id === id);
    const tempData = getMenuFirstPath(tempList?.length > 0 ? tempList[0] : {});
    return tempData ? tempData.path : undefined;
  }

  const onClick: MenuProps['onClick'] = (e) => {
    setCurrent(e.key);
    if (e.key === 'A00') {
      history.push('/hts/routeHome');
    }
    if (e.key === 'A01') {
      history.push(A01PATH || '/hts/workplace');
    }
    if (e.key === 'A02') {
      history.push(A02PATH || '/jsxj/kpsz/spda');
    }
    if (e.key === 'A03') {
      history.push(A03PATH || '/jsxj2/xxgl/ydgl/ysdd');
    }
    if (e.key === 'A99') {
      history.push(A99PATH || '/hts/qxgl/yh');
    }
    if (LOCAL_MENU) {
      const menu: any = myUtil.sessionStore.getItem('usermenu');
      const menuItem = menu?.filter((item: any) => {
        return e.key === item.id;
      })
      if (menuItem && menuItem.length > 0) {
        history.push(menuItem[0].path);
      }
    }
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
      <Layout>
        <Header className='routeHome-header ant-pro-top-nav-header-main'>
          <div className='ant-pro-top-nav-header-main-left' style={{marginLeft:'-8px', marginRight:'-26px'}}>
            <div className='ant-pro-top-nav-header-logo' id="logo">
              <span className='dd-logo'></span>
              <h1>慧退税平台</h1>
            </div>
          </div>
          <Menu className='routeHome-menu' onClick={onClick} selectedKeys={[current]} mode="horizontal">
            {MenuItem()}
            {/* <Menu.Item key='A01'><VerifiedOutlined />退税申报管理</Menu.Item>
            <Menu.Item key='A02'><CoffeeOutlined />发票管理</Menu.Item> */}
          </Menu>
          <RightContent />
        </Header>
        <Content>    
          <Spin tip="Loading..." spinning={masker} delay={200}>
            <div className={isWorkbench ? 'bgPage' : 'bgPage1'}>
              {
                isWorkbench ? 
                  <Workbench /> : 
                  <div className="bgEmpty1">
                    <div className='bgEmpty-content'></div>
                  </div>
              } 
            </div>
          </Spin>
        </Content>
      </Layout>
    </Space>
  );
};
export default Index;